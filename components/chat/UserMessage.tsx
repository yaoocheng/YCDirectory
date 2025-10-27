export default function UserMessage({ content }: { content: string }) {

    return (
        <div className="flex justify-end">
            <div className="bg-[#EE2B69] text-white rounded-xl px-4 py-2 max-w-xs">
                {content}
            </div>
        </div>
    )
}