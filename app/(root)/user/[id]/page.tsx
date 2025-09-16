import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import UserStartups from "@/components/UserStartups";
import { Suspense } from "react";
import { StartupFallback } from "@/components/StartupFallback";


const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const userRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/user-query/${id}`, {
    method: "GET",
    cache: "no-cache",
  });

  const user = await userRes.json();
  if (user.error) return notFound();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/startup-user/${id}`, {
    method: "GET",
    cache: "no-cache",
  });

  const startupUserData = await res.json();

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
            {session?.user?.id === id ? "Your" : "All"} Startups
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupFallback />}>
              <UserStartups startupUserData={startupUserData} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
