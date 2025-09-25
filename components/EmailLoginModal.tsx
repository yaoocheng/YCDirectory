'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Mail, Send } from 'lucide-react'
import { handleEmailLogin } from '@/lib/email-login-action'
import { toast } from 'sonner'

interface EmailLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const EmailLoginModal = ({ isOpen, onClose }: EmailLoginModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await handleEmailLogin(formData)
      if (result?.success) {
        toast.success(result.message)
        onClose()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '发送验证邮件失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5" />
            邮箱登录
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="startup-form_label">
              邮箱地址
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="请输入您的邮箱地址"
              className="startup-form_input"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="text-sm text-gray-600">
            我们将向您的邮箱发送一个登录链接，点击链接即可完成登录。
          </div>
          
          <div className="flex gap-3 text-white">
            {/* <button
              type="button"
              onClick={onClose}
              className="startup-form_btn bg-gray-500 hover:bg-gray-600 flex-1"
            >
              取消
            </button> */}
            <Button
              type="submit"
              className="startup-form_btn flex-1"
              disabled={isLoading}
            >
              {isLoading ? '发送中...' : '发送登录链接'}
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmailLoginModal