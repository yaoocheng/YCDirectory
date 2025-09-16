import { after } from "next/server";
import Ping from "./Ping";
import { Startup } from "@/types";

const View = async ({ postsData }: { postsData: Startup }) => {
    const views = await postsData.views;

    after(async () => {
        // 这是你更新数据库的代码
        await fetch(`https://${process.env.VERCEL_URL || 'http://localhost:3000'}/api/startup-view/${postsData._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ views: views + 1 })
        });
        
        console.log(`正在更新文章 ${postsData._id} 的浏览量为 ${views + 1}`);
    });

    return (
        <div className="view-container">
            <div className="absolute -top-2 -right-2">
                <Ping />
            </div>

            <p className="view-text">
                <span className="font-black">Views: {views + 1}</span>
            </p>
        </div>
    );
};
export default View;
