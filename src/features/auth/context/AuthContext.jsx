import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createAvatarUploadUrl,
  getMyProfile,
  login as loginRequest,
  logout as logoutRequest,
  refresh as refreshRequest,
  register as registerRequest,
  updateMyAvatar,
  updateMyProfile,
  uploadAvatarToStorage,
} from '../services/authApi'
import { AuthContext } from './authContext'

const AUTH_STORAGE_KEY = 'kt-auth'
const DEVICE_STORAGE_KEY = 'kt-device-id'

function createUuid() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16)
    globalThis.crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = [...bytes].map((item) => item.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 14)}`
}

function getDeviceId() {
  const current = localStorage.getItem(DEVICE_STORAGE_KEY)
  if (current) {
    return current
  }

  const generated = `web-${createUuid()}`
  localStorage.setItem(DEVICE_STORAGE_KEY, generated)
  return generated
}

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    if (!parsed?.accessToken || !parsed?.refreshToken) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => readStoredAuth())
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [avatarSubmitting, setAvatarSubmitting] = useState(false)

  const persistAuth = useCallback((nextState) => {
    setAuthState(nextState)

    if (!nextState?.accessToken || !nextState?.refreshToken) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState))
  }, [])

  const clearAuth = useCallback(() => {
    setProfile(null)
    persistAuth(null)
  }, [persistAuth])

  const refreshProfile = useCallback(async (accessToken) => {
    const token = accessToken || authState?.accessToken
    if (!token) {
      setProfile(null)
      return null
    }

    const me = await getMyProfile(token)
    setProfile(me)
    return me
  }, [authState?.accessToken])

  const tryRefreshSession = useCallback(async (refreshToken) => {
    if (!refreshToken) {
      return null
    }

    const tokens = await refreshRequest({
      refresh_token: refreshToken,
      device_id: getDeviceId(),
    })

    const nextState = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenType: tokens.token_type,
    }
    persistAuth(nextState)
    return nextState
  }, [persistAuth])

  useEffect(() => {
    let mounted = true

    async function bootstrapAuth() {
      if (!authState?.accessToken) {
        if (mounted) {
          setAuthLoading(false)
        }
        return
      }

      try {
        await refreshProfile(authState.accessToken)
      } catch {
        try {
          const refreshed = await tryRefreshSession(authState.refreshToken)
          if (refreshed?.accessToken) {
            await refreshProfile(refreshed.accessToken)
          }
        } catch {
          clearAuth()
        }
      } finally {
        if (mounted) {
          setAuthLoading(false)
        }
      }
    }

    bootstrapAuth()

    return () => {
      mounted = false
    }
  }, [authState?.accessToken, authState?.refreshToken, clearAuth, refreshProfile, tryRefreshSession])

  const login = useCallback(async ({ email, password }) => {
    setSubmitting(true)
    try {
      const tokens = await loginRequest({
        email,
        password,
        device_id: getDeviceId(),
      })

      const nextState = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenType: tokens.token_type,
      }

      persistAuth(nextState)
      await refreshProfile(nextState.accessToken)
    } finally {
      setSubmitting(false)
    }
  }, [persistAuth, refreshProfile])

  const register = useCallback(async ({ email, fullName, password }) => {
    setSubmitting(true)
    try {
      await registerRequest({
        email,
        full_name: fullName,
        password,
        device_id: getDeviceId(),
      })
    } finally {
      setSubmitting(false)
    }
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = authState?.refreshToken
    clearAuth()

    if (!refreshToken) {
      return
    }

    try {
      await logoutRequest({
        refresh_token: refreshToken,
        device_id: getDeviceId(),
      })
    } catch {
      // noop
    }
  }, [authState?.refreshToken, clearAuth])

  const saveProfile = useCallback(async ({ fullName, email, organization, studyField, major, phoneNumber }) => {
    if (!authState?.accessToken) {
      throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.')
    }

    setSubmitting(true)
    try {
      const updated = await updateMyProfile(authState.accessToken, {
        full_name: fullName,
        email,
        organization,
        study_field: studyField,
        major,
        phone_number: phoneNumber,
      })
      setProfile(updated)
      return updated
    } finally {
      setSubmitting(false)
    }
  }, [authState?.accessToken])

  const saveAvatar = useCallback(async (file) => {
    if (!authState?.accessToken) {
      throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.')
    }

    if (!file) {
      throw new Error('Không tìm thấy tệp ảnh hợp lệ.')
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      throw new Error('Chỉ hỗ trợ ảnh PNG hoặc JPEG.')
    }

    setAvatarSubmitting(true)
    try {
      const uploadInfo = await createAvatarUploadUrl(authState.accessToken, file.type)
      await uploadAvatarToStorage(uploadInfo.upload_url, file)
      const updated = await updateMyAvatar(authState.accessToken, uploadInfo.object_key)
      setProfile(updated)
      return updated
    } finally {
      setAvatarSubmitting(false)
    }
  }, [authState?.accessToken])

  const value = useMemo(() => ({
    authLoading,
    submitting,
    avatarSubmitting,
    isAuthenticated: Boolean(authState?.accessToken),
    accessToken: authState?.accessToken || null,
    profile,
    login,
    register,
    logout,
    refreshProfile,
    saveProfile,
    saveAvatar,
  }), [authLoading, submitting, avatarSubmitting, authState?.accessToken, profile, login, register, logout, refreshProfile, saveProfile, saveAvatar])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
