export interface CareerInfo {
  education: string
  degree: string
  career1: string
  career1period: string
  career2: string
  career2period: string
  awards: string
  centerKeyword: string
}

export interface DirectorProfile {
  centerName: string         // 교육원 명칭 (필수)
  name: string
  major: string
  targetAgeGroup: string[]   // 주 대상 연령층 (최대 2개, '전체'는 단독)
  centerLocation?: string
  nearbySchool?: string      // 가까운 초등학교 (선택, 네이버·구글 소개글용)
  career: CareerInfo
  personality: PersonalitySelection
}

// 저장된 프로필 로드 시 구버전 데이터 마이그레이션.
// - targetAgeGroup이 과거 단일 string으로 저장된 경우 배열로 변환 (빈 문자열은 빈 배열).
// - centerName이 없으면 빈 문자열로 초기화 (필수 필드 신설, controlled input 경고 방지).
// - 구버전 색상 필드(likeColor 등)는 이벤트 컨텍스트로 이동했으므로 프로필에서 제거.
// - 구버전 personality.expressionStyle(표현 방식)은 WritingConfig로 이동했으므로 프로필에서 제거.
export function migrateProfile(raw: unknown): DirectorProfile {
  const p = { ...(raw as Record<string, unknown>) }
  const t = p.targetAgeGroup
  if (typeof t === 'string') {
    p.targetAgeGroup = t ? [t] : []
  } else if (!Array.isArray(t)) {
    p.targetAgeGroup = []
  }
  if (typeof p.centerName !== 'string') p.centerName = ''
  delete p.likeColor
  delete p.likeColorReason
  delete p.avoidColor
  delete p.avoidColorReason
  if (p.personality && typeof p.personality === 'object') {
    delete (p.personality as Record<string, unknown>).expressionStyle
  }
  return p as unknown as DirectorProfile
}

export interface PersonalitySelection {
  energyDirection: string
  emotionExpression: string
  thinkingStyle: string
  lifeAttitude: string
}

export interface WritingReference {
  source: string          // 매체명/출처 (2차 보도 매체명 포함)
  originalSource: string  // 원출처 (2차 보도인 경우 원 매체)
  content: string         // 원장이 붙여넣은 참고 핵심 내용
  angle: string           // 이 참고자료를 어떤 관점으로 쓸지
  summary?: string        // API로 추출한 핵심 팩트·키워드 요약
  confirmed: boolean      // 확인 단계에서 "이대로 반영" 여부
}

export type IntroChannel = 'naver' | 'google' | 'blog' | 'insta' | 'kakao' | 'cafe'

export interface WritingConfig {
  purpose: 'blog' | 'insta' | 'intro' | 'event' | 'free'
  writingGoal: string
  targetAudience: string
  otherAudienceDetail?: string  // 독자 대상 '기타' 하위 선택값 또는 자유입력 텍스트
  sentenceRhythm: string
  emotionStyle: string
  openingStyle: string
  writingStyle: string
  expressionStyle: string  // 표현 방식 (글마다 달라질 수 있어 프로필→글쓰기설정으로 이동)
  blogTopic?: string
  instaTags?: string
  introLength?: number
  introChannel?: IntroChannel   // 소개글 채널 (세션 상태, 프로필 미저장)
  freeTopic?: string
  freeLength?: string
  freeMode?: 'new' | 'edit'     // 자유작성 모드 (기본 'new')
  originalText?: string         // edit 모드: 원문
  editInstructions?: string     // edit 모드: 수정 지시사항
  references?: WritingReference[]  // 블로그/자유작성 전용 참고자료
}

export interface EventContext {
  childName: string
  childGrade: string
  startAge: string
  before: string
  after: string
  achievement: string
  message: string
  likeColor: string        // 색상 이야기 (이벤트 수기 작성 시에만 입력)
  likeColorReason: string
  avoidColor: string
  avoidColorReason: string
}

export type Step = -1 | 0 | 1 | 2 | 3

export const PURPOSES = [
  { id: 'blog', label: '블로그', sub: '네이버, 티스토리 등 포스팅' },
  { id: 'insta', label: '인스타그램', sub: '피드 캡션 + 해시태그' },
  { id: 'intro', label: '소개글', sub: '원장 · 센터 소개' },
  { id: 'event', label: '이벤트 참여', sub: '놀작마이아트 15주년 수기 공모전' },
  { id: 'free', label: '자유 작성', sub: '직접 주제·분량 입력' },
] as const

