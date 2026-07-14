'use client'

import { useState } from 'react'

const LOGO_B64 = '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'

export default function SignaturePage() {
  const [form, setForm] = useState({
    nameKo: '',
    nameEn: '',
    title: '',
    titleEn: '',
    email: '',
    mobile: '',
    officePhone: '',
    office: 'hq',
  })
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const getSignatureHtml = () => {
    const phoneHq = form.officePhone ? `+82 ${form.officePhone} &nbsp;|&nbsp; ` : ''
    const hqBlock = `
      <tr>
        <td style="padding-right:6px;vertical-align:top;">
          <span style="font-size:10px;font-weight:700;color:#ffffff;background:#4CAF50;padding:2px 6px;border-radius:3px;letter-spacing:0.5px;">HQ</span>
        </td>
        <td style="vertical-align:top;">
          <span style="font-size:12px;color:#555555;">2F, 40 Saimdang-ro 8-gil, Seocho-gu, Seoul, Republic of Korea</span><br>
          <span style="font-size:12px;color:#555555;">${phoneHq}${form.mobile ? `+82 ${form.mobile}` : ''}</span>
        </td>
      </tr>`

    const vnBlock = `
      <tr>
        <td style="padding-right:6px;vertical-align:top;">
          <span style="font-size:10px;font-weight:700;color:#ffffff;background:#FF5722;padding:2px 6px;border-radius:3px;letter-spacing:0.5px;">VN</span>
        </td>
        <td style="vertical-align:top;">
          <span style="font-size:12px;color:#555555;">3F, 175 Phan Chu Trinh, Bình Lợi Trung, Hồ Chí Minh 70000, Vietnam</span><br>
          <span style="font-size:12px;color:#555555;">${form.mobile ? `+84 ${form.mobile}` : ''}</span>
        </td>
      </tr>`

    const officeBlock = form.office === 'hq' ? hqBlock : vnBlock

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;border-collapse:collapse;">
  <tr>
    <td style="padding:16px 20px 16px 0;border-right:3px solid #f0f0f0;vertical-align:middle;">
      <img src="data:image/png;base64,${LOGO_B64}" alt="NOLJAK" width="120" style="display:block;">
    </td>
    <td style="padding:16px 0 16px 20px;vertical-align:top;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-bottom:4px;">
            <span style="font-size:15px;font-weight:700;color:#222222;letter-spacing:0.3px;">${form.nameEn || form.nameKo}</span>
            <span style="font-size:12px;color:#888888;margin-left:8px;">${form.titleEn || form.title}, Noljak Edu</span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:10px;border-bottom:1px solid #eeeeee;">
            <a href="mailto:${form.email}" style="font-size:12px;color:#3a9ad9;text-decoration:none;">${form.email}</a>
            ${form.email ? '&nbsp;|&nbsp;' : ''}
            <a href="https://www.noljak.global" style="font-size:12px;color:#3a9ad9;text-decoration:none;">www.noljak.global</a>
          </td>
        </tr>
        <tr>
          <td style="padding-top:10px;">
            <table cellpadding="0" cellspacing="0" border="0">
              ${officeBlock}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
  }

  const copySignature = async () => {
    const html = getSignatureHtml()
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([html], { type: 'text/plain' }),
        }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const el = document.createElement('div')
      el.innerHTML = html
      document.body.appendChild(el)
      const range = document.createRange()
      range.selectNode(el)
      window.getSelection()?.removeAllRanges()
      window.getSelection()?.addRange(range)
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e9ecef', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src={`data:image/png;base64,${LOGO_B64}`} alt="NOLJAK" style={{ height: '32px' }} />
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#333' }}>이메일 서명 생성기</span>
      </div>

      <div style={{ maxWidth: '760px', margin: '32px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Form */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '20px', marginTop: 0 }}>정보 입력</h2>

          {[
            { label: '이름 (한글)', name: 'nameKo', placeholder: '예) 윤정환' },
            { label: '이름 (영문)', name: 'nameEn', placeholder: '예) JungWhan Yun' },
            { label: '직책 (한글)', name: 'title', placeholder: '예) 대표이사' },
            { label: '직책 (영문)', name: 'titleEn', placeholder: '예) CEO' },
            { label: '이메일', name: 'email', placeholder: '예) ceo@noljakedu.com' },
            { label: '휴대폰 번호', name: 'mobile', placeholder: '예) 10-5659-5511' },
            { label: '사무실 번호 (선택)', name: 'officePhone', placeholder: '예) 2-1661-7968' },
          ].map(({ label, name, placeholder }) => (
            <div key={name} style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>{label}</label>
              <input
                type="text"
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                placeholder={placeholder}
                style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          ))}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>소속 오피스</label>
            <select
              name="office"
              value={form.office}
              onChange={handleChange}
              style={{ width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 10px', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
            >
              <option value="hq">한국 본사 (HQ)</option>
              <option value="vn">베트남 오피스 (VN)</option>
            </select>
          </div>
        </div>

        {/* Preview + Copy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '24px', flex: 1 }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '16px', marginTop: 0 }}>미리보기</h2>
            <div
              style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', overflowX: 'auto' }}
              dangerouslySetInnerHTML={{ __html: getSignatureHtml() }}
            />
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e9ecef', padding: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '8px', marginTop: 0 }}>Gmail에 적용하는 방법</h2>
            <ol style={{ fontSize: '12px', color: '#666', paddingLeft: '16px', margin: '0 0 16px 0', lineHeight: 1.8 }}>
              <li>아래 버튼으로 서명 복사</li>
              <li>Gmail → 설정(⚙️) → 모든 설정 보기</li>
              <li>일반 탭 → 서명 → 새 서명 만들기</li>
              <li>서명 입력창에 붙여넣기 (Ctrl+V)</li>
              <li>변경사항 저장</li>
            </ol>
            <button
              onClick={copySignature}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: copied ? '#4CAF50' : '#333', color: '#fff', fontSize: '14px', fontWeight: 600,
                transition: 'background 0.2s'
              }}
            >
              {copied ? '✓ 복사 완료!' : '서명 복사하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
