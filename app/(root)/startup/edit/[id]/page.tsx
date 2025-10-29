import StartupForm from "@/components/StartupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStartupById } from "@/lib/db-operations";
import { Startup } from "@/types";

const Page = async ({ params }: { params: { id: string } }) => {
  const session = await auth();

  if (!session) redirect("/");

  const postData: Startup | null = await getStartupById(params.id);

  return (
    <>
      {/* <section className="pink_container !min-h-[230px]">
        <h1 className="heading">提交您的创业想法</h1>
      </section> */}

      <StartupForm postData={postData} />
    </>
  );
};

export default Page;
