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
        const message = item?.msg || 'Du lieu khong hop le.'
        return path ? `${path}: ${message}` : message
      })
      .join(' | ')
  }

  return payload?.error?.message || payload?.message || fallbackMessage
}

async function adminRequest(path, accessToken, options = {}) {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  })

  let payload
  try {
    payload = await response.json()
  } catch {
    payload = undefined
  }

  if (!response.ok || payload?.success === false) {
    const message = resolveApiErrorMessage(payload, 'Yeu cau that bai. Vui long thu lai.')
    const error = new Error(message)
    error.status = response.status
    error.code = payload?.error?.code
    throw error
  }

  return payload?.data
}

export function listAdminProjectRequests(accessToken) {
  return adminRequest('/admin/project-requests', accessToken, { method: 'GET' })
}

export function adminProviderDecision(accessToken, requestId, accept) {
  const query = new URLSearchParams({ accept: String(accept) })
  return adminRequest(`/admin/project-requests/${requestId}/provider-decision?${query.toString()}`, accessToken, { method: 'POST' })
}
