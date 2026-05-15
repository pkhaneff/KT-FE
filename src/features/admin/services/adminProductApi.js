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

export function adminListProductTypes(accessToken) {
  return apiRequest('/admin/product-types', accessToken, {
    method: 'GET',
  })
}

export function adminCreateProductType(accessToken, payload) {
  return apiRequest('/admin/product-types', accessToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function adminUpdateProductType(accessToken, productTypeId, payload) {
  return apiRequest(`/admin/product-types/${productTypeId}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function adminListProducts(accessToken, search = null, productTypeId = null) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (productTypeId) params.append('product_type_id', productTypeId)
  
  return apiRequest(`/admin/products?${params.toString()}`, accessToken, {
    method: 'GET',
  })
}

export function adminCreateProduct(accessToken, payload) {
  return apiRequest('/admin/products', accessToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function adminUpdateProduct(accessToken, productId, payload) {
  return apiRequest(`/admin/products/${productId}`, accessToken, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function adminDeleteProduct(accessToken, productId) {
  return apiRequest(`/admin/products/${productId}`, accessToken, {
    method: 'DELETE',
  })
}

export function adminListProductRequests(accessToken) {
  return apiRequest('/admin/product-requests', accessToken, {
    method: 'GET',
  })
}
