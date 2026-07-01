import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'noljak_auth'
const TOKEN_PAYLOAD = 'noljak-writing-access'

function getSecret() {
  const secret = process.env.AUTH_SECRET || process.env.ACCESS_CODE
  if (!secret) throw new Error('AUTH_SECRET or ACCESS_CODE is required')
  return secret
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) return false
  return timingSafeEqual(aBuffer, bBuffer)
}

export function createAuthToken() {
  return createHmac('sha256', getSecret())
    .update(TOKEN_PAYLOAD)
    .digest('hex')
}

export function isValidAccessCode(code: unknown) {
  const expectedCode = process.env.ACCESS_CODE
  if (!expectedCode || typeof code !== 'string') return false
  return safeEqual(code, expectedCode)
}

export function setAuthCookie() {
  cookies().set(COOKIE_NAME, createAuthToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}
export function hasValidAuthCookie() {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return false
  return safeEqual(token, createAuthToken())
}