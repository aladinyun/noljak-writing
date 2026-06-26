'use client'

import { useState } from 'react'
import type { DirectorProfile, WritingConfig } from '@/lib/types'

const PURPOSE_LABEL: Record<string, string> = {
  blog: '블로그', insta: '인스타그램', intro: '소개글', event: '이벤트 수기', free: '자유 작성',
}

interface Props {
  result: { text: string; charCount: number }
  profile: DirectorProfile
  config: WritingConfig
  onBack: () => void
  onReset: () => void
  onRegenerate: () => void
}

export default function StepResult({ result, profile, config, onBack, onReset, onRegenerate }: Props) {
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [copied, setCopied] = useState(false)
  const isLoading = !result.text

  const copy = () => {
    navigator.clipboard.writeText(result.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const sendEmail = async () => {
    if (!email.includes('@')) return
    setEmailStatus('sending')
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: profile.name, text: result.text, purpose: config.purpose }),
      })
      setEmailStatus(res.ok ? 'done' : 'error')
    } catch { setEmailStatus('error') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-bold" style={{ color: '#2D1A00' }}>완성된 글</h2>
        {!isLoading && result.charCount > 0 && (
          <div className="flex gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#FFF0D6', color: '#E8820C' }}>
              {PURPOSE_LABEL[config.purpose]}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#F5F5F5', color: '#7A4F1E' }}>
              {result.charCount.toLocaleString()}자
            </span>
          </div>
        )}
      </div>

      <div className="rounded-xl border p-4 min-h-[200px] mb-4" style={{ background: '#FFFBF3', borderColor: '#F0D9A8' }}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F5A623', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: '#B07D3A' }}>AI가 원장님만의 글을 쓰고 있어요...</p>
          </div>
        ) : (
          <p className="text-sm leading-8 whitespace-pre-wrap" style={{ color: '#2D1A00' }}>{result.text}</p>
        )}
      </div>

      {!isLoading && (
        <>
          <div className="flex gap-2 mb-4">
            <button onClick={copy} className="flex-1 py-2 text-sm font-medium rounded-lg border transition-all"
              style={{ borderColor: '#E5C98A', color: '#7A4F1E', background: 'white' }}>
              {copied ? '✓ 복사됨' : '복사하기'}
            </button>
            <button onClick={onRegenerate} className="flex-1 py-2 text-sm font-medium rounded-lg border transition-all"
              style={{ borderColor: '#E5C98A', color: '#7A4F1E', background: 'white' }}>
              다시 쓰기
            </button>
          </div>

          <div className="rounded-xl p-4 mb-4 border" style={{ background: '#FFFBF3', borderColor: '#F0D9A8' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#B07D3A' }}>이메일로 받기</p>
            <div className="flex gap-2">
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailStatus('idle') }}
                placeholder="email@example.com" className="flex-1" />
              <button onClick={sendEmail} disabled={emailStatus === 'sending'}
                className="px-4 py-2 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                style={{ background: '#E8820C' }}>
                {emailStatus === 'sending' ? '발송중' : '발송'}
              </button>
            </div>
            {emailStatus === 'done' && <p className="text-xs mt-1.5 text-green-600">✓ 이메일이 발송되었습니다</p>}
            {emailStatus === 'error' && <p className="text-xs mt-1.5 text-red-500">발송 실패. 다시 시도해주세요.</p>}
          </div>
        </>
      )}

      <div className="flex gap-2 border-t pt-4" style={{ borderColor: '#F0D9A8' }}>
        <button onClick={onBack} className="text-sm px-4 py-2" style={{ color: '#B07D3A' }}>← 설정 수정</button>
        <button onClick={onReset} className="text-sm px-4 py-2" style={{ color: '#B07D3A' }}>처음부터</button>
      </div>
    </div>
  )
}
