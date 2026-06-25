'use client'

import { useState } from 'react'
import type { DirectorProfile } from '@/lib/types'
import { JOBS, PERSONALITIES, WRITING_STYLES, COLORS } from '@/lib/types'

interface Props {
  profile: DirectorProfile
  onChange: (p: DirectorProfile) => void
  onNext: () => void
}

export default function StepProfile({ profile, onChange, onNext }: Props) {
  const [customJob, setCustomJob] = useState(false)

  const set = (key: keyof DirectorProfile, val: unknown) =>
    onChange({ ...profile, [key]: val })

  const togglePersonality = (v: string) => {
    const cur = profile.personality
    if (cur.includes(v)) set('personality', cur.filter(x => x !== v))
    else if (cur.length < 3) set('personality', [...cur, v])
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-1">기본 정보 입력</h2>
      <p className="text-sm text-gray-500 mb-6">원장님 정보를 알려주시면 더 잘 맞는 글을 써드려요</p>

      {/* 인적 사항 */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">인적 사항</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">이름</label>
          <input value={profile.name} onChange={e => set('name', e.target.value)} placeholder="홍길동" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">연령대</label>
          <select value={profile.age} onChange={e => set('age', e.target.value)}>
            <option value="">선택</option>
            {['20대','30대','40대','50대','60대 이상'].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">지역</label>
          <input value={profile.region} onChange={e => set('region', e.target.value)} placeholder="경기도 동탄" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">전공 / 창업 전 직업</label>
          <input value={profile.major} onChange={e => set('major', e.target.value)} placeholder="시각디자인 / 디자이너" />
        </div>
      </div>

      {/* 직전 직업 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">
          놀작 직전 직업
          <span className="text-gray-400 text-xs ml-1">(없으면 직접 입력)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {JOBS.map(j => (
            <button
              key={j}
              onClick={() => { set('prevJob', j); setCustomJob(false) }}
              className={`chip ${profile.prevJob === j && !customJob ? 'selected' : ''}`}
            >
              {j}
            </button>
          ))}
          <button
            onClick={() => { setCustomJob(true); set('prevJob', '') }}
            className={`chip ${customJob ? 'selected' : ''}`}
          >
            직접 입력
          </button>
        </div>
        {customJob && (
          <input
            value={profile.prevJob}
            onChange={e => set('prevJob', e.target.value)}
            placeholder="직업을 입력하세요"
          />
        )}
      </div>

      {/* 성격 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">
          나의 성격
          <span className="text-gray-400 text-xs ml-1">(최대 3개)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PERSONALITIES.map(p => (
            <button
              key={p}
              onClick={() => togglePersonality(p)}
              className={`chip ${profile.personality.includes(p) ? 'selected' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 선호 문체 */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">
          선호하는 글 스타일
          <span className="text-gray-400 text-xs ml-1">(1개 선택)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {WRITING_STYLES.map(s => (
            <button
              key={s}
              onClick={() => set('writingStyle', s)}
              className={`chip ${profile.writingStyle === s ? 'selected' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 좋아하는 단어 */}
      <div className="mb-5">
        <label className="block text-sm text-gray-600 mb-2">
          내가 좋아하는 단어 3개
          <span className="text-gray-400 text-xs ml-1">(글에 자연스럽게 녹아들어요)</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[0,1,2].map(i => (
            <input
              key={i}
              value={profile.favWords[i]}
              onChange={e => {
                const w = [...profile.favWords]
                w[i] = e.target.value
                set('favWords', w)
              }}
              placeholder={['예: 성장','예: 따뜻함','예: 상상'][i]}
            />
          ))}
        </div>
      </div>

      {/* 색상 */}
      <div className="border-t border-gray-100 pt-5 mb-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          색상 이야기
          <span className="font-normal normal-case ml-1 text-gray-400">(수기·감성 글쓰기 시 활용)</span>
        </p>
        {[
          { key: 'likeColor' as const, reasonKey: 'likeColorReason' as const, label: '가장 좋아하는 색상', reasonPh: '예: 아이들의 밝고 순수한 에너지' },
          { key: 'avoidColor' as const, reasonKey: 'avoidColorReason' as const, label: '다루기 조심스러운 색상', reasonPh: '예: 틀에 박힌 주입식 교육의 답답함' },
        ].map(({ key, reasonKey, label, reasonPh }) => (
          <div key={key} className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => set(key, c.name)}
                  className={`color-chip ${profile[key] === c.name ? 'selected' : ''}`}
                  style={{ background: c.hex, border: (c as {border?: boolean}).border ? '1px solid #ddd' : undefined }}
                />
              ))}
            </div>
            {profile[key] && (
              <p className="text-xs text-noljak-purple mb-2">{profile[key]} 선택됨</p>
            )}
            <input
              value={profile[reasonKey]}
              onChange={e => set(reasonKey, e.target.value)}
              placeholder={reasonPh}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-2.5 bg-noljak-purple text-white text-sm font-medium rounded-lg hover:bg-noljak-purple-dark transition-colors"
      >
        다음 단계 →
      </button>
    </div>
  )
}
