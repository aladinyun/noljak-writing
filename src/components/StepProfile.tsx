'use client'

import { useEffect } from 'react'
import type { DirectorProfile } from '@/lib/types'
import { PERSONALITY_CATEGORIES, COLORS, DEGREES } from '@/lib/types'

interface Props {
  profile: DirectorProfile
  onChange: (p: DirectorProfile) => void
  onNext: () => void
}

const STORAGE_KEY = 'noljak_director_profile'

const defaultPersonality = {
  energyDirection: '',
  emotionExpression: '',
  thinkingStyle: '',
  lifeAttitude: '',
  expressionStyle: '',
}

export default function StepProfile({ profile, onChange, onNext }: Props) {
  const set = (key: keyof DirectorProfile, val: unknown) => onChange({ ...profile, [key]: val })
  const setCareer = (key: keyof typeof profile.career, val: string) =>
    onChange({ ...profile, career: { ...profile.career, [key]: val } })
  const setPersonality = (key: keyof typeof profile.personality, val: string) =>
    onChange({ ...profile, personality: { ...profile.personality, [key]: val } })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) onChange(JSON.parse(saved))
    } catch {}
  }, [])

  const saveProfile = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
      alert('기본 정보가 저장되었습니다. 다음 접속 시 자동으로 불러옵니다.')
    } catch {}
  }

  const validate = () => {
    const missing: string[] = []
    if (!profile.name) missing.push('이름')
    if (!profile.major) missing.push('전공')
    if (!profile.career.education) missing.push('최종 학교')
    if (!profile.career.degree) missing.push('학위')
    if (!profile.career.career1) missing.push('주요 경력 1')
    const p = profile.personality
    if (!p.energyDirection) missing.push('성격 - 에너지 방향')
    if (!p.emotionExpression) missing.push('성격 - 감정 표현')
    if (!p.thinkingStyle) missing.push('성격 - 사고 방식')
    if (!p.lifeAttitude) missing.push('성격 - 생활 태도')
    if (!p.expressionStyle) missing.push('성격 - 표현 방식')
    if (missing.length > 0) {
      alert(`아래 항목을 입력해주세요:\n\n${missing.map(m => `• ${m}`).join('\n')}`)
      return false
    }
    return true
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-1" style={{ color: '#2D1A00' }}>기본 정보 입력</h2>
      <p className="text-sm mb-5" style={{ color: '#7A4F1E' }}>원장님 정보를 알려주시면 더 잘 맞는 글을 써드려요</p>

      {/* 기본 정보 */}
      <p className="section-label">기본 정보</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>이름</label>
          <input value={profile.name} onChange={e => set('name', e.target.value)} placeholder="김놀작" />
        </div>
        <div>
          <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>전공</label>
          <input
            value={profile.major}
            onChange={e => set('major', e.target.value)}
            placeholder="예: 시각디자인"
            maxLength={10}
          />
        </div>
      </div>

      {/* 경력 */}
      <p className="section-label mt-4">나의 경력</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>최종 학교</label>
          <input value={profile.career.education} onChange={e => setCareer('education', e.target.value)} placeholder="예: 놀작대학교" />
        </div>
        <div>
          <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>학위</label>
          <select value={profile.career.degree} onChange={e => setCareer('degree', e.target.value)}>
            <option value="">선택</option>
            {DEGREES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>주요 경력 1 <span className="text-red-400">*</span></label>
        <div className="flex gap-2 items-center">
          <input
            value={profile.career.career1}
            onChange={e => setCareer('career1', e.target.value)}
            placeholder="예: 놀작에듀 디자인 팀장"
            className="flex-1"
          />
          <input
            type="number" min={1} max={99}
            value={profile.career.career1period}
            onChange={e => setCareer('career1period', e.target.value)}
            placeholder="년수"
            style={{ width: '56px' }}
          />
          <span className="text-sm whitespace-nowrap" style={{ color: '#7A4F1E' }}>년</span>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>주요 경력 2 <span className="text-xs" style={{ color: '#B07D3A' }}>(선택)</span></label>
        <div className="flex gap-2 items-center">
          <input
            value={profile.career.career2}
            onChange={e => setCareer('career2', e.target.value)}
            placeholder="예: 미술학원 강사"
            className="flex-1"
          />
          <input
            type="number" min={1} max={99}
            value={profile.career.career2period}
            onChange={e => setCareer('career2period', e.target.value)}
            placeholder="년수"
            style={{ width: '56px' }}
          />
          <span className="text-sm whitespace-nowrap" style={{ color: '#7A4F1E' }}>년</span>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>
          수상 및 업적 <span className="text-xs" style={{ color: '#B07D3A' }}>(선택 · 여러 개는 쉼표로 구분)</span>
        </label>
        <textarea
          value={profile.career.awards}
          onChange={e => setCareer('awards', e.target.value)}
          placeholder="예: 2023 놀작 우수원장상, 지역 교육청 표창, OO대회 입상"
          style={{ minHeight: '72px' }}
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>
          내 센터를 한 단어로 표현하면? <span className="text-xs" style={{ color: '#B07D3A' }}>(선택)</span>
        </label>
        <input
          value={profile.career.centerKeyword}
          onChange={e => setCareer('centerKeyword', e.target.value)}
          placeholder="예: 따뜻한 / 창의적인 / 전문적인 / 즐거운"
        />
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={saveProfile}
        className="w-full py-2 text-sm font-medium rounded-lg border mb-5 transition-all"
        style={{ borderColor: '#E5C98A', color: '#E8820C', background: '#FFFBF3' }}
      >
        💾 기본 정보 저장하기 (다음 접속 시 자동 불러오기)
      </button>

      <div className="section-divider" />

      {/* 성격 */}
      <p className="section-label">나의 성격</p>
      <p className="text-sm mb-4" style={{ color: '#7A4F1E' }}>각 항목에서 나를 가장 잘 설명하는 것을 1개씩 선택해주세요.</p>

      {(Object.keys(PERSONALITY_CATEGORIES) as Array<keyof typeof PERSONALITY_CATEGORIES>).map(catKey => {
        const cat = PERSONALITY_CATEGORIES[catKey]
        return (
          <div key={catKey} className="mb-4">
            <p className="text-xs font-medium mb-2" style={{ color: '#B07D3A' }}>{cat.label}</p>
            <div className="flex flex-wrap gap-2">
              {cat.options.map((o: string) => (
                <button
                  key={o}
                  onClick={() => setPersonality(catKey, o)}
                  className={`chip ${profile.personality[catKey] === o ? 'selected' : ''}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <div className="section-divider" />

      {/* 색상 */}
      <p className="section-label">색상 이야기 <span className="font-normal normal-case text-xs" style={{ color: '#B07D3A' }}>(수기·감성 글 작성 시 활용)</span></p>
      {[
        { key: 'likeColor' as const, rKey: 'likeColorReason' as const, label: '가장 좋아하는 색상', ph: '이 색을 좋아하는 이유' },
        { key: 'avoidColor' as const, rKey: 'avoidColorReason' as const, label: '다루기 조심스러운 색상', ph: '이 색이 조심스러운 이유' },
      ].map(({ key, rKey, label, ph }) => (
        <div key={key} className="mb-4">
          <label className="block text-sm mb-2" style={{ color: '#7A4F1E' }}>{label}</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {COLORS.map(c => (
              <button key={c.name} title={c.name} onClick={() => set(key, c.name)}
                className={`color-chip ${profile[key] === c.name ? 'selected' : ''}`}
                style={{ background: c.hex, border: (c as { border?: boolean }).border ? '1px solid #ddd' : undefined }} />
            ))}
          </div>
          {profile[key] && <p className="text-xs mb-1" style={{ color: '#E8820C' }}>{profile[key]} 선택됨</p>}
          <input value={profile[rKey]} onChange={e => set(rKey, e.target.value)} placeholder={ph} />
        </div>
      ))}

      <button onClick={() => { if (validate()) onNext() }} className="btn-primary mt-2">다음 단계 →</button>
    </div>
  )
}