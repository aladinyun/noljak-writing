import { NextRequest, NextResponse } from 'next/server'
import { isValidAccessCode, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  const ok = isValidAccessCode(code)

  if (ok) {
    setAuthCookie()
  }

  return NextResponse.json({ ok })
}