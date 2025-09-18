import React, { Suspense } from 'react'
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import markdownit from 'markdown-it';
import StartupCard from '@/components/StartupCard';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import { getStartupById, getSimilarStartups } from '@/lib/db-operations';

async function page({ params }: { params: { id: string } }) {

    const md = markdownit();
    const { id } = await params;

    try {
        // 直接调用数据库函数获取startup详情
        const postsData = await getStartupById(id);

        if (!postsData) {
            return notFound();
        }

        const parsedContent = md.render(postsData.pitch || '');

        // 直接调用数据库函数获取相似的startup
        const samePostsData = await getSimilarStartups(id, postsData.category || '', 5);

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
                                    src={postsData.author?.image as string}
                                    alt={postsData.author?.name as string}
                                    width={64}
                                    height={64}
                                    className="rounded-full drop-shadow-lg"
                                />
                                <div>
                                    <p className="text-20-medium">{postsData.author?.name}</p>
                                    <p className="text-16-medium !text-black-300">@{postsData.author?.username}</p>
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
                            <p className="text-30-semibold">Similar Startups</p>
                            <ul className="mt-7 card_grid-sm">
                                {samePostsData.map((post, i: number) => (
                                    <StartupCard key={i} post={post} />
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                <Suspense fallback={<Skeleton className="view_skeleton" />}>
                    <View postsData={postsData} />
                </Suspense>
            </>
        );
    } catch (error) {
        console.error('Error fetching startup data:', error);
        return notFound();
    }
}

export default page