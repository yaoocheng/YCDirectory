import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { StartupFallback } from "@/components/StartupFallback";
import { getAuthorById, getStartupsByAuthor } from "@/lib/db-operations";


export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const user = await getAuthorById(id);
    return {
        title: `${user?.name}`,
        description: user?.bio || '',
    }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  try {
    // 直接调用数据库函数获取用户信息
    const user = await getAuthorById(id);
    if (!user) return notFound();

    // 直接调用数据库函数获取用户的startup数据
     const startupUserData = await getStartupsByAuthor(id);

    return (
      <>
        <section className="profile_container">
          <div className="profile_card">
            <div className="profile_title">
              <h3 className="text-24-black uppercase text-center line-clamp-1">
                {user?.name}
              </h3>
            </div>

            <Image
              src={user?.image as string} 
              alt={user?.name as string}
              width={220}
              height={220}
              className="profile_image"
            />

            <p className="text-30-extrabold mt-7 text-center">
              @{user?.username}
            </p>
            <p className="mt-1 text-center text-14-normal">{user?.bio}</p>    
          </div>

          <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
            <p className="text-30-bold">
              {session?.user?.id === id ? "您的创业项目" : "他的创业项目"} 
            </p>
            <ul className="card_grid-sm">
              <Suspense fallback={<StartupFallback />}>
                <UserStartups id={id} startupUserData={startupUserData} />
              </Suspense>
            </ul>
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
    return notFound();
  }
};

export default Page;
