import { NextRequest, NextResponse } from "next/server";
import { getStartupById, updateStartupViews } from '@/lib/db-operations';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json({ error: "Startup ID is required" }, { status: 400 });
        }

        // 检查startup是否存在
        const startup = await getStartupById(id);
        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }
        
        // 增加 views 计数
         const currentViews = startup.views || 0;
         const newViews = currentViews + 1;
         await updateStartupViews(id, newViews);
        
        return NextResponse.json({ 
            success: true, 
            views: newViews,
            message: "Views updated successfully" 
        });
        
    } catch (error) {
        console.error('Error updating startup views:', error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json({ error: "Startup ID is required" }, { status: 400 });
        }

        const startup = await getStartupById(id);
        
        if (!startup) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }
        
        return NextResponse.json({ 
            views: startup.views || 0
        });
        
    } catch (error) {
        console.error('Error getting startup views:', error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}