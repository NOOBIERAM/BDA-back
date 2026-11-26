const AUTH_TOKEN_KEY = 'bda_access_token'
const AUTH_USERNAME_KEY = 'bda_username'

const canUseStorage = () => typeof window !== 'undefined'

export const setAuthSession = ({
  token,
  username,
}: {
  token: string
  username: string
}) => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  window.localStorage.setItem(AUTH_USERNAME_KEY, username)
}

export const clearAuthSession = () => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY)
  window.localStorage.removeItem(AUTH_USERNAME_KEY)
}

export const getAuthToken = () => {
  if (!canUseStorage()) {
    return null
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export const getAuthUsername = () => {
  if (!canUseStorage()) {
    return null
  }

  return window.localStorage.getItem(AUTH_USERNAME_KEY)
}

export const isAuthenticated = () => Boolean(getAuthToken())
