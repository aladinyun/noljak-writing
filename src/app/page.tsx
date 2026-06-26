'use client'

import { useState } from 'react'
import Image from 'next/image'
import StepAuth from '@/components/StepAuth'
import StepProfile from '@/components/StepProfile'
import StepWriting from '@/components/StepWriting'
import StepResult from '@/components/StepResult'
import type { Step, DirectorProfile, WritingConfig, EventContext } from '@/lib/types'

const STEP_LABELS = ['인증', '기본 정보', '글쓰기 설정', '완성']

const defaultProfile: DirectorProfile = {
  name: '', major: '',
  career: { education: '', degree: '', career1: '', career1period: '', career2: '', career2period: '', award1: '', award2: '' },
  personality: [], sentenceRhythm: '', emotionStyle: '', openingStyle: '',
  writingStyle: '', favWords: ['', '', ''],
  likeColor: '', likeColorReason: '', avoidColor: '', avoidColorReason: '',
}

const defaultConfig: WritingConfig = { purpose: 'blog', blogTopic: '' }
const defaultEvent: EventContext = { childName: '', childGrade: '', startAge: '', before: '', after: '', achievement: '', message: '' }

export default function Home() {
  const [step, setStep] = useState<Step>(0)
  const [profile, setProfile] = useState<DirectorProfile>(defaultProfile)
  const [config, setConfig] = useState<WritingConfig>(defaultConfig)
  const [eventCtx, setEventCtx] = useState<EventContext>(defaultEvent)
  const [photos, setPhotos] = useState<Array<{ base64: string; mediaType: string }>>([])
  const [result, setResult] = useState({ text: '', charCount: 0 })

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
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${isDone ? 'text-white border-orange-500' : isActive ? 'border-orange-500 text-orange-700' : 'border-gray-300 text-gray-400'}`}
                      style={isDone ? { background: '#E8820C', borderColor: '#E8820C' } : isActive ? { background: '#FFF0D6', borderColor: '#F5A623' } : {}}>
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
          {step === 0 && <StepAuth onSuccess={() => setStep(1)} />}
          {step === 1 && <StepProfile profile={profile} onChange={setProfile} onNext={() => setStep(2)} />}
          {step === 2 && (
            <StepWriting
              config={config} eventCtx={eventCtx} photos={photos}
              onChangeConfig={setConfig} onChangeEvent={setEventCtx} onChangePhotos={setPhotos}
              onBack={() => setStep(1)} onGenerate={generate}
            />
          )}
          {step === 3 && (
            <StepResult
              result={result} profile={profile} config={config}
              onBack={() => setStep(2)} onReset={() => { setStep(1); setProfile(defaultProfile); setConfig(defaultConfig); setEventCtx(defaultEvent); setPhotos([]) }}
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
