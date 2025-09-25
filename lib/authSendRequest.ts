interface SendVerificationRequestParams {
  identifier: string
  url: string
  provider: {
    id: string
    name: string
    type: string
  }
}

export async function sendVerificationRequest({
  identifier: email,
  url,
}: SendVerificationRequestParams) {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: process.env.EMAIL_FROM },
      subject: "YC Directory - 邮箱登录验证",
      content: [
        {
          type: "text/plain",
          value: `欢迎使用 YC Directory！请点击以下链接完成登录验证：${url}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const { errors } = await response.json()
    throw new Error(JSON.stringify(errors))
  }
}
