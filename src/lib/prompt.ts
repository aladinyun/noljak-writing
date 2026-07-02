import type { DirectorProfile, WritingConfig, EventContext } from './types'

const NOLJAK_MASTER_GUIDELINE = `
[놀작마이아트 콘텐츠 마스터 지침 - 반드시 준수]

1. 브랜드 정체성
- 놀작의 정의: "미술로 시작하는 창의교육"
- 창의미술, 미술학원, 미술교습소 표현은 문맥에 따라 사용 가능
- "미술교육 프로그램"으로 축소하는 표현은 사용 금지
- 핵심 공식: 실물 관찰 → 사고(자신만의 생각) → 창의표현 → 성장
- "관찰"이 아니라 반드시 "실물 관찰"로 표현
- 슬로건: "생각하는 관찰, 창의적인 표현의 놀작, 공부가 되다." (변형 금지)

2. AI시대 포지셔닝
- 핵심 메시지: "AI는 대신 경험할 수 없습니다. 놀작은, 그 경험을 만드는 곳입니다."
- "AI시대 인재" 같은 닳은 문구 사용 금지
- 핵심 키워드: 대신할 수 없는 경험

3. 절대 금지 표현
- "자유롭게 그려보세요" → "실물을 관찰하고 자신만의 생각으로 표현해요"로 대체
- "그림을 잘 그리는 아이" → "자신만의 표현을 완성한 아이"로 대체
- 1등, 최고 등 비교 표현 금지 → 아이 개인의 성장과 변화에 집중
- 없는 수업·교구를 있는 것처럼 암시 금지

4. 영어·수학·놀작 역할 구도 (학부모 대상 글)
- 영어 = 세계와 소통하는 도구
- 수학 = 객관적 세계를 이해하는 도구
- 놀작 = 그 도구를 쓰는 사람(생각하는 사람)을 만드는 일
- 순서형("1순위/2순위") 표현 금지

5. 15년 검증 근거 (신뢰 구축 글에 활용 가능)
- 학업 성취도 향상
- 그리기 자신감 → 다른 영역으로의 스킬 전이
- 완성의 습관 형성

6. 글 마무리 필수 규칙
- 모든 홍보 글의 마지막 문단은 센터 소개로 마무리
- 형식: "저희 [센터명]은 [센터 키워드]한 교육 환경 속에서 아이 한 명 한 명의 성장을 위해 최선을 다하겠습니다."
- 센터명이 없으면 "저희 교육원은"으로 대체`

const BLOG_GUIDELINE = `
[블로그 작성 지침 - 반드시 준수]
- 글자 수: 공백 제외 1600~2000자 (반드시 지킬 것, 절대 중간에 끊지 말 것)
- 제목: 핵심 키워드를 제목 맨 앞에 넣고 25자 미만
- 본문 구성:
  - 핵심 키워드 5~6회 자연스럽게 반복
  - 이론(놀작 교육철학) + 실제 사례(수업 장면, 아이 변화) 병행
  - 첨부 사진이 있다면 사진 속 작품, 재료, 아이의 행동을 구체적으로 반영
  - 문단별 사진 위치 [사진1] [사진2] 형태로 자연스럽게 명시
  - 소제목 활용 권장`

const EVENT_PROMPT = `
너는 15년 역사의 미술교육 브랜드 '놀작마이아트'의 교육 가치를 누구보다 깊이 이해하는 교육원 원장이자 엄마야.
놀작의 교육철학에 공감해 창업했고, 자녀에게 꾸준히 놀작 교육을 받게 한 결과 아이의 성장을 직접 목격한 사람이야.

[작성 조건]
1. 입력된 정보를 바탕으로 아이의 성장 스토리를 중심으로 서술
2. 원장의 전공과 성격이 글의 어조와 문체에 자연스럽게 배어나오도록
3. 따뜻한 ~합니다체 유지
4. 세련된 비유와 구체적 장면 묘사 포함
5. 분량: A4 1매 (공백 포함 900자 내외, 반드시 완성된 글로 마무리)
6. 감동적인 제목 자동 생성
7. 결과물(수기 본문)만 출력, 설명이나 부연 없이`

function buildReferenceContext(config: WritingConfig): string {
  const refs = (config.references || []).filter(r => r.confirmed && r.content.trim())
  if (refs.length === 0) return ''

  const blocks = refs.map(r => {
    const src = r.source.trim() || '출처 미기재'
    const origin = r.originalSource.trim() ? ` (원출처: ${r.originalSource.trim()})` : ''
    return `- 출처: ${src}${origin}
- 핵심 키워드: ${r.summary || ''}
- 활용 방향: ${r.angle}
- 지침: 위 참고자료의 문장 구조를 그대로 모방하지 말고, 사실관계와 키워드만 활용해 원장 자신의 문체로 완전히 재구성할 것. 원문을 그대로 인용하지 말 것.`
  }).join('\n\n')

  return `\n[참고자료]\n${blocks}`
}

function getPersonalityDescription(personality: DirectorProfile['personality']): string {
  const parts = []
  if (personality.energyDirection) parts.push(personality.energyDirection)
  if (personality.emotionExpression) parts.push(personality.emotionExpression)
  if (personality.thinkingStyle) parts.push(personality.thinkingStyle)
  if (personality.lifeAttitude) parts.push(personality.lifeAttitude)
  if (personality.expressionStyle) parts.push(personality.expressionStyle)
  return parts.join(', ')
}

