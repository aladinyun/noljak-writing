import type { DirectorProfile, WritingConfig, EventContext } from './types'

const PURPOSE_CONTEXT: Record<string, string> = {
  blog: '네이버 또는 티스토리 블로그 포스팅 형식으로, 독자가 끝까지 읽고 싶은 흡인력 있는 구성으로 작성. 소제목 활용 가능.',
  insta: '인스타그램 피드 캡션으로, 감성적인 첫 문장으로 시작하고 마지막에 관련 해시태그 3~5개 포함.',
  intro: '원장 및 센터 소개글로, 교육 철학과 놀작을 선택한 이유를 중심으로 신뢰감 있게 작성.',
  event: '이벤트/공모전 응모글로, 진정성과 감동이 있는 수기 형식으로 작성.',
  free: '아래 요청사항에 맞게 자유롭게 작성.',
}

const LENGTH_GUIDE: Record<string, string> = {
  '반 장': '공백 포함 약 400자',
  '한 장': '공백 포함 약 800자',
  '한 장 반': '공백 포함 약 1,200자',
  '두 장': '공백 포함 약 1,600자',
  '세 장 이상': '공백 포함 2,000자 이상',
}

export function buildPrompt(
  profile: DirectorProfile,
  config: WritingConfig,
  eventCtx?: EventContext
): string {
  const lengthKey = Object.keys(LENGTH_GUIDE).find(k => config.length.includes(k)) || '한 장'
  const lengthGuide = LENGTH_GUIDE[lengthKey]
  const purposeContext = PURPOSE_CONTEXT[config.purpose] || ''

  const isEventMode = config.purpose === 'event' && eventCtx

  let additionalContext = ''
  if (config.purpose === 'intro' && config.introExtra) {
    additionalContext = `\n추가 정보: ${config.introExtra}`
  }
  if (config.purpose === 'free' && config.freeTopic) {
    additionalContext = `\n요청사항: ${config.freeTopic}`
  }
  if (config.purpose === 'event' && config.eventPrompt) {
    additionalContext = `\n이벤트 안내문: ${config.eventPrompt}`
  }

  const baseProfile = `
[원장님 정보]
- 이름: ${profile.name} / 연령대: ${profile.age} / 지역: ${profile.region}
- 전공/직업: ${profile.major} → 현재 놀작에듀 원장
- 이전 직업: ${profile.prevJob || '미기재'}
- 성격: ${profile.personality.join(', ') || '미기재'}
- 선호 문체: ${profile.writingStyle || '자유'}
- 글에 녹여줄 단어: ${profile.favWords.filter(Boolean).join(', ') || '없음'}
- 좋아하는 색상: ${profile.likeColor}${profile.likeColorReason ? ` (이유: ${profile.likeColorReason})` : ''}
- 조심스러운 색상: ${profile.avoidColor}${profile.avoidColorReason ? ` (이유: ${profile.avoidColorReason})` : ''}`

  if (isEventMode && eventCtx) {
    return `당신은 15년 역사의 미술교육 브랜드 '놀작에듀'의 가치를 누구보다 잘 아는 교육 전문가이자, 놀작 교육을 통해 아이를 성공적으로 키워낸 어머니(놀작 원장)입니다.

아래 정보를 바탕으로 놀작 15주년 기념 수기 공모전에 제출할 감동적이고 진정성 있는 수기를 작성해주세요.

[작성 조건]
1. 전공(${profile.major})과 좋아하는 색상(${profile.likeColor}${profile.likeColorReason ? ` - ${profile.likeColorReason}` : ''}), 기피하는 색상(${profile.avoidColor}${profile.avoidColorReason ? ` - ${profile.avoidColorReason}` : ''})을 아이의 성장 과정과 놀작 교육 철학에 연결한 세련된 문학적 비유로 자연스럽게 녹여낼 것
2. 어조: 엄마이자 원장으로서의 자부심과 감동이 묻어나는 따뜻한 ~합니다체
3. 분량: ${lengthGuide} (A4 1매)
4. 감동적인 제목 포함
5. 수기 본문만 출력, 설명이나 부연 없이
${baseProfile}

[아이 성장 이야기]
- 아이 이름: ${eventCtx.childName} / ${eventCtx.childAge} ${eventCtx.childGrade}
- 놀작 시작 시기: ${eventCtx.startAge}
- 센터 운영 기간: ${eventCtx.openPeriod}
- 놀작 전 고민: ${eventCtx.before}
- 놀작 후 변화: ${eventCtx.after}
- 구체적 성과: ${eventCtx.achievement}
- 전하고 싶은 말: ${eventCtx.message}

지금 바로 수기를 작성해주세요:`
  }

  return `당신은 놀작에듀(15년 역사의 아동 미술교육 프랜차이즈) 원장님의 글쓰기를 돕는 전문 작가입니다.
아래 원장님의 개인 정보와 성향을 바탕으로, 그 사람의 목소리와 개성이 자연스럽게 담긴 글을 작성해주세요.

[작성 방향]
- 목적: ${purposeContext}${additionalContext}
- 분량: ${lengthGuide}
- 인물의 배경과 성격이 글 전반에 자연스럽게 느껴질 것
- 좋아하는 단어는 억지스럽지 않게 1~2회 자연스럽게 녹여줄 것
- 실제 그 사람이 쓴 것처럼, 어색한 AI 문투 없이 작성
- 필요하면 제목 포함, 불필요하면 생략
- 결과물(글)만 출력, 설명이나 부연 절대 없이
${baseProfile}

글을 작성해주세요:`
}
