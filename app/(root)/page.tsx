import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const query = (await searchParams).query;

    // 通过API请求获取数据，包含搜索查询参数
    const searchQuery = query ? `?query=${encodeURIComponent(query)}` : '';
    const response = await fetch(`https://${process.env.VERCEL_URL || 'http://localhost:3000'}/api/startup-data${searchQuery}`, {
        cache: 'no-store' // 确保每次都获取最新数据
    });

    if (!response.ok) {
        throw new Error('Failed to fetch startup data');
    }

    const postsData = await response.json();

    // 转换日期字符串为Date对象
    const posts: StartupTypeCard[] = postsData.map((post: {
        _id: string;
        _type: string;
        _createdAt: string;
        _updatedAt: string;
        _rev: string;
        views: number;
        author: {
            _id: string;
            _type: string;
            _createdAt: string;
            _updatedAt: string;
            _rev: string;
            name: string;
            username: string;
            email: string;
            image: string;
            bio: string;
        };
        category: string;
        title: string;
        description: string;
        image: string;
        pitch: string;
    }) => ({
        ...post,
        _createdAt: new Date(post._createdAt),
        _updatedAt: new Date(post._updatedAt),
        author: {
            ...post.author,
            _createdAt: new Date(post.author._createdAt),
            _updatedAt: new Date(post.author._updatedAt),
        },
    }));

    return (
        <>
            <section className="pink_container">
                <h1 className="heading">Pitch Your Startup,
                    Connect with Entrepreneurs</h1>

                <p className="sub_heading !max-w-3xl">Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions</p>

                <SearchForm query={query || ''} />
            </section>

            <section className="section_container">
                <p className="text-30-semibold">
                    {query ? `Search result for "${query}"` : 'All Startup'}
                </p>

                <ul className="card_grid mt-7">
                    {
                        posts.length > 0 ? posts?.map((post) => (
                            <StartupCard key={post._id} post={post} />
                        )) : (
                            <p className="no-results">No startups found</p>
                        )
                    }
                </ul>
            </section>
        </>
    );
}
