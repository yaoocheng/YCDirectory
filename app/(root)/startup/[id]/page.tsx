import React, { Suspense } from 'react'
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import markdownit from 'markdown-it';
import { StartupTypeCard } from '@/components/StartupCard';
import StartupCard from '@/components/StartupCard';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';

async function page({ params }: { params: { id: string } }) {

    const md = markdownit();
    const { id } = await params;

    const response = await fetch(`https://${process.env.VERCEL_URL || 'http://localhost:3000'}/api/startup-query/${id}`, {
        cache: 'no-store' // 确保每次都获取最新数据
    });

    if (!response.ok) {
        return notFound();
    }

    const postsData = await response.json();

    const parsedContent = md.render(postsData.pitch || '');

    const sameResponse = await fetch(`https://${process.env.VERCEL_URL || 'http://localhost:3000'}/api/startup-same/${id}`, {
        cache: 'no-store' // 确保每次都获取最新数据
    });

    const samePostsData = await sameResponse.json();

    return (
        <>
            <section className="pink_container">
                <p className='tag'>{formatDate(postsData._createdAt)}</p>

                <h1 className="heading">{postsData.title}</h1>
                <p className="sub_heading !max-w-5xl">{postsData.description}</p>
            </section>

            <section className="section_container">
                <img src={postsData.image} alt="" className='w-full h-auto rounded-xl' />

                <div className="space-y-5 mt-10 max-w-4xl mx-auto">
                    <div className="flex-between gap-5">
                        <Link
                            href={`/user/${postsData.author?._id}`}
                            className="flex gap-2 items-center mb-3"
                        >
                            <Image
                                src={postsData.author.image}
                                alt="avatar"
                                width={64}
                                height={64}
                                className="rounded-full drop-shadow-lg"
                            />

                            <div>
                                <p className="text-20-medium">{postsData.author.name}</p>
                                <p className="text-16-medium !text-black-300">
                                    @{postsData.author.username}
                                </p>
                            </div>
                        </Link>

                        <p className="category-tag">{postsData.category}</p>
                    </div>

                    <h3 className="text-30-bold">Pitch Details</h3>
                    {parsedContent ? (
                        <article
                            className="prose max-w-4xl font-work-sans break-all"
                            dangerouslySetInnerHTML={{ __html: parsedContent }}
                        />
                    ) : (
                        <p className="no-result">No details provided</p>
                    )}
                </div>

                <hr className="divider" />

                {samePostsData?.length > 0 && (
                    <div className="max-w-4xl mx-auto">
                        <p className="text-30-semibold">Similar startups</p>

                        <ul className="mt-7 card_grid-sm">
                            {samePostsData.slice(0, 3).map((post: StartupTypeCard, i: number) => (
                                <StartupCard key={i} post={post} />
                            ))}
                        </ul>
                    </div>
                )}

                <Suspense fallback={<Skeleton className="view_skeleton" />}>
                    <View postsData={postsData} />
                </Suspense>
            </section>
        </>
    )
}

export default page