import { hasValidAuthCookie } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  if (!hasValidAuthCookie()) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }
  try {
    const { text } = (await req.json()) as { text?: string }
    if (!text || !text.trim()) {
      return NextResponse.json({ error: '요약할 텍스트가 없습니다.' }, { status: 400 })
    }

    const prompt = `다음은 원장이 참고하려고 신문기사·블로그에서 직접 복사해 붙여넣은 텍스트입니다.
이 텍스트에서 핵심 팩트와 키워드만 3~5줄로 요약해주세요.

[요약 규칙]
- 원문 문장을 그대로 재사용하지 말 것 (문장을 통째로 옮기지 말 것)
- 의견·수식어는 걷어내고 사실관계(팩트)와 핵심 키워드 위주로 압축할 것
- 각 줄은 '- '로 시작하는 간결한 항목으로 작성
- 3줄 이상 5줄 이하
- 한국어로 작성

[참고 텍스트]
${text}

요약만 출력하세요:`

    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const summary = resp.content[0].type === 'text' ? resp.content[0].text.trim() : ''
    return NextResponse.json({ summary })
  } catch (error) {
    console.error('summarize-reference error:', error)
    return NextResponse.json({ error: '요약 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
