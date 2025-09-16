
import NavBar from '@/components/NavBar'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="font-work-sans">
            <NavBar />
            {children}
        </main>
    )
}