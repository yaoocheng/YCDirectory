'use client'

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { SmilePlus } from 'lucide-react';
import { Input, Button, List, Avatar } from 'antd';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
const { TextArea } = Input;

export type Comment = {
    id: string;
    author_name: string;
    author_image?: string;
    content: string;
    created_at: string;
};

export default function Comments({ startupId, comments }: { startupId: string, comments: Comment[] }) {
    const [inputValue, setInputValue] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [commentsState, setCommentsState] = useState<Comment[]>(() => comments);
    const { data: session } = useSession();

    const handleSubmit = async () => {
        if (!session?.user?.id) {
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/add-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startupId,
                    userId: session.user.id,
                    content: inputValue,
                }),
            });

            if (!res.ok) {
                console.error('添加评论失败:', res.statusText);
                return;
            }

            setInputValue('');
            setCommentsState((prev) => [{
                id: Date.now().toString(),
                author_name: session.user.name || '',
                author_image: session.user.image || '',
                content: inputValue,
                created_at: new Date().toISOString(),
            }, ...prev]);
        } catch (error) {
            console.error('添加评论时出错:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="simple-comment mt-5">
            <div className="text-xl font-bold mb-3">
                评论 {commentsState.length}
            </div>
            {/* 评论输入框 */}
            <div className="flex flex-col gap-3 mb-4 items-end">
                <TextArea
                    rows={3}
                    disabled={!session?.user?.id}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    placeholder="哎呦，不错哦，评论一下吧"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />

                <div className="w-full flex items-start justify-between">
                    <Popover>
                        <PopoverTrigger asChild>
                            <SmilePlus className="w-5 h-5 transition hover:scale-110 text-gray-400 cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent side='right' className="w-auto bg-white p-0">
                            <Picker data={data} onEmojiSelect={(emoji: any) => setInputValue(inputValue + emoji.native)} />
                        </PopoverContent>
                    </Popover>
                    <Button
                        type="primary"
                        className="w-20"
                        onClick={handleSubmit}
                        loading={submitting}
                        disabled={!inputValue.trim()}
                    >
                        提交
                    </Button>
                </div>
            </div>

            {/* 评论列表 */}
            {commentsState.length === 0 ? (
                <p className="no-results text-center text-gray-400">暂无评论</p>
            ) : <List
                dataSource={commentsState}
                itemLayout="horizontal"
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.author_image} />}
                            title={item.author_name}
                            description={
                                <>
                                    <p className='text-black text-sm my-1.5'>{item.content}</p>
                                    <span className="text-gray-400 text-xs">
                                        {formatDate(item.created_at)}
                                    </span>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />}
        </div>
    );
}
