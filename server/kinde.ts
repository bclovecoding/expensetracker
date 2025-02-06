import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from '@kinde-oss/kinde-typescript-sdk'

import { type Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'

const cookieKeys = [
  'id_token',
  'access_token',
  'refresh_token',
  'user',
] as const

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
} as const

// Client for authorization code flow
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: process.env.KINDE_DOMAIN!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    redirectURL: process.env.KINDE_REDIRECT_URI!,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
  }
)

// Client for client credentials flow
export const kindeApiClient = createKindeServerClient(
  GrantType.CLIENT_CREDENTIALS,
  {
    authDomain: process.env.KINDE_DOMAIN!,
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
  }
)

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    return getCookie(c, key)
  },
  async setSessionItem(key: string, value: unknown) {
    if (typeof value === 'string') {
      setCookie(c, key, value, cookieOptions)
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions)
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key)
  },
  async destroySession() {
    cookieKeys.forEach((key) => deleteCookie(c, key))
  },
})

type Env = {
  Variables: {
    user: UserType
  }
}

export const kindeUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c)
    const isAuthenticated = await kindeClient.isAuthenticated(manager)
    // Boolean: true or false
    if (!isAuthenticated) {
      return c.json({ error: 'Unauthrized' }, 401)
    }
    const user = await kindeClient.getUser(manager)
    c.set('user', user)
    await next()
  } catch (error) {
    console.log(error)
    return c.json({ error: 'Unauthrized' }, 401)
  }
})
