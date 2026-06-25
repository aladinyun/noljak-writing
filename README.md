# 놀작 원장 AI 글쓰기 지원 서비스

> **URL**: write.noljak.global
> **Phase 1**: 독립 서비스 (현재)
> **Phase 2**: academy.noljak.global 대시보드 통합 예정

## 기능

- 원장 기본 정보 기반 맞춤형 AI 글 생성 (Claude Sonnet)
- 블로그 / 인스타그램 / 소개글 / 이벤트 응모 / 자유 작성
- 15주년 수기 공모전 전용 폼 (이벤트 목적 선택 시)
- 이메일 발송 (Resend)
- 접속 코드 인증

## 기술 스택

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Anthropic SDK (claude-sonnet-4-6)
- Resend

## 로컬 실행

```bash
cp .env.example .env.local
# .env.local에 실제 값 입력

npm install
npm run dev
```

## 환경변수

| 변수 | 설명 |
|------|------|
| `ACCESS_CODE` | 원장 접속 코드 |
| `ANTHROPIC_API_KEY` | Anthropic API 키 |
| `RESEND_API_KEY` | Resend API 키 |
| `RESEND_FROM_EMAIL` | 발신 이메일 (기본: noljak@noljak.global) |

## Vercel 배포

1. GitHub repo 연결
2. 환경변수 4개 입력
3. 배포 완료 후 `write.noljak.global` 도메인 연결

## Cloudflare DNS 설정

```
Type: CNAME
Name: write
Target: cname.vercel-dns.com
Proxy: DNS only (회색 구름)
```

## Phase 2 통합 계획

`docs/ai-writing-feature.md` 참고
