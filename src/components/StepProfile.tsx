'use client'

import type { DirectorProfile } from '@/lib/types'
import { PERSONALITIES, WRITING_STYLES, COLORS, DEGREES, SENTENCE_RHYTHMS, EMOTION_STYLES, OPENING_STYLES } from '@/lib/types'

interface Props {
  profile: DirectorProfile
  onChange: (p: DirectorProfile) => void
  onNext: () => void
}

export default function StepProfile({ profile, onChange, onNext }: Props) {
  const set = (key: keyof DirectorProfile, val: unknown) => onChange({ ...profile, [key]: val })
  const setCareer = (key: keyof typeof profile.career, val: string) =>
    onChange({ ...profile, career: { ...profile.career, [key]: val } })

  const togglePersonality = (v: string) => {
    const cur = profile.personality
    if (cur.includes(v)) set('personality', cur.filter(x => x !== v))
    else if (cur.length < 3) set('personality', [...cur, v])
  }

  const validate = () => {
    const missing: string[] = []
    if (!profile.name) missing.push('이름')
    if (!profile.major) missing.push('전공')
    if (!profile.career.education) missing.push('최종 학력')
    if (!profile.career.degree) missing.push('학위')
    if (!profile.career.career1) missing.push('주요 경력 1')
    if (profile.personality.length === 0) missing.push('나의 성격')
    if (!profile.sentenceRhythm) missing.push('문장 호흡')
    if (!profile.emotionStyle) missing.push('감정 표현 방식')
    if (!profile.openingStyle) missing.push('글 시작 방식')
    if (!profile.writingStyle) missing.push('선호하는 글 스타일')
    if (missing.length > 0) {
      alert(`아래 항목을 입력해주세요:\n\n${missing.map(m => `• ${m}`).join('\n')}`)
      return false
    }
    return true
  }

  const RadioGroup = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="mb-4">
      <p className="text-sm mb-2" style={{ color: '#7A4F1E' }}>{label} <span className="text-xs" style={{ color: '#B07D3A' }}>(1개 선택)</span></p>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)}
            className={`chip ${value === o ? 'selected' : ''}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )

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
          <input value={profile.major} onChange={e => set('major', e.target.value)} placeholder="예: 시각디자인" />
        </div>
      </div>

      {/* 경력 */}
      <p className="section-label mt-4">나의 경력</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>최종 학력</label>
          <input value={profile.career.education} onChange={e => setCareer('education', e.target.value)} placeholder="예: 홍익대학교" />
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
        <div className="grid grid-cols-2 gap-2">
          <input value={profile.career.career1} onChange={e => setCareer('career1', e.target.value)} placeholder="예: 그래픽 디자이너" />
          <input value={profile.career.career1period} onChange={e => setCareer('career1period', e.target.value)} placeholder="예: 2010~2018" />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>주요 경력 2 <span className="text-xs" style={{ color: '#B07D3A' }}>(선택)</span></label>
        <div className="grid grid-cols-2 gap-2">
          <input value={profile.career.career2} onChange={e => setCareer('career2', e.target.value)} placeholder="예: 미술학원 강사" />
          <input value={profile.career.career2period} onChange={e => setCareer('career2period', e.target.value)} placeholder="예: 2018~2020" />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>수상 및 업적 <span className="text-xs" style={{ color: '#B07D3A' }}>(선택, 최대 2개)</span></label>
        <div className="space-y-2">
          <input value={profile.career.award1} onChange={e => setCareer('award1', e.target.value)} placeholder="예: 2023 놀작 우수원장상" />
          <input value={profile.career.award2} onChange={e => setCareer('award2', e.target.value)} placeholder="예: 지역 교육청 표창" />
        </div>
      </div>

      <div className="section-divider" />

      {/* 성격 */}
      <p className="section-label">나의 성격</p>
      <p className="text-sm mb-2" style={{ color: '#7A4F1E' }}>나의 성격을 설명하는 문장을 최대 3개를 선택해주세요.</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {PERSONALITIES.map(p => (
          <button key={p} onClick={() => togglePersonality(p)} className={`chip ${profile.personality.includes(p) ? 'selected' : ''}`}>{p}</button>
        ))}
      </div>

      {/* 문장 스타일 */}
      <p className="section-label">나만의 문장 스타일</p>
      <RadioGroup label="문장 호흡" options={SENTENCE_RHYTHMS} value={profile.sentenceRhythm} onChange={v => set('sentenceRhythm', v)} />
      <RadioGroup label="감정 표현 방식" options={EMOTION_STYLES} value={profile.emotionStyle} onChange={v => set('emotionStyle', v)} />
      <RadioGroup label="글 시작 방식" options={OPENING_STYLES} value={profile.openingStyle} onChange={v => set('openingStyle', v)} />

      {/* 선호 문체 */}
      <p className="section-label mt-1">선호하는 글 스타일을 선택해주세요. (1개)</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {WRITING_STYLES.map(s => (
          <button key={s} onClick={() => set('writingStyle', s)} className={`chip ${profile.writingStyle === s ? 'selected' : ''}`}>{s}</button>
        ))}
      </div>

      {/* 좋아하는 단어 */}
      <p className="section-label">내가 좋아하는 단어</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[0, 1, 2].map(i => (
          <input key={i} value={profile.favWords[i]}
            onChange={e => { const w = [...profile.favWords]; w[i] = e.target.value; set('favWords', w) }}
            placeholder={['예: 성장', '예: 따뜻함', '예: 상상'][i]} />
        ))}
      </div>

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
