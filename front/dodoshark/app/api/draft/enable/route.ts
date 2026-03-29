import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // 获取重定向路径，默认为首页
  const { searchParams } = new URL(request.url)
  const redirectPath = searchParams.get('redirect') || '/'

  // 开启 Next.js Draft Mode
  const draft = await draftMode()
  draft.enable()

  // 完成后跳转
  redirect(redirectPath)
}
