import type { Metadata } from "next";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const workSans = localFont({
    src: [
        {
            path: "./fonts/WorkSans-Black.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "./fonts/WorkSans-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
        {
            path: "./fonts/WorkSans-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "./fonts/WorkSans-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "./fonts/WorkSans-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/WorkSans-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/WorkSans-Black.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "./fonts/WorkSans-Thin.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "./fonts/WorkSans-ExtraLight.ttf",
            weight: "100",
            style: "normal",
        },
    ],
    variable: "--font-work-sans",
});

export const metadata: Metadata = {
    title: "YC Directory",
    description: "Pitch, Vote and Grow",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={workSans.variable}
            >
                <ConfigProvider locale={zhCN} theme={{
                    token: {
                        colorPrimary: '#EE2B69',
                    },
                }}>
                    <AntdRegistry>
                        <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
                            {children}
                        </SessionProvider>
                    </AntdRegistry>
                    <Toaster />
                </ConfigProvider>
            </body>
        </html>
    );
}
