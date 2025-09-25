'use server'

import { signIn } from '@/auth'

export async function handleEmailLogin(formData: FormData) {
  const email = formData.get('email') as string
  
  if (!email) {
    throw new Error('请输入邮箱地址')
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('请输入有效的邮箱地址')
  }

  try {
    const result = await signIn('http-email', {
      email,
      redirect: false,
    })
    
    // 如果成功，可以重定向到确认页面或显示成功消息
    if (!result?.error) {
      // 这里可以重定向到一个确认页面
      // redirect('/email-sent')
      return { success: true, message: '验证邮件已发送，请检查您的邮箱' }
    } else {
      throw new Error('发送验证邮件失败')
    }
  } catch (error) {
    console.error('Email login error:', error)
    throw new Error('发送验证邮件失败，请稍后重试')
  }
}