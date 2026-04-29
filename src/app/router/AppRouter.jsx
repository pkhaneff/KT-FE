import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { UserLayout } from '../layouts/UserLayout'
import { ROUTES } from '../../core/constants/routes'

import { LandingPage } from '../../features/public/pages/LandingPage'
import { KnowledgeFeedPage } from '../../features/public/pages/KnowledgeFeedPage'
import { ArticleDetailPage } from '../../features/public/pages/ArticleDetailPage'
import { WorkflowPage } from '../../features/public/pages/WorkflowPage'
import { PricingPage } from '../../features/public/pages/PricingPage'
import { ProductDetailPage } from '../../features/public/pages/ProductDetailPage'
import { CartPage } from '../../features/public/pages/CartPage'
import { CheckoutPage } from '../../features/public/pages/CheckoutPage'
import { AuthPage } from '../../features/public/pages/AuthPage'

import { DashboardPage } from '../../features/user/pages/DashboardPage'
import { ProjectWizardPage } from '../../features/user/pages/ProjectWizardPage'
import { OrdersPage } from '../../features/user/pages/OrdersPage'
import { OrderDetailPage } from '../../features/user/pages/OrderDetailPage'
import { RequestsPage } from '../../features/user/pages/RequestsPage'
import { RequestDetailPage } from '../../features/user/pages/RequestDetailPage'
import { WalletPage } from '../../features/user/pages/WalletPage'
import { ProfilePage } from '../../features/user/pages/ProfilePage'
import { SavedArticlesPage } from '../../features/user/pages/SavedArticlesPage'
import { SettingsPage } from '../../features/user/pages/SettingsPage'
import { RedirectIfAuthenticated, RequireAuth } from '../../features/auth'

export const appRouter = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.PUBLIC_LANDING, element: <LandingPage /> },
      { path: ROUTES.PUBLIC_FEED, element: <KnowledgeFeedPage /> },
      { path: ROUTES.PUBLIC_ARTICLE_DETAIL, element: <ArticleDetailPage /> },
      { path: ROUTES.PUBLIC_WORKFLOW, element: <WorkflowPage /> },
      { path: ROUTES.PUBLIC_PRICING, element: <PricingPage /> },
      { path: ROUTES.PUBLIC_PRODUCT_DETAIL, element: <ProductDetailPage /> },
      { path: ROUTES.PUBLIC_CART, element: <CartPage /> },
      { path: ROUTES.PUBLIC_CHECKOUT, element: <CheckoutPage /> },
      {
        element: <RedirectIfAuthenticated />,
        children: [
          { path: ROUTES.PUBLIC_LOGIN, element: <AuthPage /> },
          { path: ROUTES.PUBLIC_REGISTER, element: <AuthPage /> },
          { path: ROUTES.PUBLIC_FORGOT_PASSWORD, element: <AuthPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/u',
        element: <UserLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.USER_DASHBOARD} replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'project-wizard', element: <ProjectWizardPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:orderId', element: <OrderDetailPage /> },
          { path: 'requests', element: <RequestsPage /> },
          { path: 'requests/:requestId', element: <RequestDetailPage /> },
          { path: 'wallet', element: <WalletPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'saved-articles', element: <SavedArticlesPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.PUBLIC_LANDING} replace /> },
])
