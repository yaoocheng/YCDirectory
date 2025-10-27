import { ChatAlibabaTongyi } from "@langchain/community/chat_models/alibaba_tongyi";
import { HumanMessage, AIMessage } from "@langchain/core/messages";


const memory: { type: string, content: string }[] = [];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query'); // 用户提问的内容

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const model = new ChatAlibabaTongyi({
                modelName: "qwen-max",
                temperature: 0.7,
                alibabaApiKey: process.env.ALIBABA_API_KEY,
                streaming: true,
                callbacks: [
                    {
                        handleLLMNewToken(token: string) {
                            // 每次输出一个 token，就推送到前端
                            const trimmed = token.trim();
                            if (!trimmed) return;

                            // 生成 SSE
                            controller.enqueue(encoder.encode(`data: ${trimmed}\n\n`));
                        },
                        handleLLMEnd() {
                            // 所有 token 输出完成后，发送 done 事件
                            controller.enqueue(encoder.encode(`event: done\n`));
                            controller.enqueue(encoder.encode(`data: \n\n`));
                            controller.close();
                        },
                        handleLLMError(error: Error) {
                            controller.error(error);
                        },
                    }
                ]
            });

            // 历史消息转成 Langchain 消息格式
            const messages = memory.map((item) => {
                if (item.type === 'user') {
                    return new HumanMessage(item.content);
                } else {
                    return new AIMessage(item.content);
                }
            });

            // 当前用户消息
            const currentUserMessage = new HumanMessage(query || "");

            // 合并历史消息和当前用户消息
            messages.push(currentUserMessage);

            const aiResponse = await model.invoke(messages);

            // 更新 memory
            memory.push({ type: 'user', content: query || "" });
            memory.push({ type: 'bot', content: aiResponse.text });
        },
    });


    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