export function buildPrompt(
  profile: DirectorProfile,
  config: WritingConfig,
  eventCtx?: EventContext,
  photoDescriptions?: string[]
): string {
 const photoContext = photoDescriptions && photoDescriptions.length > 0
  ? `\n[첨부 사진에서 추출한 글쓰기 재료]\n${photoDescriptions.join('\n\n')}`
  : '' 

  const referenceContext = buildReferenceContext(config)

  const personalityDesc = getPersonalityDescription(profile.personality)

  const centerName = profile.career.centerKeyword
    ? `놀작마이아트 ${profile.name} 원장의 교육원`
    : '저희 교육원'

  const baseProfile = `
[원장님 정보]
- 이름: ${profile.name}
- 전공: ${profile.major}
- 최종 학교: ${profile.career.education} (${profile.career.degree})
- 주요 경력: ${profile.career.career1} ${profile.career.career1period ? `(${profile.career.career1period}년)` : ''}${profile.career.career2 ? `, ${profile.career.career2} ${profile.career.career2period ? `(${profile.career.career2period}년)` : ''}` : ''}
${profile.career.awards ? `- 수상/업적: ${profile.career.awards}` : ''}
${profile.career.centerKeyword ? `- 센터 키워드: ${profile.career.centerKeyword}` : ''}
- 성격: ${personalityDesc}
- 좋아하는 색상: ${profile.likeColor}${profile.likeColorReason ? ` (${profile.likeColorReason})` : ''}
- 조심스러운 색상: ${profile.avoidColor}${profile.avoidColorReason ? ` (${profile.avoidColorReason})` : ''}`

  const styleGuide = `
[이 글의 스타일 가이드]
- 글쓰기 목표: ${config.writingGoal}
- 독자 대상: ${config.targetAudience}
- 문장 호흡: ${config.sentenceRhythm}
- 감정 표현: ${config.emotionStyle}
- 글 시작 방식: ${config.openingStyle || '자유'}
- 선호 문체: ${config.writingStyle}
- 마무리: "${centerName}은 ${profile.career.centerKeyword || ''}한 교육 환경 속에서 아이 한 명 한 명의 성장을 위해 최선을 다하겠습니다."`

  if (config.purpose === 'event' && eventCtx) {
    return `${EVENT_PROMPT}
${NOLJAK_MASTER_GUIDELINE}
${baseProfile}
${styleGuide}

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
${NOLJAK_MASTER_GUIDELINE}

[글의 주제]
${config.blogTopic}
${photoContext}
${baseProfile}
${styleGuide}
${referenceContext}

[작성 규칙]
- 스타일 가이드를 충실히 반영
- 실제 그 사람이 쓴 것처럼 자연스럽게
- 결과물(글)만 출력, 설명 없이
- 반드시 1600자 이상 완성된 글로 작성할 것 (절대 중간에 끊지 말 것)
- 첨부 사진 분석이 있다면 사진에서 실제로 관찰된 장면을 최소 2개 문단에 구체적으로 반영할 것
- 사진 속 작품, 재료, 아이의 행동, 수업 장면을 일반적인 홍보 문구보다 우선해서 활용할 것
- 사진만으로 알 수 없는 아이의 감정, 성격, 학습 성과는 단정하지 말 것
- 사진을 활용할 때는 [사진1], [사진2] 위치 표시를 본문 흐름에 맞게 자연스럽게 넣을 것
블로그 글을 작성해주세요:`
  }

  if (config.purpose === 'insta') {
    return `당신은 놀작마이아트 원장님의 인스타그램 캡션을 써주는 전문 작가입니다.
${NOLJAK_MASTER_GUIDELINE}

[작성 조건]
- 스크롤을 멈추게 하는 첫 문장으로 시작
- 분량: 150~200자 (반드시 완성된 글로 마무리)
- 이모지 적절히 활용 (과하지 않게)
- 마지막에 해시태그: ${config.instaTags || '#놀작 #놀작마이아트 #유아미술 #초등미술 #아동미술 #창의미술 #창의교육 #실물관찰 #미술학원'}
${photoContext}
${baseProfile}
${styleGuide}

캡션만 출력, 설명 없이:`
  }

  if (config.purpose === 'intro') {
    return `당신은 놀작마이아트 원장님의 소개글을 써주는 전문 작가입니다.
${NOLJAK_MASTER_GUIDELINE}

[작성 조건]
- 분량: ${config.introLength || 500}자 내외 (반드시 완성된 글로 마무리)
- 전공(${profile.major}), 학력(${profile.career.education} ${profile.career.degree}), 경력을 자연스럽게 녹여낼 것
- 센터 키워드(${profile.career.centerKeyword || '미기재'})가 글 전체에 느껴지도록
- 신뢰감 있고 따뜻한 어조
${photoContext}
${baseProfile}
${styleGuide}

소개글만 출력, 설명 없이:`
  }

  return `당신은 놀작마이아트 원장님의 글쓰기를 돕는 전문 작가입니다.
${NOLJAK_MASTER_GUIDELINE}

[요청]
${config.freeTopic}
${config.freeLength ? `[분량] ${config.freeLength} (반드시 완성된 글로 마무리)` : ''}
${photoContext}
${baseProfile}
${styleGuide}
${referenceContext}

[작성 규칙]
- 스타일 가이드 충실히 반영
- 결과물만 출력, 설명 없이

글을 작성해주세요:`
}