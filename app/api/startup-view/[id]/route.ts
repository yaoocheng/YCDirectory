import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Startup } from "@/types/types";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json({ error: "Startup ID is required" }, { status: 400 });
        }

        // 读取startup.json文件
        const startupFilePath = path.join(process.cwd(), 'mock', 'startup.json');
        
        if (!fs.existsSync(startupFilePath)) {
            return NextResponse.json({ error: "Startup data file not found" }, { status: 404 });
        }

        const fileContent = fs.readFileSync(startupFilePath, 'utf-8');
        const startups: Startup[] = JSON.parse(fileContent);
        
        // 查找对应的startup
        const startupIndex = startups.findIndex(startup => startup._id === id);
        
        if (startupIndex === -1) {
            return NextResponse.json({ error: "Startup not found" }, { status: 404 });
        }
        
        // 更新views数据
        startups[startupIndex].views = (startups[startupIndex].views || 0) + 1;
        startups[startupIndex]._updatedAt = new Date().toISOString();
        
        // 保存更新后的数据
        fs.writeFileSync(startupFilePath, JSON.stringify(startups, null, 2));
        
        return NextResponse.json({ 
            success: true, 
            views: startups[startupIndex].views,
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

        // 读取startup.json文件
        const startupFilePath = path.join(process.cwd(), 'mock', 'startup.json');
        
        if (!fs.existsSync(startupFilePath)) {
            return NextResponse.json({ error: "Startup data file not found" }, { status: 404 });
        }

        const fileContent = fs.readFileSync(startupFilePath, 'utf-8');
        const startups: Startup[] = JSON.parse(fileContent);
        
        // 查找对应的startup
        const startup = startups.find(startup => startup._id === id);
        
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