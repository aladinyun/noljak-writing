'use client'

import { useState } from 'react'
import StepAuth from '@/components/StepAuth'
import StepProfile from '@/components/StepProfile'
import StepWriting from '@/components/StepWriting'
import StepResult from '@/components/StepResult'
import type { Step, DirectorProfile, WritingConfig, EventContext } from '@/lib/types'

const STEP_LABELS = ['인증', '기본 정보', '글쓰기 설정', '완성']

export default function Home() {
  const [step, setStep] = useState<Step>(0)
  const [profile, setProfile] = useState<DirectorProfile>({
    name: '', age: '', region: '', major: '', prevJob: '',
    personality: [], writingStyle: '', favWords: ['', '', ''],
    likeColor: '', likeColorReason: '', avoidColor: '', avoidColorReason: '',
  })
  const [config, setConfig] = useState<WritingConfig>({
    purpose: 'blog', length: '한 장 (약 800자)',
  })
  const [eventCtx, setEventCtx] = useState<EventContext>({
    childName: '', childAge: '', childGrade: '', startAge: '',
    openPeriod: '', before: '', after: '', achievement: '', message: '',
  })
  const [result, setResult] = useState({ text: '', charCount: 0 })

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">

        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-noljak-purple-light text-noljak-purple-dark text-xs font-medium px-3 py-1 rounded-full mb-3">
            놀작에듀 원장 전용
          </div>
          <h1 className="text-2xl font-medium text-gray-900">AI 글쓰기 지원</h1>
          <p className="text-sm text-gray-500 mt-1">원장님만의 개성이 담긴 글을 AI가 완성해드립니다</p>
        </div>

        {/* 진행 단계 */}
        {step > 0 && (
          <div className="flex items-center gap-2 mb-8">
            {STEP_LABELS.slice(1).map((label, i) => {
              const s = (i + 1) as Step
              const isDone = step > s
              const isActive = step === s
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className={`
                    flex items-center gap-1.5 text-xs font-medium transition-all
                    ${isDone ? 'text-noljak-purple' : isActive ? 'text-noljak-purple-dark' : 'text-gray-400'}
                  `}>
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium border
                      ${isDone ? 'bg-noljak-purple border-noljak-purple text-white' :
                        isActive ? 'bg-noljak-purple-light border-noljak-purple text-noljak-purple-dark' :
                        'bg-white border-gray-200 text-gray-400'}
                    `}>
                      {isDone ? '✓' : s}
                    </div>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-noljak-purple' : 'bg-gray-200'}`} />}
                </div>
              )
            })}
          </div>
        )}

        {/* 카드 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {step === 0 && <StepAuth onSuccess={() => setStep(1)} />}
          {step === 1 && (
            <StepProfile
              profile={profile}
              onChange={setProfile}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepWriting
              config={config}
              eventCtx={eventCtx}
              onChangeConfig={setConfig}
              onChangeEvent={setEventCtx}
              onBack={() => setStep(1)}
              onGenerate={async () => {
                setStep(3)
                setResult({ text: '', charCount: 0 })
                try {
                  const res = await fetch('/api/write', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile, config, eventCtx: config.purpose === 'event' ? eventCtx : undefined }),
                  })
                  const data = await res.json()
                  setResult({ text: data.text || '', charCount: data.charCount || 0 })
                } catch {
                  setResult({ text: '오류가 발생했습니다. 다시 시도해주세요.', charCount: 0 })
                }
              }}
            />
          )}
          {step === 3 && (
            <StepResult
              result={result}
              profile={profile}
              config={config}
              onBack={() => setStep(2)}
              onReset={() => setStep(1)}
              onRegenerate={async () => {
                setResult({ text: '', charCount: 0 })
                try {
                  const res = await fetch('/api/write', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile, config, eventCtx: config.purpose === 'event' ? eventCtx : undefined }),
                  })
                  const data = await res.json()
                  setResult({ text: data.text || '', charCount: data.charCount || 0 })
                } catch {
                  setResult({ text: '오류가 발생했습니다. 다시 시도해주세요.', charCount: 0 })
                }
              }}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 놀작에듀 · write.noljak.global
        </p>
      </div>
    </div>
  )
}
