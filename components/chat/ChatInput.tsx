import React from 'react';
import { Input } from 'antd';
import { useState } from 'react';
import { Send, OctagonPause } from 'lucide-react';
 
const ChatInput: React.FC<{ isOutputting: boolean, handleAbort: () => void, handleSend: (userMessage: string, controller: AbortController) => void }> = ({ isOutputting, handleAbort, handleSend }) => {
    const [inputValue, setInputValue] = useState('');
    const [composing, setComposing] = useState(false); // 输入法中状态

    return (
        <>
            <div className='flex items-center w-full relative'>
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !composing && inputValue.trim()) {
                            setInputValue('');
                            handleSend(inputValue, new AbortController());
                        }
                    }}
                    onCompositionStart={() => setComposing(true)}
                    onCompositionEnd={() => setComposing(false)}
                    placeholder="发送你的消息..."
                    style={{
                        borderRadius: '50px',
                        paddingRight: '50px'
                    }}
                    className="h-12 px-4 flex-1"
                />
                {
                    isOutputting ? (
                        <OctagonPause onClick={() => handleAbort()} strokeWidth={1.75} className='text-black-200 cursor-pointer text-xs absolute right-4 top-1/2 transform -translate-y-1/2' />
                    ) : (
                        <Send onClick={() => {
                            handleSend(inputValue, new AbortController());
                            setInputValue('');
                        }} className='text-black-200 cursor-pointer text-xs absolute right-4 top-1/2 transform -translate-y-1/2' />
                    )
                }
            </div>
        </>

    );
};

export default React.memo(ChatInput);
