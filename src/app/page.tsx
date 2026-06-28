'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import StepAuth from '@/components/StepAuth'
import StepProfile from '@/components/StepProfile'
import StepWriting from '@/components/StepWriting'
import StepResult from '@/components/StepResult'
import type { Step, DirectorProfile, WritingConfig, EventContext } from '@/lib/types'

const STEP_LABELS = ['인증', '기본 정보', '글쓰기 설정', '완성']
const STORAGE_KEY = 'noljak_director_profile'

const defaultProfile: DirectorProfile = {
  name: '', major: '',
  career: { education: '', degree: '', career1: '', career1period: '', career2: '', career2period: '', awards: '', centerKeyword: '' },
  personality: { energyDirection: '', emotionExpression: '', thinkingStyle: '', lifeAttitude: '', expressionStyle: '' },
  likeColor: '', likeColorReason: '', avoidColor: '', avoidColorReason: '',
}

const defaultConfig: WritingConfig = {
  purpose: 'blog', writingGoal: '', targetAudience: '',
  sentenceRhythm: '', emotionStyle: '', openingStyle: '', writingStyle: '',
}

const defaultEvent: EventContext = {
  childName: '', childGrade: '', startAge: '', before: '', after: '', achievement: '', message: '',
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setProfile(parsed)
        setHasSavedProfile(true)
        setSavedName(parsed.name || '')
      }
    } catch {}
  }, [])

  const generate = async () => {
    setStep(3)
    setResult({ text: '', charCount: 0 })
    try {
      const res = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile, config,
          eventCtx: config.purpose === 'event' ? eventCtx : undefined,
          photos: photos.length > 0 ? photos : undefined,
        }),
      })
      const data = await res.json()
      setResult({ text: data.text || '', charCount: data.charCount || 0 })
    } catch {
      setResult({ text: '오류가 발생했습니다. 다시 시도해주세요.', charCount: 0 })
    }
  }

  const resetAll = () => {
    setStep(1)
    setConfig(defaultConfig)
    setEventCtx(defaultEvent)
    setPhotos([])
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
          {step === 2 && (
            <StepWriting
              config={config} eventCtx={eventCtx} photos={photos}
              onChangeConfig={setConfig} onChangeEvent={setEventCtx} onChangePhotos={setPhotos}
              onBack={() => setStep(1)} onGenerate={generate}
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