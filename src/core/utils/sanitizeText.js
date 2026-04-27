const TAG_PATTERN = /<[^>]*>/g

export function sanitizeText(value = '') {
  return String(value).replace(TAG_PATTERN, '').trim()
}
