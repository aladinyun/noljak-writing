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
  name: string
  major: string
  career: CareerInfo
  personality: PersonalitySelection
  likeColor: string
  likeColorReason: string
  avoidColor: string
  avoidColorReason: string
}

export interface PersonalitySelection {
  energyDirection: string
  emotionExpression: string
  thinkingStyle: string
  lifeAttitude: string
  expressionStyle: string
}

export interface WritingConfig {
  purpose: 'blog' | 'insta' | 'intro' | 'event' | 'free'
  writingGoal: string
  targetAudience: string
  sentenceRhythm: string
  emotionStyle: string
  openingStyle: string
  writingStyle: string
  blogTopic?: string
  instaTags?: string
  introLength?: number
  freeTopic?: string
  freeLength?: string
}

export interface EventContext {
  childName: string
  childGrade: string
  startAge: string
  before: string
  after: string
  achievement: string
  message: string
}

export type Step = -1 | 0 | 1 | 2 | 3

export const PURPOSES = [
  { id: 'blog', label: '블로그', sub: '네이버, 티스토리 등 포스팅' },
  { id: 'insta', label: '인스타그램', sub: '피드 캡션 + 해시태그' },
  { id: 'intro', label: '소개글', sub: '원장 · 센터 소개' },
  { id: 'event', label: '이벤트 참여', sub: '놀작마이아트 15주년 수기 공모전' },
  { id: 'free', label: '자유 작성', sub: '직접 주제·분량 입력' },
] as const

export const WRITING_GOALS = [
  '공감 얻기', '정보 전달', '신뢰 구축', '감동 주기',
]

export const TARGET_AUDIENCES = ['학부모', '일반인' , '기타']

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
  expressionStyle: {
    label: '표현 방식',
    options: ['활발하고 에너지 넘침', '조용하고 사려깊음', '유머감각 있고 재치있는', '감수성 풍부하고 섬세한'],
  },
} as const

export const WRITING_STYLES = [
  '논문처럼 논리적', '수필처럼 감성적', '신문기사처럼 명료한',
  '시처럼 서정적', 'SNS처럼 친근하고 짧은',
]

export const SENTENCE_RHYTHMS = ['짧고 강하게', '중간 호흡', '길고 흐르듯이']
export const EMOTION_STYLES = ['직접적으로 감정 표현', '절제하고 담담하게', '유머로 풀어내기']
export const OPENING_STYLES = ['질문으로 시작', '장면 묘사로 시작', '나의 이야기로 시작', '명언/인용으로 시작']

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