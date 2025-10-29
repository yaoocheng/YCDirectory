"use client"

import { motion } from "motion/react"
import { useState, useRef, useEffect } from "react"
import { ThumbsUp } from "lucide-react"
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const particles = Array.from({ length: 8 }) // 8个粒子

export default function LikeButton() {
    const [liked, setLiked] = useState(false)
    const [likesNum, setLikesNum] = useState(0)
    const timerRef = useRef<number>(0);
    const { data: session } = useSession();
    const { id } = useParams();

    // 检查当前用户是否已点赞
    const checkLiked = async () => {
        if (!session) {
            return;
        }

        try {
            const response = await fetch("/api/has-liked", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startupId: id }),
            });
            if (response.status !== 200) {
                toast.error(response.statusText);
                return;
            }
            const data = await response.json();
            setLiked(data.liked);
            setLikesNum(data.likesNum);
        } catch (error) {
            console.error("Error checking like status:", error);
        }
    }

    useEffect(() => {
        checkLiked();
    }, []);


    const likehandle = async () => {
        if (!session) {
            toast.error("请登录");
            return;
        }
        setLiked(!liked);
        setLikesNum(liked ? likesNum - 1 : likesNum + 1);

        // 防止快速点击
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(async () => {
            // 点赞或取消点赞
            try {
                const response = await fetch("/api/like", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startupId: id, liked }),
                });

                if (!response.ok) {
                    toast.error(response.statusText);
                    return;
                }
                await response.json();
                clearTimeout(timerRef.current);
                // toast.success(liked ? "unliked" : "liked");
            } catch (error) {
                console.error("Error liking startup:", error);
            }
        }, 1500);

    }

    return (
        <div className="relative flex gap-1 items-center">
            {/* 粒子层 */}
            {liked &&
                particles.map((_, i) => {
                    const angle = (i / particles.length) * Math.PI * 2
                    const x = Math.cos(angle) * 40
                    const y = Math.sin(angle) * 40

                    return (
                        <motion.span
                            key={i}
                            className="absolute left-2 top-2 w-2 h-2 rounded-full"
                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                            animate={{ x, y, scale: 1, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            ❤️
                        </motion.span>
                    )
                })}

            {/* 心形图标 */}
            <motion.button
                onClick={likehandle}
                whileTap={{ scale: 0.9 }}
                className="relative vertical-center"
            >
                <ThumbsUp
                    className={`w-6 h-6 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                />
            </motion.button>

            {likesNum > 0 ? (
                <p className="text-16-medium text-black">{likesNum}</p>
            ) : (
                <p className="text-sm text-black-300">点赞</p>
            )}
        </div>
    )
}
