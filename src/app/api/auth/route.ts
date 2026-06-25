import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  const ok = code === process.env.ACCESS_CODE
  return NextResponse.json({ ok })
}
