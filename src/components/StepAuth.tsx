'use client'

import { useState } from 'react'

export default function StepAuth({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  const check = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    const d = await res.json()
    if (d.ok) onSuccess()
    else setError(true)
  }

  return (
    <div className="text-center py-4">
      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#B07D3A' }}>놀작마이아트 원장 전용</p>
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#2D1A00' }}>AI 글쓰기 지원</h1>
      <p className="text-sm mb-8" style={{ color: '#7A4F1E' }}>원장님만의 이야기를 AI가 글로 완성해드립니다</p>

      <div className="text-left mb-4">
        <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>접속 코드</label>
        <input
          type="password"
          value={code}
          onChange={e => { setCode(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="접속 코드를 입력해주세요"
        />
        {error && <p className="text-red-500 text-xs mt-1.5">코드가 올바르지 않습니다.</p>}
      </div>
      <button onClick={check} className="btn-primary">입장하기</button>
    </div>
  )
}
