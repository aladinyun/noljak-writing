'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import StepAuth from '@/components/StepAuth'
import StepProfile from '@/components/StepProfile'
import StepWriting from '@/components/StepWriting'
import StepReference from '@/components/StepReference'
import StepResult from '@/components/StepResult'
import type { Step, DirectorProfile, WritingConfig, EventContext } from '@/lib/types'
import { migrateProfile } from '@/lib/types'

const STEP_LABELS = ['인증', '기본 정보', '글쓰기 설정', '완성']
const STORAGE_KEY = 'noljak_director_profile'
const DRAFT_KEY = 'noljak_writing_draft'

const defaultProfile: DirectorProfile = {
  centerName: '', name: '', major: '', targetAgeGroup: [],
  career: { education: '', degree: '', career1: '', career1period: '', career2: '', career2period: '', awards: '', centerKeyword: '' },
  personality: { energyDirection: '', emotionExpression: '', thinkingStyle: '', lifeAttitude: '' },
}

const defaultConfig: WritingConfig = {
  purpose: 'blog', writingGoal: '', targetAudience: '',
  sentenceRhythm: '', emotionStyle: '', openingStyle: '', writingStyle: '', expressionStyle: '',
}

const defaultEvent: EventContext = {
  childName: '', childGrade: '', startAge: '', before: '', after: '', achievement: '', message: '',
  likeColor: '', likeColorReason: '', avoidColor: '', avoidColorReason: '',
}

// 자동저장 대상 판단: 사용자가 의미 있는 입력/선택을 했는지.
// (빈 기본값 draft가 저장/복원되어 안내가 잘못 뜨는 것을 방지)
function draftHasContent(config: WritingConfig, eventCtx: EventContext): boolean {
  const c = config
  if (c.writingGoal || c.targetAudience || c.otherAudienceDetail || c.sentenceRhythm ||
      c.emotionStyle || c.openingStyle || c.writingStyle || c.expressionStyle) return true
  if (c.blogTopic || c.instaTags || c.introChannel || c.freeTopic || c.freeLength ||
      c.originalText || c.editInstructions) return true
  if ((c.references?.length ?? 0) > 0) return true
  if (c.purpose && c.purpose !== 'blog') return true  // 기본 목적(blog)에서 변경됨
  const e = eventCtx
  if (e.childName || e.childGrade || e.startAge || e.before || e.after || e.achievement ||
      e.message || e.likeColor || e.likeColorReason || e.avoidColor || e.avoidColorReason) return true
  return false
}

