import { formatDate } from "@/lib/utils";
import { EyeIcon,Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Startup } from "@/types/types";
import { auth } from "@/auth";
import { ThumbsUp } from "lucide-react"
import { deleteStartupById } from "@/lib/db-operations";
import EditStartup from "@/components/EditStartup";

const StartupCard = async ({ id, post }: { id?: string, post: Startup }) => {
    const {
        _createdAt,
        views,
        author,
        title,
        category,
        _id,
        image,
        likes_count,
        description,
    } = post;

    const session = await auth();

    const deleteStartup = async () => {
        "use server";
        try {
            await deleteStartupById(_id);
            revalidatePath(`/user/${id}`);
        } catch (error) {
            console.error("Error deleting startup:", error);
        }
    };

    return (
        <li className="startup-card group">
            <div className="flex-between">
                <p className="startup_card_date">{formatDate(_createdAt.toString())}</p>
                <div className="flex items-center gap-2">
                    <div className="flex items-start gap-1">
                        <ThumbsUp className="size-5 text-primary" />
                        <span className="text-16-medium">{likes_count}</span>
                    </div>
                    <div className="flex items-start gap-1">
                        <EyeIcon className="size-6 text-primary" />
                        <span className="text-16-medium">{views}</span>
                    </div>
                </div>

            </div>

            <div className="flex-between mt-5 gap-5">
                <div className="flex-1">
                    <Link href={`/user/${author?._id}`}>
                        <p className="text-16-medium line-clamp-1">{author?.name}</p>
                    </Link>
                    <Link href={`/startup/${_id}`}>
                        <h3 className="text-26-semibold line-clamp-1 break-all">{title}</h3>
                    </Link>
                </div>
                {author?.image && author?.name && (
                    <Link href={`/user/${author._id}`}>
                        <Image
                            src={author.image}
                            alt={author.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                    </Link>
                )}
            </div>

            <Link href={`/startup/${_id}`}>
                <p className="startup-card_desc">{description}</p>

                {image && (
                    <Image
                        src={image}
                        alt={title || "Startup image"}
                        width={300}
                        height={200}
                        className="startup-card_img"
                    />
                )}
            </Link>

            <div className="flex-between gap-3 mt-5">
                <Link href={`/?query=${category?.toLowerCase()}`}>
                    <p className="text-16-medium">{category}</p>
                </Link>

                <div className="flex gap-2 items-center">
                    {id && session?.user?.id === id && (
                        <div className="flex gap-2 items-center">
                            <EditStartup id={_id} />
                            <Trash2 onClick={deleteStartup} className="size-5 cursor-pointer transition-transform hover:scale-110 text-black-200" />
                        </div>
                    )}
                    <Button className="startup-card_btn" asChild>
                        <Link href={`/startup/${_id}`}>详情</Link>
                    </Button>
                </div>
            </div>
        </li>
    );
};

// export const StartupCardSkeleton = () => (
//     <>
//         {[0, 1, 2, 3, 4].map((index: number) => (
//             <li key={cn("skeleton", index)}>
//                 <Skeleton className="startup-card_skeleton" />
//             </li>
//         ))}
//     </>
// );

export default StartupCard;
