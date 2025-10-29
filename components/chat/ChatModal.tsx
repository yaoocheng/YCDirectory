import { Modal } from "antd";
import { Bot, X } from "lucide-react"
import ChatInput from "./ChatInput"
import BotMessage from "./BotMessage"
import UserMessage from "./UserMessage"
import { useRef, useState, useCallback } from "react"
import { Message } from "@/types"
import ScrollToBottom from 'react-scroll-to-bottom';

// 滚动，汉字回车，暂停回答，滚动影响查看问题


export default function ChatModal({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (isModalOpen: boolean) => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { type: 'bot', content: '想问点什么呢？ 🤔' },
    ]);
    const [loading, setLoading] = useState(false);
    const [isOutputting, setIsOutputting] = useState(false);
    const currentController = useRef<AbortController | null>(null);

    // 处理中断输出
    const handleAbort = useCallback(() => {
        currentController.current?.abort();
    }, []);

    // 处理用户发送消息
    const handleSend = useCallback(async (userMessage: string, controller: AbortController) => {
        currentController.current = controller;
        // const bufferTime = 50;
        // let lastUpdateTime = Date.now();

        try {
            setLoading(true);
            setIsOutputting(true);

            setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
            setMessages(prev => [...prev, { type: 'bot', content: '' }]);

            const es = new EventSource(`/api/chat?query=${encodeURIComponent(userMessage)}`);

            let content = '';

            es.onmessage = (event) => {
                setLoading(false);
                const token = event.data;
                content += token;
                // if (Date.now() - lastUpdateTime > bufferTime) {
                // lastUpdateTime = Date.now();
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastOne = newMessages[newMessages.length - 1];
                    newMessages[newMessages.length - 1] = {
                        ...lastOne,
                        content
                    };
                    return newMessages;
                });
                // }
            }

            es.addEventListener('done', () => {
                es.close();
                setIsOutputting(false);
            })

            es.onerror = (error) => {
                console.error('EventSource error:', error);
                setIsOutputting(false);
                // setMessages(prev => {
                //     return [...prev].slice(0, -1);
                // });
            };

            currentController.current?.signal?.addEventListener("abort", () => {
                es.close(); // 中断输出
                setIsOutputting(false);
            });
        } catch (error) {
            setLoading(false);
        }
    }, [])

    return (
        <Modal
            styles={{
                content: { padding: 0, width: 480, maxWidth: '95vw' }, // 保持你的内容高度
                body: { padding: 0, height: 500 },
                header: { backgroundColor: "#EE2B69", borderRadius: "8px 8px 0 0", padding: "16px", marginBottom: 0 },
            }}
            centered
            closeIcon={<X className="text-white" strokeWidth={1.75} />}
            title={
                <div className="flex items-center gap-2 text-white">
                    <Bot />
                    <span className="font-semibold text-white">ChatBot</span>
                </div>
            }
            closable
            onCancel={() => setIsModalOpen(false)}
            open={isModalOpen}
            footer={null}
        >
            <div className="flex flex-col w-full items-center justify-between gap-4 h-full p-4 py-6">
                <ScrollToBottom className="flex-1 w-full overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            message.type === 'user' ? (
                                <UserMessage key={index} content={message.content} />
                            ) : (
                                loading && index === messages.length - 1 ? (
                                    <div key={index} className="h-8 flex items-center">
                                        <div className="loader"></div>
                                    </div>
                                ) : (
                                    <BotMessage key={index} isLast={index === messages.length - 1} isOutputting={isOutputting} content={message.content} />
                                )
                            )
                        ))}
                    </div>
                </ScrollToBottom>

                <ChatInput handleSend={handleSend} handleAbort={handleAbort} isOutputting={isOutputting} />
            </div>
        </Modal>
    );
}
