import { Bot } from "lucide-react"
import markdownit from 'markdown-it';

const md = markdownit();

export default function BotMessage({ isLast, isOutputting, content }: { isLast: boolean, isOutputting: boolean, content: string }) {
    let htmlContent = md.render(content).trim();

    if(isOutputting&&isLast) {
        const cursorHtml = '<span class="typing-cursor"></span>';

        const pTagIndex = htmlContent.lastIndexOf('</p>');
        if (pTagIndex !== -1 && pTagIndex === htmlContent.length - 4) {
            // 如果是以 </p> 结束，则在 </p> 之前插入光标
            htmlContent = htmlContent.slice(0, pTagIndex) + cursorHtml + htmlContent.slice(pTagIndex);
        } 
    }
    return (
        <div className="flex items-start space-x-3">
            {/* 头像 */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#EE2B69] flex items-center justify-center">
                <Bot className="text-white w-5 h-5" />
            </div>
            {/* 消息内容 */}
            <div style={{
                transition: 'opacity 0.1s ease-out, color 0.1s ease-out',
                // 在内容更新时，浏览器会尽量让新出现的文本遵循这个过渡
                // 初始时让文本颜色略微柔和（可选，但增强效果）
                // opacity: 0.9, // 如果你希望文本总是略微透明
            }} className="bg-[#FFE8F0] text-black rounded-xl px-4 py-2 max-w-xs">
                <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
                {/* {isOutputting && isLast && (
                    <span className="typing-cursor"></span>
                )} */}
            </div>
        </div>
    )

}