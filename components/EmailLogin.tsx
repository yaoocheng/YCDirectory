'use client'

import React, { useState } from 'react';
import { Mail } from 'lucide-react'
import EmailLoginModal from './EmailLoginModal'

function EmailLoginComp() {
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

    return (
        <>
            <button 
                className='cursor-pointer bg-[#a4a4a4] flex items-center justify-center text-center w-6 h-6 rounded-[50%]'
                onClick={() => setIsEmailModalOpen(true)}
            >
                <Mail className="text-white" size={14} />
            </button>
            
            <EmailLoginModal 
                isOpen={isEmailModalOpen} 
                onClose={() => setIsEmailModalOpen(false)} 
            />
        </>
    )
}

export default EmailLoginComp