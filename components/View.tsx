import { after } from "next/server";
import Ping from "./Ping";
import { updateStartupViews } from "@/lib/db-operations";
import { Startup } from "@/types/types";

// 数据库返回的Startup类型

const View = async ({ postsData }: { postsData: Startup }) => {
    const views = postsData.views || 0;

    after(() => {
        // 直接调用数据库函数更新浏览量
        updateStartupViews(postsData._id, views + 1);
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
