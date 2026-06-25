import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from '@/lib/prompt'
import type { DirectorProfile, WritingConfig, EventContext } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profile, config, eventCtx } = body as {
      profile: DirectorProfile
      config: WritingConfig
      eventCtx?: EventContext
    }

    const prompt = buildPrompt(profile, config, eventCtx)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const charCount = text.length

    return NextResponse.json({ text, charCount })
  } catch (error) {
    console.error('AI write error:', error)
    return NextResponse.json({ error: '글 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
