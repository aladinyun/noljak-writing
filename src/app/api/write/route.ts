import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from '@/lib/prompt'
import type { DirectorProfile, WritingConfig, EventContext } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profile, config, eventCtx, photos } = body as {
      profile: DirectorProfile
      config: WritingConfig
      eventCtx?: EventContext
      photos?: Array<{ base64: string; mediaType: string; description?: string }>
    }

    const messages: Anthropic.MessageParam[] = []
    const content: Anthropic.ContentBlockParam[] = []

    // 사진이 있으면 이미지 분석 먼저
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
        text: '위 사진들을 분석해서 각 사진에 담긴 장면, 분위기, 아이들의 모습, 작품의 특징 등을 간단히 설명해주세요. 이 분석은 글쓰기에 활용됩니다.',
      })

      const analysisResp = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        messages: [{ role: 'user', content }],
      })

      const photoDescriptions = analysisResp.content[0].type === 'text'
        ? analysisResp.content[0].text.split('\n').filter(Boolean)
        : []

      const prompt = buildPrompt(profile, config, eventCtx, photoDescriptions)
      const writeResp = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      })
      const text = writeResp.content[0].type === 'text' ? writeResp.content[0].text : ''
      return NextResponse.json({ text, charCount: text.length })
    }

    // 사진 없을 때
    const prompt = buildPrompt(profile, config, eventCtx)
    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = resp.content[0].type === 'text' ? resp.content[0].text : ''
    return NextResponse.json({ text, charCount: text.length })

  } catch (error) {
    console.error('AI write error:', error)
    return NextResponse.json({ error: '글 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
