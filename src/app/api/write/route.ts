import { hasValidAuthCookie } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from '@/lib/prompt'
import type { DirectorProfile, WritingConfig, EventContext } from '@/lib/types'

export const maxDuration = 90

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MAX_TOKENS: Record<string, number> = {
  blog: 4000,
  insta: 500,
  intro: 4000,
  event: 2000,
  free: 4000,
}

export async function POST(req: NextRequest) {
  if (!hasValidAuthCookie()) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { profile, config, eventCtx, photos } = body as {
      profile: DirectorProfile
      config: WritingConfig
      eventCtx?: EventContext
      photos?: Array<{ base64: string; mediaType: string }>
    }

    const maxTokens = MAX_TOKENS[config.purpose] || 4000
    const content: Array<Anthropic.ImageBlockParam | Anthropic.TextBlockParam> = []

    if (photos && photos.length > 0) {
      for (const photo of photos) {
        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: photo.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: photo.base64,
          },
        })
      }
    content.push({
  type: 'text',
  text: `위 사진들을 놀작마이아트 원장의 글쓰기 재료로 간결하게 분석해주세요.

[분석 규칙]
- 각 사진마다 1~2문장으로만, 핵심 장면·분위기·특징만 간결하게 설명할 것
- 불필요한 수식어나 긴 묘사는 피할 것
- 사진에서 실제로 보이는 내용만 근거로 삼고, 아이의 감정·성격·성과는 단정하지 말 것
- 놀작의 핵심 흐름(실물 관찰 → 자신만의 생각 → 창의표현 → 성장)과 연결 가능한 지점이 보이면 짧게만 덧붙일 것
- 결과는 한국어로 작성

[출력 형식]
사진1: (1~2문장)
사진2: (1~2문장)
사진3: (1~2문장)`,
})

      const analysisResp = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 700,
        messages: [{ role: 'user', content }],
      })

      const photoDescriptions = analysisResp.content[0].type === 'text'
        ? analysisResp.content[0].text.split('\n').filter(Boolean)
        : []

      const prompt = buildPrompt(profile, config, eventCtx, photoDescriptions)
      const writeResp = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      })
      const text = writeResp.content[0].type === 'text' ? writeResp.content[0].text : ''
      return NextResponse.json({ text, charCount: text.length })
    }

    const prompt = buildPrompt(profile, config, eventCtx)
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = resp.content[0].type === 'text' ? resp.content[0].text : ''
    return NextResponse.json({ text, charCount: text.length })

  } catch (error) {
    console.error('AI write error:', error)
    return NextResponse.json({ error: '글 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}