'use client'

import type { WritingReference } from '@/lib/types'

interface Props {
  references: WritingReference[]
  loading: boolean
  onToggle: (index: number, confirmed: boolean) => void
  onBack: () => void
  onGenerate: () => void
  onGenerateWithoutRefs: () => void
}

export default function StepReference({ references, loading, onToggle, onBack, onGenerate, onGenerateWithoutRefs }: Props) {
  // content가 입력된 참고자료만 확인 대상으로 표시 (원래 인덱스 유지)
  const active = references
    .map((r, i) => ({ ref: r, index: i }))
    .filter(({ ref }) => ref.content.trim())

  const confirmedCount = active.filter(({ ref }) => ref.confirmed).length

  return (
    <div>
      <h2 className="text-lg font-bold mb-1" style={{ color: '#2D1A00' }}>참고자료 확인</h2>
      <p className="text-sm mb-5" style={{ color: '#7A4F1E' }}>
        붙여넣은 내용에서 핵심 팩트·키워드를 추출했어요. 반영할 참고자료를 선택해주세요.
      </p>

      {loading ? (
        <div className="rounded-xl p-6 border text-center" style={{ background: '#FFFBF3', borderColor: '#F0D9A8' }}>
          <p className="text-sm" style={{ color: '#B07D3A' }}>참고자료에서 핵심 내용을 요약하는 중입니다…</p>
        </div>
      ) : (
        <div className="space-y-3 mb-5">
          {active.map(({ ref, index }) => (
            <div key={index} className="rounded-xl p-4 border"
              style={ref.confirmed
                ? { background: '#FFF0D6', borderColor: '#E8820C' }
                : { background: '#FAFAFA', borderColor: '#E5E7EB' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold" style={{ color: '#E8820C' }}>
                  참고자료 {index + 1}
                  {ref.source.trim() && <span className="font-normal" style={{ color: '#B07D3A' }}> · {ref.source.trim()}</span>}
                  {ref.originalSource.trim() && <span className="font-normal" style={{ color: '#B07D3A' }}> (원출처: {ref.originalSource.trim()})</span>}
                </p>
              </div>

              <p className="text-xs font-medium mb-1" style={{ color: '#7A4F1E' }}>추출된 핵심 키워드</p>
              <div className="text-sm whitespace-pre-wrap mb-3 p-2.5 rounded-lg" style={{ background: 'white', color: '#2D1A00', border: '1px solid #F0D9A8' }}>
                {ref.summary?.trim() || '요약을 불러오지 못했습니다.'}
              </div>

              <p className="text-xs font-medium mb-1" style={{ color: '#7A4F1E' }}>활용 방향</p>
              <p className="text-sm mb-3" style={{ color: '#7A4F1E' }}>{ref.angle}</p>

              <div className="flex gap-2">
                <button onClick={() => onToggle(index, true)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all"
                  style={ref.confirmed
                    ? { background: '#E8820C', borderColor: '#E8820C', color: 'white' }
                    : { background: 'white', borderColor: '#E5C98A', color: '#7A4F1E' }}>
                  이대로 반영
                </button>
                <button onClick={() => onToggle(index, false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium border transition-all"
                  style={!ref.confirmed
                    ? { background: '#FEE2E2', borderColor: '#FCA5A5', color: '#DC2626' }
                    : { background: 'white', borderColor: '#E5C98A', color: '#7A4F1E' }}>
                  이 참고자료 제외
                </button>
              </div>
            </div>
          ))}

          {confirmedCount === 0 && (
            <p className="text-xs text-center" style={{ color: '#DC2626' }}>
              반영할 참고자료가 없습니다. 하나 이상 반영하거나, 참고자료 없이 진행할 수 있어요.
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={onBack} className="btn-secondary flex-none">← 이전</button>
        {confirmedCount > 0 ? (
          <button onClick={onGenerate} disabled={loading} className="btn-primary flex-1"
            style={loading ? { opacity: 0.5 } : undefined}>
            ✦ 이대로 글 생성하기
          </button>
        ) : (
          <button onClick={onGenerateWithoutRefs} disabled={loading} className="btn-primary flex-1"
            style={loading ? { opacity: 0.5 } : undefined}>
            참고자료 없이 글 생성하기
          </button>
        )}
      </div>
    </div>
  )
}