export default function Home() {
  const [step, setStep] = useState<Step>(0)
  const [profile, setProfile] = useState<DirectorProfile>(defaultProfile)
  const [config, setConfig] = useState<WritingConfig>(defaultConfig)
  const [eventCtx, setEventCtx] = useState<EventContext>(defaultEvent)
  const [photos, setPhotos] = useState<Array<{ base64: string; mediaType: string; name: string }>>([])
  const [result, setResult] = useState({ text: '', charCount: 0 })
  const [hasSavedProfile, setHasSavedProfile] = useState(false)
  const [savedName, setSavedName] = useState('')
  const [showRefConfirm, setShowRefConfirm] = useState(false)
  const [refLoading, setRefLoading] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const draftFirstRun = useRef(true)  // 최초 렌더 시 빈 기본값이 draft를 덮어쓰지 않도록 스킵

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = migrateProfile(JSON.parse(saved))
        setProfile(parsed)
        setHasSavedProfile(true)
        setSavedName(parsed.name || '')
      }
    } catch {}
  }, [])

  // 글쓰기 설정 draft 복원 (config + eventCtx, photos는 제외)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        if (d.config) setConfig(d.config)
        if (d.eventCtx) setEventCtx(d.eventCtx)
        if (d.config || d.eventCtx) setDraftRestored(true)
      }
    } catch {}
  }, [])

  // 글쓰기 설정 draft 자동저장 (500ms 디바운스, photos 제외)
  useEffect(() => {
    if (draftFirstRun.current) { draftFirstRun.current = false; return }
    const t = setTimeout(() => {
      try {
        if (draftHasContent(config, eventCtx)) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ config, eventCtx }))
        } else {
          localStorage.removeItem(DRAFT_KEY)  // 내용 비면(리셋 등) draft 제거
        }
      } catch {}
    }, 500)
    return () => clearTimeout(t)
  }, [config, eventCtx])

  const generate = async (cfgArg?: WritingConfig) => {
    const cfg = cfgArg ?? config
    setShowRefConfirm(false)
    setStep(3)
    setResult({ text: '', charCount: 0 })
    try {
      const res = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile, config: cfg,
          eventCtx: cfg.purpose === 'event' ? eventCtx : undefined,
          photos: photos.length > 0 ? photos : undefined,
        }),
      })
      const data = await res.json()
      setResult({ text: data.text || '', charCount: data.charCount || 0 })
      // 생성 성공(결과 텍스트 수신) 시 draft 삭제 + 복원 안내 해제
      if (data.text) {
        try { localStorage.removeItem(DRAFT_KEY) } catch {}
        setDraftRestored(false)
      }
    } catch {
      setResult({ text: '오류가 발생했습니다. 다시 시도해주세요.', charCount: 0 })
    }
  }

  // 글쓰기 설정에서 "글 생성하기" 클릭 시 진입점.
  // 참고자료(블로그/자유작성)가 있으면 요약 후 확인 단계로, 없으면 바로 생성.
  const startGenerate = async () => {
    const refsEnabled = config.purpose === 'blog' || config.purpose === 'free'
    const refs = config.references ?? []
    const active = refsEnabled ? refs.filter(r => r.content.trim()) : []
    if (active.length === 0) {
      generate()
      return
    }

    setShowRefConfirm(true)
    setRefLoading(true)
    try {
      const updated = await Promise.all(refs.map(async (r) => {
        if (!r.content.trim()) return r
        try {
          const res = await fetch('/api/summarize-reference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: r.content }),
          })
          const data = await res.json()
          return { ...r, summary: data.summary || '', confirmed: true }
        } catch {
          return { ...r, summary: '', confirmed: true }
        }
      }))
      setConfig({ ...config, references: updated })
    } finally {
      setRefLoading(false)
    }
  }

  const toggleRef = (index: number, confirmed: boolean) => {
    const refs = config.references ?? []
    setConfig({ ...config, references: refs.map((r, i) => i === index ? { ...r, confirmed } : r) })
  }

  const generateWithoutRefs = () => {
    const refs = config.references ?? []
    const cleared = { ...config, references: refs.map(r => ({ ...r, confirmed: false })) }
    setConfig(cleared)
    generate(cleared)
  }

  const resetAll = () => {
    setStep(1)
    setConfig(defaultConfig)
    setEventCtx(defaultEvent)
    setPhotos([])
    setShowRefConfirm(false)
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8EE' }}>
      {/* 헤더 */}
      <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: '#F0D9A8', background: 'white' }}>
        <Image src="/noljak-logo.png" alt="놀작" width={80} height={28} style={{ objectFit: 'contain' }} />
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* 진행 단계 */}
        {step > 0 && (
          <div className="flex items-center gap-1 mb-6">
            {STEP_LABELS.slice(1).map((label, i) => {
              const s = (i + 1) as Step
              const isDone = step > s
              const isActive = step === s
              return (
                <div key={label} className="flex items-center gap-1 flex-1">
                  <div className={`flex items-center gap-1 text-xs font-medium transition-all ${isDone ? 'text-orange-500' : isActive ? 'text-orange-700' : 'text-gray-400'}`}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs border"
                      style={isDone
                        ? { background: '#E8820C', borderColor: '#E8820C', color: 'white' }
                        : isActive
                        ? { background: '#FFF0D6', borderColor: '#F5A623', color: '#7A4F1E' }
                        : { borderColor: '#D1D5DB', color: '#9CA3AF' }}>
                      {isDone ? '✓' : s}
                    </div>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-orange-400' : 'bg-gray-200'}`} />}
                </div>
              )
            })}
          </div>
        )}

        {/* 카드 */}
        <div className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: '#F0D9A8' }}>

          {/* Step 0: 인증 */}
          {step === 0 && <StepAuth onSuccess={() => setStep(hasSavedProfile ? -1 : 1)} />}

          {/* 저장된 정보 확인 화면 */}
          {step === -1 && (
            <div className="text-center py-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#B07D3A' }}>놀작마이아트 원장 전용</p>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#2D1A00' }}>{savedName} 원장님,</h2>
              <p className="text-sm mb-8" style={{ color: '#7A4F1E' }}>저장된 정보가 있습니다.</p>
              <div className="space-y-3">
                <button
                  onClick={() => setStep(2)}
                  className="btn-primary"
                >
                  ✦ 바로 글쓰기 시작
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 text-sm font-medium rounded-xl border transition-all"
                  style={{ borderColor: '#E5C98A', color: '#7A4F1E', background: 'white' }}
                >
                  기본 정보 수정하기
                </button>
              </div>
            </div>
          )}

          {/* Step 1: 기본 정보 */}
          {step === 1 && (
            <StepProfile
              profile={profile}
              onChange={setProfile}
              onNext={() => setStep(2)}
            />
          )}

          {/* Step 2: 글쓰기 설정 */}
          {step === 2 && !showRefConfirm && (
            <StepWriting
              config={config} eventCtx={eventCtx} photos={photos}
              draftRestored={draftRestored} onDismissDraft={() => setDraftRestored(false)}
              onChangeConfig={setConfig} onChangeEvent={setEventCtx} onChangePhotos={setPhotos}
              onBack={() => setStep(1)} onGenerate={startGenerate}
            />
          )}

          {/* Step 2.5: 참고자료 확인 (블로그/자유작성, 참고자료 입력 시) */}
          {step === 2 && showRefConfirm && (
            <StepReference
              references={config.references ?? []}
              loading={refLoading}
              onToggle={toggleRef}
              onBack={() => setShowRefConfirm(false)}
              onGenerate={() => generate()}
              onGenerateWithoutRefs={generateWithoutRefs}
            />
          )}

          {/* Step 3: 결과 */}
          {step === 3 && (
            <StepResult
              result={result} profile={profile} config={config}
              onBack={() => setStep(2)}
              onReset={resetAll}
              onRegenerate={generate}
            />
          )}
        </div>

        <p className="text-center text-xs mt-5" style={{ color: '#B07D3A' }}>
          © 놀작마이아트 · write.noljak.global
        </p>
      </div>
    </div>
  )
}