export const INTRO_CHANNELS = [
  { id: 'naver', label: '네이버 스마트플레이스', sub: 'SEO 키워드형 · 900~1000자' },
  { id: 'google', label: '구글 비즈니스 프로필', sub: '신뢰감 있는 설명형 · 700~750자' },
  { id: 'blog', label: '블로그/홈페이지 상세소개', sub: '글자 수 직접 입력' },
  { id: 'cafe', label: '카페 (맘카페 등 커뮤니티)', sub: '자연스러운 후기·경험담 · 1000~2000자' },
  { id: 'insta', label: '인스타그램/페이스북 프로필', sub: '임팩트 한두 문장 · 140~150자' },
  { id: 'kakao', label: '카카오톡 상태메시지', sub: '초압축 캐치프레이즈 · 50~60자' },
] as const

export const WRITING_GOALS = [
  '공감 얻기', '정보 전달', '신뢰 구축', '감동 주기', '행동 유도',
]

export const TARGET_AUDIENCES = ['학부모', '일반인' , '기타']

// 독자 대상 '기타' 선택 시 노출되는 2단 세부 유형 (마지막은 직접입력)
export const OTHER_AUDIENCE_SUBTYPES = [
  '미술학원·미술교습소 창업예비자',
  '미술홈스쿨 창업예비자',
  '해외 미술학원 창업예비자',
  '기타(직접입력)',
]

export const TARGET_AGE_GROUPS = ['미취학 (3~5세)', '초등 저학년 (초1~3)', '초등 고학년 (초4~6)', '전체']

export const PERSONALITY_CATEGORIES = {
  energyDirection: {
    label: '에너지 방향',
    options: ['외향적이고 사교적', '내향적이고 독립적'],
  },
  emotionExpression: {
    label: '감정 표현',
    options: ['따뜻하고 공감 잘함', '직설적이고 거침없는', '감정 기복이 있고 솔직한', '절제하고 담담한 편'],
  },
  thinkingStyle: {
    label: '사고 방식',
    options: ['꼼꼼하고 체계적', '창의적이고 상상력 풍부', '신중하고 분석적', '완벽주의적이고 까다로운'],
  },
  lifeAttitude: {
    label: '생활 태도',
    options: ['도전적이고 추진력 강함', '느긋하고 여유로운', '낙천적이고 긍정적', '걱정이 많고 신경 쓰는 게 많은'],
  },
} as const

export const WRITING_STYLES = [
  '논문처럼 논리적', '수필처럼 감성적', '신문기사처럼 명료한',
  '시처럼 서정적', 'SNS처럼 친근하고 짧은',
]

export const SENTENCE_RHYTHMS = ['짧고 강하게', '중간 호흡', '길고 흐르듯이', '짧고 리드미컬하게']
export const EMOTION_STYLES = ['직접적으로 감정 표현', '절제하고 담담하게', '유머로 풀어내기']
export const OPENING_STYLES = ['질문으로 시작', '장면 묘사로 시작', '나의 이야기로 시작', '명언/인용으로 시작']
// 표현 방식: 글마다 달라질 수 있는 성격이라 프로필(성격)에서 글쓰기 설정으로 이동
export const EXPRESSION_STYLES = ['활발하고 에너지 넘침', '조용하고 사려깊음', '유머감각 있고 재치있는', '감수성 풍부하고 섬세한']

export const COLORS = [
  { name: '노란색', hex: '#FFD600' },
  { name: '주황색', hex: '#FF6B35' },
  { name: '분홍색', hex: '#E91E63' },
  { name: '초록색', hex: '#4CAF50' },
  { name: '파란색', hex: '#2196F3' },
  { name: '보라색', hex: '#9C27B0' },
  { name: '빨간색', hex: '#FF5252' },
  { name: '갈색', hex: '#795548' },
  { name: '흰색', hex: '#F5F5F5', border: true },
  { name: '회색', hex: '#9E9E9E' },
  { name: '검은색', hex: '#212121' },
]

export const GRADES = [
  '미취학', '초등 1학년', '초등 2학년', '초등 3학년',
  '초등 4학년', '초등 5학년', '초등 6학년',
  '중학교 1학년', '중학교 2학년', '중학교 3학년',
  '고등학생', '대학생 이상',
]

export const DEGREES = ['학사', '석사', '박사', '전문학사', '대학원 수료']

export const MAX_TOKENS: Record<string, number> = {
  blog: 4000,
  insta: 500,
  intro: 4000,
  event: 2000,
  free: 4000,
}