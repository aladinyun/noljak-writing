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

type TranslateStatus = 'idle' | 'translating' | 'done' | 'error'

export default function StepResult({ result, profile, config, onBack, onReset, onRegenerate }: Props) {
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  const [spellText, setSpellText] = useState('')
  const [spellStatus, setSpellStatus] = useState<'idle' | 'checking' | 'done' | 'error'>('idle')
  const [showSpell, setShowSpell] = useState(false)
  const [spellCopied, setSpellCopied] = useState(false)

  const [enText, setEnText] = useState('')
  const [enStatus, setEnStatus] = useState<TranslateStatus>('idle')
  const [showEn, setShowEn] = useState(false)
  const [enCopied, setEnCopied] = useState(false)

  const [vnText, setVnText] = useState('')
  const [vnStatus, setVnStatus] = useState<TranslateStatus>('idle')
  const [showVn, setShowVn] = useState(false)
  const [vnCopied, setVnCopied] = useState(false)

  const isLoading = !result.text

  const copy = () => {
    navigator.clipboard.writeText(result.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const copySpell = () => {
    navigator.clipboard.writeText(spellText).then(() => {
      setSpellCopied(true)
      setTimeout(() => setSpellCopied(false), 2000)
    })
  }

  const copyEn = () => {
    navigator.clipboard.writeText(enText).then(() => {
      setEnCopied(true)
      setTimeout(() => setEnCopied(false), 2000)
    })
  }

  const copyVn = () => {
    navigator.clipboard.writeText(vnText).then(() => {
      setVnCopied(true)
      setTimeout(() => setVnCopied(false), 2000)
    })
  }

  const checkSpelling = async () => {
    setSpellStatus('checking')
    setShowSpell(true)
    setSpellText('')
    try {
      const res = await fetch('/api/spell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.text }),
      })
      const data = await res.json()
      setSpellText(data.text || '')
      setSpellStatus('done')
    } catch {
      setSpellStatus('error')
    }
  }

  const translate = async (lang: 'en' | 'vn') => {
    if (lang === 'en') {
      setEnStatus('translating')
      setShowEn(true)
      setEnText('')
    } else {
      setVnStatus('translating')
      setShowVn(true)
      setVnText('')
    }
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.text, lang }),
      })
      const data = await res.json()
      if (lang === 'en') {
        setEnText(data.text || '')
        setEnStatus('done')
      } else {
        setVnText(data.text || '')
        setVnStatus('done')
      }
    } catch {
      if (lang === 'en') setEnStatus('error')
      else setVnStatus('error')
    }
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

  const ResultBox = ({ status, text, onCopy, copied, label }: {
    status: string; text: string; onCopy: () => void; copied: boolean; label: string
  }) => (
    <div className="rounded-xl border mb-4 overflow-hidden" style={{ borderColor: '#F0D9A8' }}>
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: '#FFF0D6', borderBottom: '0.5px solid #F0D9A8' }}>
        <p className="text-sm font-medium" style={{ color: '#CF710A' }}>✦ {label}</p>
        {status === 'done' && (
          <button onClick={onCopy} className="text-xs px-3 py-1 rounded-md"
            style={{ background: '#E8820C', color: 'white' }}>
            {copied ? '✓ 복사됨' : '복사하기'}
          </button>
        )}
      </div>
      <div className="p-4" style={{ background: '#FFFBF3' }}>
        {(status === 'checking' || status === 'translating') && (
          <div className="flex items-center gap-2 py-4 justify-center">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#F5A623', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: '#B07D3A' }}>
              {status === 'checking' ? '맞춤법을 검사하고 있어요...' : '번역하고 있어요...'}
            </p>
          </div>
        )}
        {status === 'done' && (
          <p className="text-sm leading-8 whitespace-pre-wrap" style={{ color: '#2D1A00' }}>{text}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-500 py-2">오류가 발생했습니다. 다시 시도해주세요.</p>
        )}
      </div>
    </div>
  )

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

      {/* 원본 글 */}
      <div className="rounded-xl border p-4 min-h-[200px] mb-4" style={{ background: '#FFFBF3', borderColor: '#F0D9A8' }}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#F5A623', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: '#B07D3A' }}>AI가 원장님만의 글을 쓰고 있어요...</p>
          </div>
        ) : (
          <p className="text-sm leading-8 whitespace-pre-wrap" style={{ color: '#2D1A00' }}>{result.text}</p>
        )}
      </div>

      {!isLoading && (
        <>
          {/* 1행: 복사 / 다시쓰기 / 맞춤법 */}
          <div className="flex gap-2 mb-2">
            <button onClick={copy} className="flex-1 py-2 text-sm font-medium rounded-lg border transition-all"
              style={{ borderColor: '#E5C98A', color: '#7A4F1E', background: 'white' }}>
              {copied ? '✓ 복사됨' : '복사하기'}
            </button>
            <button onClick={onRegenerate} className="flex-1 py-2 text-sm font-medium rounded-lg border transition-all"
              style={{ borderColor: '#E5C98A', color: '#7A4F1E', background: 'white' }}>
              다시 쓰기
            </button>
            <button onClick={checkSpelling} disabled={spellStatus === 'checking'}
              className="flex-1 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-50"
              style={{ borderColor: '#F5A623', color: '#E8820C', background: '#FFF0D6' }}>
              {spellStatus === 'checking' ? '검사 중...' : '맞춤법'}
            </button>
          </div>

          {/* 2행: 번역 */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => translate('en')} disabled={enStatus === 'translating'}
              className="flex-1 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-50"
              style={{ borderColor: '#E5C98A', color: '#7A4F1E', background: 'white' }}>
              {enStatus === 'translating' ? '번역 중...' : '🇺🇸 영어 번역'}
            </button>
            <button onClick={() => translate('vn')} disabled={vnStatus === 'translating'}
              className="flex-1 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-50"
              style={{ borderColor: '#E5C98A', color: '#7A4F1E', background: 'white' }}>
              {vnStatus === 'translating' ? '번역 중...' : '🇻🇳 베트남어 번역'}
            </button>
          </div>

          {/* 맞춤법 결과 */}
          {showSpell && (
            <ResultBox
              status={spellStatus} text={spellText}
              onCopy={copySpell} copied={spellCopied}
              label="맞춤법 교정본"
            />
          )}

          {/* 영어 번역 결과 */}
          {showEn && (
            <ResultBox
              status={enStatus} text={enText}
              onCopy={copyEn} copied={enCopied}
              label="English Translation"
            />
          )}

          {/* 베트남어 번역 결과 */}
          {showVn && (
            <ResultBox
              status={vnStatus} text={vnText}
              onCopy={copyVn} copied={vnCopied}
              label="Bản dịch tiếng Việt"
            />
          )}

          {/* 이메일 발송 */}
          <div className="rounded-xl p-4 mb-4 border" style={{ background: '#FFFBF3', borderColor: '#F0D9A8' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#B07D3A' }}>이메일로 받기</p>
            <div className="flex gap-2">
              <input type="email" value={email}
                onChange={e => { setEmail(e.target.value); setEmailStatus('idle') }}
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