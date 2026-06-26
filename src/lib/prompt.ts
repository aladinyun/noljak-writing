import type { DirectorProfile, WritingConfig, EventContext } from './types'

const BLOG_GUIDELINE = `
[블로그 작성 지침 - 반드시 준수]
- 글자 수: 공백 제외 1600~2000자
- 제목: 핵심 키워드를 제목 맨 앞에 넣고 25자 미만
- 본문 구성:
  - 핵심 키워드 5~6회 자연스럽게 반복
  - 이론 + 실제 사례 병행
  - 문단별로 사진 첨부 가능하도록 구성 (사진 위치를 [사진1] [사진2] 형태로 명시)
  - 소제목 활용 권장`

const EVENT_PROMPT = `
너는 15년 역사의 미술교육 브랜드 '놀작마이아트'의 교육 가치를 누구보다 깊이 이해하는 교육원 원장이자 엄마야.
놀작의 교육철학에 공감해 창업했고, 자녀에게 꾸준히 놀작 교육을 받게 한 결과 아이의 성장을 직접 목격한 사람이야.

[작성 조건]
1. 입력된 정보를 바탕으로 아이의 성장 스토리를 중심으로 서술
2. 원장의 전공과 성격이 글의 어조와 문체에 자연스럽게 배어나오도록
3. 따뜻한 ~합니다체 유지
4. 세련된 비유와 구체적 장면 묘사 포함
5. 분량: A4 1매 (공백 포함 900자 내외)
6. 감동적인 제목 자동 생성
7. 결과물(수기 본문)만 출력, 설명이나 부연 없이`

export function buildPrompt(
  profile: DirectorProfile,
  config: WritingConfig,
  eventCtx?: EventContext,
  photoDescriptions?: string[]
): string {
  const photoContext = photoDescriptions && photoDescriptions.length > 0
    ? `\n[첨부 사진 분석]\n${photoDescriptions.map((d, i) => `사진${i + 1}: ${d}`).join('\n')}`
    : ''

  const baseProfile = `
[원장님 정보]
- 이름: ${profile.name}
- 전공: ${profile.major}
- 최종 학력: ${profile.career.education} ${profile.career.degree}
- 주요 경력: ${profile.career.career1} (${profile.career.career1period})${profile.career.career2 ? `, ${profile.career.career2} (${profile.career.career2period})` : ''}
${profile.career.award1 ? `- 수상/업적: ${profile.career.award1}${profile.career.award2 ? `, ${profile.career.award2}` : ''}` : ''}
- 성격: ${profile.personality.join(', ')}
- 문장 호흡: ${profile.sentenceRhythm}
- 감정 표현: ${profile.emotionStyle}
- 글 시작 방식: ${profile.openingStyle}
- 선호 문체: ${profile.writingStyle}
- 글에 녹여줄 단어: ${profile.favWords.filter(Boolean).join(', ') || '없음'}
- 좋아하는 색상: ${profile.likeColor}${profile.likeColorReason ? ` (${profile.likeColorReason})` : ''}
- 조심스러운 색상: ${profile.avoidColor}${profile.avoidColorReason ? ` (${profile.avoidColorReason})` : ''}`

  if (config.purpose === 'event' && eventCtx) {
    return `${EVENT_PROMPT}
${baseProfile}

[아이 성장 이야기]
- 아이 이름/학년: ${eventCtx.childName} / ${eventCtx.childGrade}
- 놀작 시작 시기: ${eventCtx.startAge}
- 시작 전 고민: ${eventCtx.before}
- 수업 후 변화: ${eventCtx.after}
- 자랑거리: ${eventCtx.achievement}
- 놀작에 전하는 말: ${eventCtx.message}
${photoContext}

지금 바로 수기를 작성해주세요:`
  }

  if (config.purpose === 'blog') {
    return `당신은 놀작마이아트 원장님의 개성이 담긴 블로그 글을 대신 써주는 전문 작가입니다.
${BLOG_GUIDELINE}

[글의 주제]
${config.blogTopic}
${photoContext}
${baseProfile}

[작성 규칙]
- 원장님의 문장 스타일(${profile.sentenceRhythm} / ${profile.emotionStyle} / ${profile.openingStyle})을 충실히 반영
- 실제 그 사람이 쓴 것처럼, AI 문투 없이
- 결과물(글)만 출력, 설명 없이

블로그 글을 작성해주세요:`
  }

  if (config.purpose === 'insta') {
    return `당신은 놀작마이아트 원장님의 인스타그램 캡션을 써주는 전문 작가입니다.

[작성 조건]
- 감성적인 첫 문장으로 시작
- 원장님 성격과 문체 반영
- 마지막에 해시태그: ${config.instaTags || ''}
- 분량: 200자 내외
${photoContext}
${baseProfile}

캡션만 출력, 설명 없이:`
  }

  if (config.purpose === 'intro') {
    return `당신은 놀작마이아트 원장님의 소개글을 써주는 전문 작가입니다.

[작성 조건]
- 분량: ${config.introLength || 500}자 내외
- 교육 철학과 놀작 선택 이유 중심
- 신뢰감 있고 따뜻한 어조
${photoContext}
${baseProfile}

소개글만 출력, 설명 없이:`
  }

  return `당신은 놀작마이아트 원장님의 글쓰기를 돕는 전문 작가입니다.

[요청]
${config.freeTopic}
${config.freeLength ? `[분량] ${config.freeLength}` : ''}
${photoContext}
${baseProfile}

[작성 규칙]
- 원장님의 문장 스타일 충실히 반영
- 결과물만 출력, 설명 없이

글을 작성해주세요:`
}
