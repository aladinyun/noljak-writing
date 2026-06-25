'use client'

import type { WritingConfig, EventContext } from '@/lib/types'
import { PURPOSES, LENGTHS, GRADES } from '@/lib/types'

interface Props {
  config: WritingConfig
  eventCtx: EventContext
  onChangeConfig: (c: WritingConfig) => void
  onChangeEvent: (e: EventContext) => void
  onBack: () => void
  onGenerate: () => void
}

export default function StepWriting({ config, eventCtx, onChangeConfig, onChangeEvent, onBack, onGenerate }: Props) {
  const setConfig = (key: keyof WritingConfig, val: string) =>
    onChangeConfig({ ...config, [key]: val })
  const setEvent = (key: keyof EventContext, val: string) =>
    onChangeEvent({ ...eventCtx, [key]: val })

  const validate = () => {
    if (config.purpose === 'event') {
      if (!eventCtx.childName || !eventCtx.before || !eventCtx.after) {
        alert('아이 이름, 놀작 전 고민, 놀작 후 변화는 필수 입력입니다.')
        return false
      }
    }
    if (config.purpose === 'free' && !config.freeTopic) {
      alert('글의 주제나 요청사항을 입력해주세요.')
      return false
    }
    return true
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-1">글쓰기 설정</h2>
      <p className="text-sm text-gray-500 mb-6">어떤 글을 써드릴까요?</p>

      {/* 목적 */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">글쓰기 목적</p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {PURPOSES.map(p => (
          <button
            key={p.id}
            onClick={() => setConfig('purpose', p.id)}
            className={`
              text-left p-3 rounded-xl border transition-all
              ${config.purpose === p.id
                ? 'border-noljak-purple bg-noljak-purple-light'
                : 'border-gray-200 hover:border-gray-300 bg-white'}
              ${p.id === 'free' ? 'col-span-2' : ''}
            `}
          >
            <p className={`text-sm font-medium ${config.purpose === p.id ? 'text-noljak-purple-dark' : 'text-gray-800'}`}>
              {p.label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{p.sub}</p>
          </button>
        ))}
      </div>

      {/* 조건부 입력 */}
      {config.purpose === 'intro' && (
        <div className="mt-3 mb-2">
          <label className="block text-sm text-gray-600 mb-1.5">추가 정보 <span className="text-gray-400 text-xs">(선택)</span></label>
          <textarea
            value={config.introExtra || ''}
            onChange={e => setConfig('introExtra', e.target.value)}
            placeholder="센터 이름, 강조하고 싶은 점 등"
          />
        </div>
      )}
      {config.purpose === 'free' && (
        <div className="mt-3 mb-2">
          <label className="block text-sm text-gray-600 mb-1.5">글의 주제 또는 요청사항 <span className="text-red-400 text-xs">*</span></label>
          <textarea
            value={config.freeTopic || ''}
            onChange={e => setConfig('freeTopic', e.target.value)}
            placeholder="어떤 글을 써드릴까요? 자유롭게 알려주세요"
          />
        </div>
      )}
      {config.purpose === 'event' && (
        <div className="mt-3 mb-2 border border-noljak-purple/20 rounded-xl p-4 bg-noljak-purple-light/30">
          <p className="text-xs font-medium text-noljak-purple-dark mb-3">🏆 이벤트/공모전 응모 정보</p>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">이벤트 안내문 <span className="text-gray-400 text-xs">(선택)</span></label>
            <textarea
              value={config.eventPrompt || ''}
              onChange={e => setConfig('eventPrompt', e.target.value)}
              placeholder="이벤트 응모 안내문을 붙여넣어 주세요"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">아이 이름 <span className="text-red-400 text-xs">*</span></label>
              <input value={eventCtx.childName} onChange={e => setEvent('childName', e.target.value)} placeholder="김놀작" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">현재 나이</label>
              <input value={eventCtx.childAge} onChange={e => setEvent('childAge', e.target.value)} placeholder="13세" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">학년</label>
              <select value={eventCtx.childGrade} onChange={e => setEvent('childGrade', e.target.value)}>
                <option value="">선택</option>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">놀작 시작 시기</label>
              <input value={eventCtx.startAge} onChange={e => setEvent('startAge', e.target.value)} placeholder="6세 때" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">센터 운영 기간</label>
              <input value={eventCtx.openPeriod} onChange={e => setEvent('openPeriod', e.target.value)} placeholder="8년째" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">놀작 전 아이의 고민 <span className="text-red-400 text-xs">*</span></label>
            <textarea value={eventCtx.before} onChange={e => setEvent('before', e.target.value)} placeholder="예: 소심하고 도화지 앞에서 그리기를 두려워했어요..." />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">놀작 후 아이의 변화 <span className="text-red-400 text-xs">*</span></label>
            <textarea value={eventCtx.after} onChange={e => setEvent('after', e.target.value)} placeholder="예: 사물을 깊게 관찰하는 눈이 생기고 자신감이 붙었어요..." />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1.5">구체적인 성과나 자랑거리</label>
            <textarea value={eventCtx.achievement} onChange={e => setEvent('achievement', e.target.value)} placeholder="예: 교내 미술대회 최우수상, 과학상상화 대회 입상..." />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">놀작과 아이에게 전하고 싶은 말</label>
            <textarea value={eventCtx.message} onChange={e => setEvent('message', e.target.value)} placeholder="예: 놀작 덕분에 내 아이도, 나도 당당하게 성장했습니다!" />
          </div>
        </div>
      )}

      {/* 분량 */}
      <div className="border-t border-gray-100 pt-5 mt-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">분량 (A4 기준)</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LENGTHS.map(l => (
            <button
              key={l.label}
              onClick={() => setConfig('length', `${l.label} (${l.sub})`)}
              className={`
                text-left p-3 rounded-xl border transition-all
                ${config.length.includes(l.label)
                  ? 'border-noljak-purple bg-noljak-purple-light'
                  : 'border-gray-200 hover:border-gray-300 bg-white'}
              `}
            >
              <p className={`text-sm font-medium ${config.length.includes(l.label) ? 'text-noljak-purple-dark' : 'text-gray-800'}`}>
                {l.label}
              </p>
              <p className="text-xs text-gray-400">{l.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-none px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← 이전
        </button>
        <button
          onClick={() => { if(validate()) onGenerate() }}
          className="flex-1 py-2.5 bg-noljak-purple text-white text-sm font-medium rounded-lg hover:bg-noljak-purple-dark transition-colors"
        >
          ✦ 글 생성하기
        </button>
      </div>
    </div>
  )
}
