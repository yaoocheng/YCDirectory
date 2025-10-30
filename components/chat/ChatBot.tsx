"use client"

import { Bot } from "lucide-react"
import ChatModal from "./ChatModal"
import { useState } from "react"

export default function ChatBot() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="fixed bottom-20 right-4">
            <div onClick={() => { setIsModalOpen(true) }} className="bg-white p-3 rounded-full shadow-md cursor-pointer transition-transform duration-300 hover:scale-110">
                <Bot
                    className="text-black"
                    size={24}
                />
            </div>

            <ChatModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    )
}
