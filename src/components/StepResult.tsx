'use client'

import { useState } from 'react'
import type { DirectorProfile, WritingConfig } from '@/lib/types'

const PURPOSE_LABEL: Record<string, string> = {
  blog: '블로그', insta: '인스타그램', intro: '소개글', event: '이벤트 응모글', free: '자유 작성',
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
    } catch {
      setEmailStatus('error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-medium text-gray-900">완성된 글</h2>
        {!isLoading && result.charCount > 0 && (
          <div className="flex gap-2">
            <span className="bg-noljak-purple-light text-noljak-purple-dark text-xs font-medium px-2.5 py-1 rounded-full">
              {PURPOSE_LABEL[config.purpose]}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {result.charCount.toLocaleString()}자
            </span>
          </div>
        )}
      </div>

      {/* 결과 박스 */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 min-h-[200px] mb-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-6 h-6 border-2 border-noljak-purple border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">AI가 원장님만의 글을 쓰고 있어요...</p>
          </div>
        ) : (
          <p className="text-sm leading-8 text-gray-800 whitespace-pre-wrap">{result.text}</p>
        )}
      </div>

      {/* 액션 버튼 */}
      {!isLoading && (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={copy}
              className="flex-1 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? '✓ 복사됨' : '복사하기'}
            </button>
            <button
              onClick={onRegenerate}
              className="flex-1 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              다시 쓰기
            </button>
          </div>

          {/* 이메일 발송 */}
          <div className="border border-gray-100 rounded-xl p-4 bg-white mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">이메일로 받기</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailStatus('idle') }}
                placeholder="email@example.com"
                className="flex-1"
              />
              <button
                onClick={sendEmail}
                disabled={emailStatus === 'sending'}
                className="px-4 py-2 bg-noljak-purple text-white text-sm font-medium rounded-lg hover:bg-noljak-purple-dark transition-colors disabled:opacity-50"
              >
                {emailStatus === 'sending' ? '발송 중...' : '발송'}
              </button>
            </div>
            {emailStatus === 'done' && <p className="text-xs text-green-600 mt-1.5">✓ 이메일이 발송되었습니다</p>}
            {emailStatus === 'error' && <p className="text-xs text-red-500 mt-1.5">발송 실패. 다시 시도해주세요.</p>}
          </div>
        </>
      )}

      {/* 하단 버튼 */}
      <div className="flex gap-2 border-t border-gray-100 pt-4">
        <button onClick={onBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← 설정 수정
        </button>
        <button onClick={onReset} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          처음부터
        </button>
      </div>
    </div>
  )
}
