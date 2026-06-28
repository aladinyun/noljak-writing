import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `아래 글의 맞춤법, 띄어쓰기, 문장 부호 오류를 교정해주세요.

[교정 규칙]
- 맞춤법과 띄어쓰기만 교정하고 문장 내용·표현·단어는 절대 바꾸지 말 것
- 원문의 문체, 어조, 구조를 그대로 유지할 것
- 교정된 글만 출력하고 설명이나 부연은 없이

[원문]
${text}`
      }],
    })

    const corrected = resp.content[0].type === 'text' ? resp.content[0].text : text
    return NextResponse.json({ text: corrected })

  } catch (error) {
    console.error('Spell check error:', error)
    return NextResponse.json({ error: '맞춤법 검사 중 오류가 발생했습니다.' }, { status: 500 })
  }
}