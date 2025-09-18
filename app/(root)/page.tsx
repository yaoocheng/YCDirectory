import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";
import { getStartups } from "@/lib/db-operations";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const query = (await searchParams).query;

    try {
        // 直接调用数据库函数获取数据
        const posts = await getStartups(query || undefined);

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
    } catch (error) {
        console.error('Error fetching startup data:', error);
        return (
            <div className="section_container">
                <p className="text-red-500">Failed to load startup data. Please try again later.</p>
            </div>
        );
    }
}
