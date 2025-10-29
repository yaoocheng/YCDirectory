'use client'
import { useRouter } from 'next/navigation'
import { PencilLine } from 'lucide-react'

export default function EditButton({ id }: { id: string }) {
  const router = useRouter()
  return (
    <PencilLine
      className="cursor-pointer transition-transform hover:scale-110 text-black-200 size-5"
      onClick={() => router.push(`/startup/edit/${id}`)}
    />
  )
}
