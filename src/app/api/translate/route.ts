import { hasValidAuthCookie } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  if (!hasValidAuthCookie()) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const { text, lang } = await req.json()

    const langLabel = lang === 'en' ? '영어(English)' : '베트남어(Tiếng Việt)'
    const langGuide = lang === 'en'
      ? '자연스럽고 전문적인 영어로 번역. 교육 관련 용어는 영어권에서 통용되는 표현 사용.'
      : '자연스럽고 정확한 베트남어로 번역. 교육 관련 용어는 베트남에서 통용되는 표현 사용.'

    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `아래 한국어 글을 ${langLabel}로 번역해주세요.

[번역 규칙]
- ${langGuide}
- 원문의 문체와 어조를 최대한 유지할 것
- 놀작마이아트(NOLJAK MyArt)는 브랜드명이므로 번역하지 말 것
- 번역문만 출력하고 설명이나 부연은 없이

[원문]
${text}`
      }],
    })

    const translated = resp.content[0].type === 'text' ? resp.content[0].text : text
    return NextResponse.json({ text: translated })

  } catch (error) {
    console.error('Translate error:', error)
    return NextResponse.json({ error: '번역 중 오류가 발생했습니다.' }, { status: 500 })
  }
}