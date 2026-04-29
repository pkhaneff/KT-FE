const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')
const API_PREFIX = '/api/v1'

function normalizeValidationPath(loc = []) {
  if (!Array.isArray(loc)) {
    return ''
  }

  const parts = loc.filter((item) => item !== 'body')
  if (!parts.length) {
    return ''
  }

  return parts.join('.')
}

function resolveApiErrorMessage(payload, fallbackMessage) {
  const detail = payload?.detail
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => {
        const path = normalizeValidationPath(item?.loc)
        const message = item?.msg || 'Dữ liệu không hợp lệ.'
        return path ? `${path}: ${message}` : message
      })
      .join(' | ')
  }

  return payload?.error?.message || payload?.message || fallbackMessage
}

async function apiRequest(path, options = {}) {
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    ...options,
    headers: mergedHeaders,
  })

  let payload
  try {
    payload = await response.json()
  } catch {
    payload = undefined
  }

  if (!response.ok || payload?.success === false) {
    const message = resolveApiErrorMessage(payload, 'Yêu cầu thất bại. Vui lòng thử lại.')
    const error = new Error(message)
    error.status = response.status
    error.code = payload?.error?.code
    throw error
  }

  return payload?.data
}

export function register(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function refresh(payload) {
  return apiRequest('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout(payload) {
  return apiRequest('/auth/logout', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMyProfile(accessToken) {
  return apiRequest('/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export function updateMyProfile(accessToken, payload) {
  return apiRequest('/users/me', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })
}

export function createAvatarUploadUrl(accessToken, contentType) {
  return apiRequest('/users/me/avatar/upload-url', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      content_type: contentType,
    }),
  })
}

export async function uploadAvatarToStorage(uploadUrl, file) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error('Tải ảnh đại diện lên thất bại. Vui lòng thử lại.')
  }
}

export function updateMyAvatar(accessToken, objectKey) {
  return apiRequest('/users/me/avatar', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      object_key: objectKey,
    }),
  })
}
