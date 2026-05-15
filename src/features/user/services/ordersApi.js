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

async function apiRequest(path, accessToken, options = {}) {
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
    const message = resolveApiErrorMessage(payload, 'Yêu cầu thất bại. Vui lòng thử lại.')
    const error = new Error(message)
    error.status = response.status
    error.code = payload?.error?.code
    throw error
  }

  return payload?.data
}

export function listOrders(accessToken) {
  return apiRequest('/orders', accessToken, {
    method: 'GET',
  })
}

export function getPurchasedPackages(accessToken) {
  return apiRequest('/orders/purchased-packages', accessToken, {
    method: 'GET',
  })
}

export function getOrderDetails(accessToken, orderId) {
  return apiRequest(`/orders/${orderId}`, accessToken, {
    method: 'GET',
  })
}

export function createOrderPayment(accessToken, orderId, idemKey) {
  return apiRequest(`/orders/${orderId}/payments`, accessToken, {
    method: 'POST',
    body: JSON.stringify({ idem_key: idemKey }),
  })
}

export function syncOrderPayment(accessToken, orderId, paymentId) {
  return apiRequest(`/orders/${orderId}/payments/${paymentId}/sync`, accessToken, {
    method: 'POST',
  })
}
