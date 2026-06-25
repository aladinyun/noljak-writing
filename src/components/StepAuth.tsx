'use client'

import { useState } from 'react'

export default function StepAuth({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  const check = () => {
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok) onSuccess()
        else setError(true)
      })
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-1">원장님, 안녕하세요 👋</h2>
      <p className="text-sm text-gray-500 mb-6">내부 접속 코드를 입력해주세요</p>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1.5">접속 코드</label>
        <input
          type="password"
          value={code}
          onChange={e => { setCode(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="접속 코드 입력"
          className={error ? 'border-red-400 ring-2 ring-red-100' : ''}
        />
        {error && <p className="text-red-500 text-xs mt-1.5">코드가 올바르지 않습니다.</p>}
      </div>
      <button
        onClick={check}
        className="w-full py-2.5 bg-noljak-purple text-white text-sm font-medium rounded-lg hover:bg-noljak-purple-dark transition-colors"
      >
        입장하기
      </button>
    </div>
  )
}
