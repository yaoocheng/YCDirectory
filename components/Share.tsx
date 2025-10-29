'use client'

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Popover } from 'antd';
import Image from 'next/image';

export default function Share({ title }: { title?: string }) {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const [showWechatQR, setShowWechatQR] = useState(false);

    const handleQQShare = () => {
        const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(
            url
        )}&title=${encodeURIComponent(title || '')}`;
        window.open(shareUrl, '_blank');
    };

    const popoverContent = (
        <div className="flex items-center gap-4">
            {/* 微信 */}
            <div
                className="flex flex-col items-center cursor-pointer relative hover:scale-110 transition-transform duration-300"
                onMouseEnter={() => setShowWechatQR(true)}
                onMouseLeave={() => setShowWechatQR(false)}
            >
                <Image src="/assets/wechat.svg" alt="微信" width={24} height={24} style={{ width: 'auto', height: '24px' }} />
                {showWechatQR && (
                    <div className="absolute -left-36 top-0 p-2 bg-white shadow-lg rounded">
                        <QRCodeSVG value={url} size={128} />
                    </div>
                )}
            </div>

            {/* QQ */}
            <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleQQShare}>
                <Image src="/assets/qq.svg" alt="QQ" width={24} height={24} style={{ width: 'auto', height: '24px' }} />
            </div>
        </div>
    );

    return (
        <Popover content={popoverContent} trigger="hover" placement="left">
            <Share2
                className="hover:scale-110 cursor-pointer transition-transform duration-300"
            />
        </Popover>
    );
}
