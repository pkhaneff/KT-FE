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
    const message = resolveApiErrorMessage(payload, 'Yêu cầu thất bại. Vui lòng thử lại.')
    const error = new Error(message)
    error.status = response.status
    error.code = payload?.error?.code
    throw error
  }

  return payload?.data
}

function withAuth(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

export function listProductTypes() {
  return apiRequest('/product-types', {
    method: 'GET',
  })
}

export function listProducts(search = null, productTypeId = null) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (productTypeId) params.append('product_type_id', productTypeId)
  
  return apiRequest(`/products?${params.toString()}`, {
    method: 'GET',
  })
}

export function createProductRequest(accessToken, payload) {
  return apiRequest('/product-requests', {
    method: 'POST',
    headers: withAuth(accessToken),
    body: JSON.stringify(payload),
  })
}

export function listMyProductRequests(accessToken) {
  return apiRequest('/product-requests', {
    method: 'GET',
    headers: withAuth(accessToken),
  })
}
