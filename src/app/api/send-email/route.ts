import { hasValidAuthCookie } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, name, text, purpose } = await req.json()

    const purposeLabel: Record<string, string> = {
      blog: '블로그 글',
      insta: '인스타그램 캡션',
      intro: '소개글',
      event: '이벤트 응모글',
      free: '작성 글',
    }

    if (!hasValidAuthCookie()) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noljak@noljak.global',
      to: [email],
      subject: `[놀작 글쓰기 지원] ${name} 원장님 ${purposeLabel[purpose] || '작성 글'}`,
      text: `안녕하세요, ${name} 원장님!\n\n아래는 AI가 작성한 글입니다.\n\n---\n\n${text}\n\n---\n\n놀작에듀 글쓰기 지원 서비스\nwrite.noljak.global`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: '이메일 발송 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
