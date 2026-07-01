import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from '@/lib/prompt'
import type { DirectorProfile, WritingConfig, EventContext } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MAX_TOKENS: Record<string, number> = {
  blog: 4000,
  insta: 500,
  intro: 4000,
  event: 2000,
  free: 4000,
}

export async function POST(req: NextRequest) {
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
  text: `위 사진들을 놀작마이아트 원장의 블로그 글쓰기 재료로 분석해주세요.

[분석 목표]
사진을 단순히 묘사하지 말고, 원장이 블로그 글에 자연스럽게 녹여 쓸 수 있는 교육적 장면과 개별화 포인트를 찾아주세요.

[사진별로 반드시 분석할 항목]
1. 장면 요약: 사진에 보이는 수업 상황, 공간, 작품, 재료
2. 아이의 행동: 관찰, 선택, 표현, 몰입, 협업, 완성 과정 중 보이는 행동
3. 작품 특징: 색, 선, 형태, 구성, 재료 사용, 표현 방식
4. 교육적 의미: 실물 관찰, 자신만의 생각, 창의표현, 성장과 연결되는 지점
5. 글에 넣기 좋은 구체 문장: 원장이 블로그에 그대로 활용할 수 있는 자연스러운 문장 2개
6. 주의할 점: 사진만으로 단정하면 안 되는 내용

[출력 형식]
사진1:
- 장면 요약:
- 아이의 행동:
- 작품 특징:
- 교육적 의미:
- 글에 넣기 좋은 문장:
  1)
  2)
- 주의할 점:

사진2:
...

[중요 규칙]
- 사진에서 실제로 보이는 내용만 근거로 삼아주세요.
- 아이의 감정, 성격, 능력, 수업 성과를 단정하지 마세요.
- 보이지 않는 정보는 추측하지 말고 "사진만으로는 확인하기 어렵다"고 써주세요.
- 놀작마이아트의 핵심 흐름인 "실물 관찰 → 자신만의 생각 → 창의표현 → 성장"과 연결 가능한 지점을 찾아주세요.
- 결과는 한국어로 작성해주세요.`,
})

      const analysisResp = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1800,
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