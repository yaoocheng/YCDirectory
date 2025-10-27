
import NavBar from '@/components/NavBar'
import ChatBot from '@/components/chat/ChatBot'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-work-sans">
            <NavBar />
            {children}

            <ChatBot />
        </main>
    )
}