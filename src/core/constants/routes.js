export const ROUTES = {
  PUBLIC_LANDING: '/',
  PUBLIC_FEED: '/knowledge',
  PUBLIC_ARTICLE_DETAIL: '/knowledge/:articleId',
  PUBLIC_WORKFLOW: '/workflow',
  PUBLIC_PRICING: '/pricing',
  PUBLIC_LOGIN: '/auth/login',
  PUBLIC_REGISTER: '/auth/register',
  PUBLIC_FORGOT_PASSWORD: '/auth/forgot-password',

  USER_DASHBOARD: '/u/dashboard',
  USER_WIZARD: '/u/project-wizard',
  USER_ORDERS: '/u/orders',
  USER_ORDER_DETAIL: '/u/orders/:orderId',
  USER_REQUESTS: '/u/requests',
  USER_REQUEST_DETAIL: '/u/requests/:requestId',
  USER_WALLET: '/u/wallet',
  USER_PROFILE: '/u/profile',
  USER_SAVED_ARTICLES: '/u/saved-articles',
  USER_SETTINGS: '/u/settings',
}

export const PUBLIC_NAVIGATION = [
  { label: 'Tổng quan', href: ROUTES.PUBLIC_LANDING },
  { label: 'Kho kiến thức', href: ROUTES.PUBLIC_FEED },
  { label: 'Quy trình', href: ROUTES.PUBLIC_WORKFLOW },
  { label: 'Bảng giá', href: ROUTES.PUBLIC_PRICING },
]

export const USER_NAVIGATION = [
  { section: 'Chính', items: [
    { label: 'Dashboard', href: ROUTES.USER_DASHBOARD },
    { label: 'Đơn của tôi', href: ROUTES.USER_ORDERS },
    { label: 'Yêu cầu', href: ROUTES.USER_REQUESTS },
    { label: 'Ví', href: ROUTES.USER_WALLET },
  ]},
  { section: 'Tài khoản', items: [
    { label: 'Hồ sơ', href: ROUTES.USER_PROFILE },
    { label: 'Bài đã lưu', href: ROUTES.USER_SAVED_ARTICLES },
    { label: 'Cài đặt', href: ROUTES.USER_SETTINGS },
  ]},
]
