'use client'

import { useRef } from 'react'
import type { WritingConfig, EventContext } from '@/lib/types'
import { PURPOSES, GRADES } from '@/lib/types'

interface Props {
  config: WritingConfig
  eventCtx: EventContext
  photos: Array<{ base64: string; mediaType: string }>
  onChangeConfig: (c: WritingConfig) => void
  onChangeEvent: (e: EventContext) => void
  onChangePhotos: (p: Array<{ base64: string; mediaType: string }>) => void
  onBack: () => void
  onGenerate: () => void
}

const PHOTO_HINTS: Record<string, string> = {
  blog: '수업 현장, 아이 작품, 센터 모습 사진을 올려주세요 (3~5장)',
  insta: '피드에 올릴 사진을 업로드해주세요 (1~5장)',
  intro: '원장님 사진 또는 센터 사진을 올려주세요 (1~5장)',
  event: '아이의 작품이나 성장 과정 사진을 올려주세요 (1~3장)',
  free: '글과 관련된 사진을 올려주세요 (1~5장)',
}

export default function StepWriting({ config, eventCtx, photos, onChangeConfig, onChangeEvent, onChangePhotos, onBack, onGenerate }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const setC = (key: keyof WritingConfig, val: unknown) => onChangeConfig({ ...config, [key]: val })
  const setE = (key: keyof EventContext, val: string) => onChangeEvent({ ...eventCtx, [key]: val })

  const handlePhotos = (files: FileList | null) => {
    if (!files) return
    const maxPhotos = config.purpose === 'event' ? 3 : 5
    const arr = Array.from(files).slice(0, maxPhotos)
    Promise.all(arr.map(f => new Promise<{ base64: string; mediaType: string }>((res) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        res({ base64: result.split(',')[1], mediaType: f.type })
      }
      reader.readAsDataURL(f)
    }))).then(onChangePhotos)
  }

  const validate = () => {
    const missing: string[] = []
    if (config.purpose === 'blog' && !config.blogTopic) missing.push('블로그 글의 주제')
    if (config.purpose === 'insta' && !config.instaTags) missing.push('인스타그램 해시태그')
    if (config.purpose === 'event') {
      if (!eventCtx.childName) missing.push('아이 이름')
      if (!eventCtx.before) missing.push('놀작 시작 전 고민')
      if (!eventCtx.after) missing.push('놀작 후 변화')
    }
    if (config.purpose === 'free' && !config.freeTopic) missing.push('글의 주제')
    if (missing.length > 0) {
      alert(`아래 항목을 입력해주세요:\n\n${missing.map(m => `• ${m}`).join('\n')}`)
      return false
    }
    return true
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-1" style={{ color: '#2D1A00' }}>글쓰기 설정</h2>
      <p className="text-sm mb-5" style={{ color: '#7A4F1E' }}>어떤 글을 써드릴까요?</p>

      {/* 목적 */}
      <p className="section-label">글쓰기 목적</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {PURPOSES.map(p => (
          <button key={p.id} onClick={() => setC('purpose', p.id)}
            className={`text-left p-3 rounded-xl border transition-all ${p.id === 'free' ? 'col-span-2' : ''}`}
            style={config.purpose === p.id
              ? { borderColor: '#E8820C', background: '#FFF0D6' }
              : { borderColor: '#E5C98A', background: 'white' }}>
            <p className="text-sm font-medium" style={{ color: config.purpose === p.id ? '#CF710A' : '#2D1A00' }}>{p.label}</p>
            <p className="text-xs" style={{ color: '#B07D3A' }}>{p.sub}</p>
          </button>
        ))}
      </div>

      {/* 목적별 추가 입력 */}
      {config.purpose === 'blog' && (
        <div className="mb-4">
          <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>블로그 글의 주제 <span className="text-red-400">*</span></label>
          <textarea value={config.blogTopic || ''} onChange={e => setC('blogTopic', e.target.value)}
            placeholder="예: 놀작 미술교육이 아이의 관찰력을 키우는 방법" />
        </div>
      )}

      {config.purpose === 'insta' && (
        <div className="mb-4">
          <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>해시태그 3개 <span className="text-red-400">*</span></label>
          <input value={config.instaTags || ''} onChange={e => setC('instaTags', e.target.value)}
            placeholder="예: #놀작마이아트 #아동미술 #창의교육" />
        </div>
      )}

      {config.purpose === 'intro' && (
        <div className="mb-4">
          <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>원하는 글자 수</label>
          <div className="flex items-center gap-3">
            <input type="number" min={100} max={2000} value={config.introLength || 500}
              onChange={e => setC('introLength', Number(e.target.value))}
              className="w-28" />
            <span className="text-sm" style={{ color: '#B07D3A' }}>자 (최대 2,000자)</span>
          </div>
        </div>
      )}

      {config.purpose === 'event' && (
        <div className="rounded-xl p-4 mb-4 border" style={{ background: '#FFFBF3', borderColor: '#F0D9A8' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#E8820C' }}>🏆 놀작마이아트 15주년 수기 공모전</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>아이 이름 <span className="text-red-400">*</span></label>
              <input value={eventCtx.childName} onChange={e => setE('childName', e.target.value)} placeholder="김놀작" />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>현재 학년</label>
              <select value={eventCtx.childGrade} onChange={e => setE('childGrade', e.target.value)}>
                <option value="">선택</option>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>놀작 시작 시기</label>
            <input value={eventCtx.startAge} onChange={e => setE('startAge', e.target.value)} placeholder="예: 6세 때" />
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>시작 전 아이의 고민 <span className="text-red-400">*</span></label>
            <textarea value={eventCtx.before} onChange={e => setE('before', e.target.value)}
              placeholder="예: 소심하고 도화지 앞에서 그리기를 두려워했어요..." />
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>놀작 후 아이의 변화 <span className="text-red-400">*</span></label>
            <textarea value={eventCtx.after} onChange={e => setE('after', e.target.value)}
              placeholder="예: 사물을 깊게 관찰하는 눈이 생기고 자신감이 붙었어요..." />
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>자랑거리 <span className="text-xs" style={{ color: '#B07D3A' }}>(수상, 생기부 등)</span></label>
            <textarea value={eventCtx.achievement} onChange={e => setE('achievement', e.target.value)}
              placeholder="예: 교내 미술대회 최우수상, 과학상상화 대회 입상..." />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>놀작에 전하는 말</label>
            <textarea value={eventCtx.message} onChange={e => setE('message', e.target.value)}
              placeholder="예: 놀작 덕분에 내 아이도, 나도 당당하게 성장했습니다!" />
          </div>
        </div>
      )}

      {config.purpose === 'free' && (
        <div className="mb-4 space-y-3">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>글의 주제 <span className="text-red-400">*</span></label>
            <textarea value={config.freeTopic || ''} onChange={e => setC('freeTopic', e.target.value)}
              placeholder="어떤 글을 써드릴까요? 자유롭게 알려주세요" />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#7A4F1E' }}>원하는 분량 <span className="text-xs" style={{ color: '#B07D3A' }}>(선택)</span></label>
            <input value={config.freeLength || ''} onChange={e => setC('freeLength', e.target.value)}
              placeholder="예: A4 1매, 500자 내외" />
          </div>
        </div>
      )}

      {/* 사진 첨부 */}
      <div className="section-divider" />
      <p className="section-label">사진 첨부 <span className="font-normal normal-case text-xs" style={{ color: '#B07D3A' }}>(선택)</span></p>
      <p className="text-xs mb-3" style={{ color: '#B07D3A' }}>{PHOTO_HINTS[config.purpose]}</p>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => handlePhotos(e.target.files)} />
      <button onClick={() => fileRef.current?.click()}
        className="w-full py-3 rounded-xl border-2 border-dashed text-sm transition-all mb-2"
        style={{ borderColor: '#E5C98A', color: '#B07D3A' }}>
        📷 사진 선택하기
      </button>
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {photos.map((_, i) => (
            <div key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: '#FFF0D6', color: '#E8820C' }}>
              사진{i + 1} ✓
            </div>
          ))}
          <button onClick={() => onChangePhotos([])} className="text-xs px-2 py-1 rounded-full" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            전체 삭제
          </button>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="btn-secondary flex-none">← 이전</button>
        <button onClick={() => { if (validate()) onGenerate() }} className="btn-primary flex-1">✦ 글 생성하기</button>
      </div>
    </div>
  )
}
