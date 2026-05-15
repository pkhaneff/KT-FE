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

function withAuth(accessToken) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

export async function userConfirmProposal(accessToken, requestId, proposalId, note) {
  return apiRequest(`/project-requests/${requestId}/proposals/${proposalId}/confirm`, {
    method: 'POST',
    headers: withAuth(accessToken),
    body: JSON.stringify({ note }),
  })
}

export async function userRejectProposal(accessToken, requestId, proposalId, reason) {
  return apiRequest(`/project-requests/${requestId}/proposals/${proposalId}/reject`, {
    method: 'POST',
    headers: withAuth(accessToken),
    body: JSON.stringify({ reason }),
  })
}

export async function userCounterProposal(accessToken, requestId, payload) {
  return apiRequest(`/project-requests/${requestId}/counter`, {
    method: 'POST',
    headers: withAuth(accessToken),
    body: JSON.stringify(payload),
  })
}

export async function userPrepay(accessToken, requestId, idemKey) {
  return apiRequest(`/project-requests/${requestId}/prepay`, {
    method: 'POST',
    headers: withAuth(accessToken),
    body: JSON.stringify({ idem_key: idemKey }),
  })
}

export async function userSyncPayment(accessToken, requestId, paymentId) {
  return apiRequest(`/project-requests/${requestId}/payments/${paymentId}/sync`, accessToken, {
    method: 'POST',
    headers: withAuth(accessToken),
  })
}

export async function userGetContract(accessToken, requestId) {
  return apiRequest(`/project-requests/${requestId}/contract`, accessToken, {
    method: 'GET',
    headers: withAuth(accessToken),
  })
}

export async function userCreateChangeRequest(accessToken, requestId, payload) {
  return apiRequest(`/project-requests/${requestId}/change-requests`, accessToken, {
    method: 'POST',
    headers: withAuth(accessToken),
    body: JSON.stringify(payload),
  })
}

export async function userListProposalRevisions(accessToken, requestId) {
  return apiRequest(`/project-requests/${requestId}/proposal-revisions`, accessToken, {
    method: 'GET',
    headers: withAuth(accessToken),
  })
}
