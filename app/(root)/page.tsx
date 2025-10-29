import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";
import { getStartups } from "@/lib/db-operations";
import SortButtons from "@/components/SortBtn";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ query?: string | undefined; sort?: 'latest' | 'views' | 'like' | undefined }>;
}) {
    const { query, sort } = (await searchParams);

    try {
        // 直接调用数据库函数获取数据
        const posts = await getStartups(query, sort);

        return (
            <>
                <section className="pink_container">
                    <h1 className="heading">
                        发布你的创业想法
                    </h1>

                    <p className="sub_heading !max-w-3xl">
                        提交创意、参与投票，让你的项目得到关注
                    </p>

                    <SearchForm query={query || ''} />
                </section>

                <section className="section_container">
                    <p className="text-30-semibold mb-2">
                        {query ? `搜索结果："${query}"` : '所有创业项目'}
                    </p>

                    {posts.length > 0 && <SortButtons query={query} />}

                    <ul className="card_grid mt-7">
                        {
                            posts.length > 0 ? posts?.map((post) => (
                                <StartupCard key={post._id} post={post} />
                            )) : (
                                <p className="no-results text-gray-400">暂无数据</p>
                            )
                        }
                    </ul>
                </section>
            </>
        );
    } catch (error) {
        console.error('Error fetching startup data:', error);
        return (
            <div className="section_container">
                <p className="text-red-500">Failed to load startup data. Please try again later.</p>
            </div>
        );
    }
}
