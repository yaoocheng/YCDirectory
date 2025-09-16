import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { auth, signOut, signIn } from '@/auth'

export default async function NavBar() {
    const session = await auth();

    return (
        <>
            <div className='px-5 py-3 bg-white shadow-sm font-work-sans'>
                <nav className='flex justify-between items-center'>
                    <Link href="/">
                        <Image src="/logo.png" alt="logo" width={144} height={30}></Image>
                    </Link>

                    <div className='flex items-center gap-5'>
                        {session && session?.user ? (
                            <>
                                <Link href="/startup/create">
                                    <span>Create</span>
                                </Link>

                                <button className='cursor-pointer' onClick={async () => {
                                    'use server'

                                    await signOut({ redirectTo: '/' })
                                }}>
                                    <span className='text-red-600'>logout</span>
                                </button>

                                <Link href={`/user/${session?.user?.id}`}>
                                    {/* <span>{session?.user?.name}</span> */}
                                    <Image className='rounded-[50%]' src={session.user?.image as string} alt={session.user?.name as string} width={30} height={30}></Image>

                                </Link>

                            </>

                        ) : (
                            <button className='cursor-pointer' onClick={async () => {
                                'use server'

                                await signIn({ provider: 'github' })
                            }}>
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </>
    )
}
