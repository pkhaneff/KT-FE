const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')
const API_PREFIX = '/api/v1'

function resolveApiErrorMessage(payload, fallbackMessage) {
  const detail = payload?.detail
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((item) => item?.msg || 'Dữ liệu không hợp lệ.')
      .join(' | ')
  }

  return payload?.error?.message || payload?.message || fallbackMessage
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
    const message = resolveApiErrorMessage(payload, 'Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.')
    const error = new Error(message)
    error.status = response.status
    error.code = payload?.error?.code
    throw error
  }

  return payload?.data
}

export function listPublicProducts(signal) {
  return apiRequest('/products', {
    method: 'GET',
    signal,
  })
}

export function listPublicProductTypes(signal) {
  return apiRequest('/product-types', {
    method: 'GET',
    signal,
  })
}
