// Connected ProjectMentor Hub prototype
// One state-based SPA over the existing visual system.

const {
  Icon, Logo, Avatar, StatusBadge, Sidebar, ScreenFrame, StripedImg, StatCard, BarChart,
  MOCK, NAV_BY_ROLE, ROUTES, NavProvider, useNav, ContactWarning, RequestThread,
  detectLeaks, ArticleListPanel, ArticleModerationPanel
} = window;

const AppStateContext = React.createContext(null);
const useAppState = () => React.useContext(AppStateContext);

const fmtMoney = (n) => (n || 0).toLocaleString('vi-VN') + 'đ';

const MARKET_PROJECTS = [
  { id: 'PRJ-2845', title: 'Drone tự động né vật cản bằng LiDAR', cat: 'Robotics', budget: '6.5 - 8.0M', deadline: '45 ngày', diff: 'Nâng cao', skills: ['ROS2', 'C++', 'SLAM'], match: '92%', posted: '20 phút' },
  { id: 'PRJ-2844', title: 'App theo dõi bệnh nhân tim mạch + IoT patch', cat: 'IoT', budget: '5.0 - 6.5M', deadline: '60 ngày', diff: 'Nâng cao', skills: ['Flutter', 'BLE', 'Firebase'], match: '88%', posted: '1 giờ' },
  { id: 'PRJ-2843', title: 'Hệ thống chấm công nhận diện khuôn mặt', cat: 'AI/ML', budget: '3.5 - 4.5M', deadline: '30 ngày', diff: 'Trung bình', skills: ['Python', 'OpenCV', 'FastAPI'], match: '81%', posted: '2 giờ' },
  { id: 'PRJ-2842', title: 'Website bán giày thể thao Next.js + PostgreSQL', cat: 'Web App', budget: '3.0 - 4.0M', deadline: '35 ngày', diff: 'Trung bình', skills: ['Next.js', 'Stripe', 'Postgres'], match: '76%', posted: '3 giờ' },
  { id: 'PRJ-2840', title: 'Robot cắt cỏ tự hành cho vườn nhỏ', cat: 'Robotics', budget: '4.0 - 5.5M', deadline: '50 ngày', diff: 'Nâng cao', skills: ['Arduino', 'GPS', '3D Print'], match: '73%', posted: '5 giờ' },
  { id: 'PRJ-2838', title: 'Dashboard phân tích doanh thu cửa hàng', cat: 'Data', budget: '2.0 - 2.8M', deadline: '20 ngày', diff: 'Cơ bản', skills: ['PowerBI', 'SQL', 'ETL'], match: '69%', posted: 'Hôm qua' },
];

const PUBLIC_PROJECT_PACKAGES = [
  {
    id: 'PKG-301',
    title: 'Bộ đồ án nhà kính IoT STM32 + ESP32',
    seller: 'Đăng bởi mentor đã xác minh',
    category: 'IoT / Embedded',
    price: 4200000,
    time: '4 - 6 tuần',
    level: 'Trung bình',
    deliverables: ['Firmware STM32', 'Gateway ESP32 MQTT', 'Dashboard realtime', 'Báo cáo + slide'],
  },
  {
    id: 'PKG-302',
    title: 'Website quản lý phòng khám Next.js',
    seller: 'Đăng bởi admin',
    category: 'Web App',
    price: 3500000,
    time: '3 - 5 tuần',
    level: 'Cơ bản',
    deliverables: ['Frontend responsive', 'Admin dashboard', 'Database schema', 'Tài liệu triển khai'],
  },
  {
    id: 'PKG-303',
    title: 'Nhận diện rác thải bằng CNN',
    seller: 'Đăng bởi mentor đã xác minh',
    category: 'AI / ML',
    price: 5800000,
    time: '5 - 7 tuần',
    level: 'Nâng cao',
    deliverables: ['Notebook training', 'API inference', 'Demo app', 'Báo cáo thực nghiệm'],
  },
  {
    id: 'PKG-304',
    title: 'Robot dò line Arduino 3 cảm biến',
    seller: 'Đăng bởi admin',
    category: 'Robotics',
    price: 2400000,
    time: '2 - 4 tuần',
    level: 'Cơ bản',
    deliverables: ['Sơ đồ mạch', 'Code điều khiển', 'Danh sách linh kiện', 'Video demo'],
  },
];

const STRUCTURED_REQUESTS = [
  {
    id: 'REQ-1094', type: 'Yêu cầu chỉnh sửa', status: 'Chờ mentor phản hồi', priority: 'Cao',
    creator: 'Nguyễn Minh Anh', relatedOrder: 'PRJ-2841', time: '09:42 · 18 Th.5',
    title: 'Chỉnh lại retry logic cho Telegram Bot', files: 'demo.mp4, log.csv',
    ai: 'AI tóm tắt: cần sửa exponential backoff, không có thông tin liên hệ ngoài nền tảng.',
    adminNote: 'Đã scan PII, an toàn.', audit: 'AUD-5581 · tạo request · scan nội dung · gửi mentor'
  },
  {
    id: 'REQ-1088', type: 'Yêu cầu giải thích tiến độ', status: 'Đã phản hồi', priority: 'Trung bình',
    creator: 'Nguyễn Minh Anh', relatedOrder: 'PRJ-2841', time: '17:00 · 17 Th.5',
    title: 'Giải thích trạng thái dashboard MQTT', files: 'Không có',
    ai: 'AI tóm tắt: mentor đã giải thích lý do chậm 1 ngày và kế hoạch bù.',
    adminNote: 'Không cần can thiệp.', audit: 'AUD-5529 · phản hồi mentor · đóng request'
  },
  {
    id: 'REQ-1077', type: 'Khiếu nại', status: 'Admin đang xem', priority: 'Khẩn cấp',
    creator: 'Nguyễn Minh Anh', relatedOrder: 'PRJ-2839', time: '12:15 · 16 Th.5',
    title: 'File bàn giao thiếu dữ liệu train', files: 'screenshot.zip',
    ai: 'AI tóm tắt: có rủi ro tranh chấp phạm vi công việc.',
    adminNote: 'Chuyển hàng đợi dispute.', audit: 'AUD-5488 · flag dispute · khóa payout tạm thời'
  },
];

const ROUTE_TITLES = {
  'public/landing': 'Landing Page',
  'public/feed': 'Knowledge Feed',
  'public/article': 'Article Detail',
  'public/workflow': 'Quy trình làm việc',
  'public/pricing': 'Bảng giá dự án',
  'public/login': 'Login',
  'public/register': 'Register',
  'public/forgot': 'Forgot Password',
  'user/dashboard': 'User Dashboard',
  'user/wizard': 'Project Request Wizard',
  'user/orders': 'User Orders',
  'user/order-detail': 'User Order Detail',
  'user/requests': 'Request Center',
  'user/request-new': 'New Structured Request',
  'user/request-detail': 'Request Detail',
  'user/wallet': 'Wallet',
  'user/profile': 'User Profile',
  'user/saved': 'Saved Articles',
  'user/settings': 'Settings',
  'actor/dashboard': 'Actor Dashboard',
  'actor/market': 'Project Marketplace',
  'actor/project-detail': 'Project Request Detail',
  'actor/workspace': 'Actor Workspace',
  'actor/tasks': 'Task Management',
  'actor/inbox': 'Request Inbox',
  'actor/request-detail': 'Request Detail',
  'actor/articles': 'Mentor Knowledge Management',
  'actor/article-edit': 'Mentor Create/Edit Article',
  'actor/income': 'Actor Earnings',
  'actor/profile': 'Actor Profile',
  'actor/settings': 'Actor Settings',
  'actor/verification': 'Actor Verification',
  'admin/dashboard': 'Admin Dashboard',
  'admin/users': 'User Management',
  'admin/user-detail': 'User Detail',
  'admin/actors': 'Actor/Mentor Management',
  'admin/actor-detail': 'Actor Detail',
  'admin/orders': 'Order Management',
  'admin/order-detail': 'Admin Order Detail',
  'admin/requests-mod': 'Request Moderation',
  'admin/request-mod-detail': 'Request Moderation Detail',
  'admin/articles': 'Knowledge Management',
  'admin/article-edit': 'Admin Create/Edit Article',
  'admin/article-mod': 'Article Moderation',
  'admin/article-mod-detail': 'Article Moderation Detail',
  'admin/comments': 'Comment Moderation',
  'admin/transactions': 'Transaction Management',
  'admin/disputes': 'Dispute Management',
  'admin/audit': 'Admin Moderation Logs',
  'admin/ai-logs': 'AI Logs',
  'admin/settings': 'System Settings',
};

function AppStateProvider({ children }) {
  const [orders, setOrders] = React.useState(MOCK.ORDERS);
  const [requests, setRequests] = React.useState(STRUCTURED_REQUESTS);
  const [confirm, setConfirm] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [aiSeed, setAiSeed] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const notify = React.useCallback((message) => {
    setToast(message);
    window.clearTimeout(window.__pmhToast);
    window.__pmhToast = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const runAction = React.useCallback((message, done) => {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      done?.();
      notify(message);
    }, 520);
  }, [notify]);

  const value = {
    orders, setOrders, requests, setRequests,
    confirm, setConfirm, modal, setModal, toast, notify, runAction,
    aiOpen, setAiOpen, aiSeed, setAiSeed, searchOpen, setSearchOpen,
    notificationsOpen, setNotificationsOpen, isLoading,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

function PMHApp() {
  return (
    <NavProvider initial="public/landing">
      <AppStateProvider>
        <RootRouter />
        <FloatingAI />
        <SearchOverlay />
        <NotificationCenter />
        <GlobalModals />
        <Toast />
        <LoadingLayer />
      </AppStateProvider>
    </NavProvider>
  );
}

function ConnectedTopbar({ title, breadcrumb, actions }) {
  const nav = useNav();
  const app = useAppState();
  const rootRoute = nav.route.split('/')[0] + '/dashboard';

  return (
    <header style={{
      height: 56, borderBottom: '1px solid var(--line)', background: 'var(--surface)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <button
          onClick={() => ROUTES[rootRoute] && nav.navigate(rootRoute)}
          className="pmh-mono"
          style={{ fontSize: 11, marginBottom: 1, cursor: 'pointer' }}
        >
          {breadcrumb}
        </button>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.015em' }}>{title}</div>
      </div>
      <button
        onClick={() => app.setSearchOpen(true)}
        style={{
          width: 292, height: 34, borderRadius: 8, border: '1px solid var(--line-2)',
          background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 9,
          padding: '0 10px', color: 'var(--ink-3)', fontSize: 12.5, textAlign: 'left',
        }}
      >
        <Icon name="search" size={14} color="var(--ink-4)" />
        <span style={{ flex: 1 }}>Tìm đơn, request, bài viết...</span>
        <span className="pmh-mono" style={{ fontSize: 10, background: 'var(--surface-2)', padding: '1px 5px', borderRadius: 4 }}>⌘K</span>
      </button>
      {actions}
      <button
        className="pmh-btn pmh-btn--soft pmh-btn--sm"
        onClick={() => {
          app.setAiSeed('');
          app.setAiOpen(true);
        }}
      >
        <Icon name="sparkle" size={13} color="var(--accent)" /> Hỏi AI
      </button>
      <button
        onClick={() => app.setNotificationsOpen(v => !v)}
        style={{ position: 'relative', width: 34, height: 34, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'var(--surface-2)' }}
      >
        <Icon name="bell" size={15} color="var(--ink-2)" />
        <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', border: '1.5px solid var(--surface)' }} />
      </button>
    </header>
  );
}

function Shell({ role, title, breadcrumb, children, actions }) {
  const nav = useNav();
  const items = NAV_BY_ROLE[role] || [];
  const active = ROUTES[nav.route]?.sidebarKey || 'overview';
  const meta = role === 'admin' ? 'ADMIN' : role === 'actor' ? 'MENTOR · VERIFIED' : null;
  const onSelect = (id) => {
    const item = items.find(it => it.id === id);
    if (item?.route) nav.navigate(item.route);
  };

  return (
    <ScreenFrame>
      <Sidebar items={items} active={active} role={role} meta={meta} onSelect={onSelect} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ConnectedTopbar title={title} breadcrumb={breadcrumb} actions={actions} />
        <main className="pmh-app-scroll" style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {children}
        </main>
      </div>
    </ScreenFrame>
  );
}

function PublicChrome({ children }) {
  const nav = useNav();
  return (
    <ScreenFrame plain>
      <div className="pmh-app-scroll" style={{ height: '100%', overflow: 'auto', background: 'var(--bg)' }}>
        <div style={{
          height: 64, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center',
          padding: '0 40px', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <button onClick={() => nav.navigate('public/landing')} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} />
            <span style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: '-0.015em' }}>ProjectMentor Hub</span>
          </button>
          <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 28 }}>
            {[
              ['Tổng quan', 'public/landing'],
              ['Kho kiến thức', 'public/feed'],
              ['Quy trình', 'public/workflow'],
              ['Bảng giá', 'public/pricing'],
            ].map(([label, route]) => (
              <button key={label} onClick={() => nav.navigate(route)} style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{label}</button>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="pmh-btn pmh-btn--ghost pmh-btn--sm" onClick={() => nav.navigate('public/login')}>Đăng nhập</button>
            <button className="pmh-btn pmh-btn--accent pmh-btn--sm" onClick={() => nav.navigate('public/register')}>Bắt đầu miễn phí</button>
          </div>
        </div>
        {children}
      </div>
    </ScreenFrame>
  );
}

function SectionCard({ children, style }) {
  return <div className="pmh-card" style={{ padding: 18, ...style }}>{children}</div>;
}

function MiniStat({ label, value, icon, tone = 'accent', onClick }) {
  const bg = tone === 'ok' ? 'var(--ok-soft)' : tone === 'cyan' ? 'var(--cyan-soft)' : tone === 'warn' ? 'var(--warn-soft)' : 'var(--accent-soft)';
  const color = tone === 'ok' ? 'var(--ok-ink)' : tone === 'cyan' ? 'var(--cyan-ink)' : tone === 'warn' ? 'var(--warn-ink)' : 'var(--accent)';
  return (
    <button onClick={onClick} className="pmh-card" style={{ padding: 16, textAlign: 'left', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div className="pmh-eyebrow" style={{ fontSize: 10.5 }}>{label}</div>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: bg, display: 'grid', placeItems: 'center' }}>
          <Icon name={icon} size={14} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8, letterSpacing: '-0.02em' }}>{value}</div>
    </button>
  );
}

function EmptyState({ title, body, action }) {
  return (
    <SectionCard style={{ padding: 34, textAlign: 'center', background: 'var(--surface)' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
        <Icon name="file" size={20} color="var(--ink-3)" />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: '6px auto 14px', maxWidth: 360, lineHeight: 1.55 }}>{body}</div>
      {action}
    </SectionCard>
  );
}

function ActionMenu({ actions }) {
  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
      {actions.map((a) => (
        <button key={a.label} className={`pmh-btn ${a.primary ? 'pmh-btn--accent' : 'pmh-btn--ghost'} pmh-btn--sm`} onClick={a.onClick}>
          {a.icon && <Icon name={a.icon} size={12} />} {a.label}
        </button>
      ))}
    </div>
  );
}

function RootRouter() {
  const nav = useNav();
  const route = nav.route;

  if (route === 'public/landing') return <LandingPage />;
  if (route === 'public/feed') return <KnowledgePage role="public" />;
  if (route === 'public/article') return <ArticlePage role="public" />;
  if (route === 'public/workflow') return <PublicWorkflowPage />;
  if (route === 'public/pricing') return <PublicPricingPage />;
  if (route === 'public/login') return <AuthPage mode="login" />;
  if (route === 'public/register') return <AuthPage mode="register" />;
  if (route === 'public/forgot') return <AuthPage mode="forgot" />;
  if (route === 'public/auth') return <AuthPage mode="role" />;

  if (route === 'user/dashboard') return <UserDashboard />;
  if (route === 'user/wizard') return <ProjectWizard />;
  if (route === 'user/orders') return <UserOrders />;
  if (route === 'user/order-detail') return <UserOrderDetail />;
  if (route === 'user/requests') return <RequestCenter role="user" />;
  if (route === 'user/request-new') return <StructuredRequestPage role="user" />;
  if (route === 'user/request-detail' || route === 'user/request-thread') return <RequestDetail role="user" />;
  if (route === 'user/wallet') return <WalletPage />;
  if (route === 'user/profile') return <UserProfilePage />;
  if (route === 'user/feed') return <KnowledgePage role="user" />;
  if (route === 'user/article') return <ArticlePage role="user" />;
  if (route === 'user/saved') return <SavedArticlesPage />;
  if (route === 'user/settings') return <SettingsPage role="user" />;

  if (route === 'actor/dashboard') return <ActorDashboard />;
  if (route === 'actor/market') return <ProjectMarketplace />;
  if (route === 'actor/project-detail') return <ProjectRequestDetail />;
  if (route === 'actor/workspace') return <ActorWorkspace />;
  if (route === 'actor/tasks') return <TaskManagement />;
  if (route === 'actor/inbox') return <RequestCenter role="actor" />;
  if (route === 'actor/request-detail' || route === 'actor/request-thread') return <RequestDetail role="actor" />;
  if (route === 'actor/articles') return <MentorKnowledgePage />;
  if (route === 'actor/article-edit') return <ArticleEditorPage scope="mentor" />;
  if (route === 'actor/income') return <ActorEarnings />;
  if (route === 'actor/profile') return <ActorProfilePage />;
  if (route === 'actor/settings') return <SettingsPage role="actor" />;
  if (route === 'actor/verification') return <ActorVerification />;

  if (route === 'admin/dashboard') return <AdminDashboard />;
  if (route === 'admin/users') return <AdminTable type="users" />;
  if (route === 'admin/user-detail') return <AdminEntityDetail type="user" />;
  if (route === 'admin/actors') return <AdminTable type="actors" />;
  if (route === 'admin/actor-detail') return <AdminEntityDetail type="actor" />;
  if (route === 'admin/orders') return <AdminTable type="orders" />;
  if (route === 'admin/order-detail') return <AdminOrderDetail />;
  if (route === 'admin/requests-mod') return <AdminRequestModeration />;
  if (route === 'admin/request-mod-detail') return <AdminRequestModerationDetail />;
  if (route === 'admin/articles') return <AdminKnowledgePage />;
  if (route === 'admin/article-edit') return <ArticleEditorPage scope="admin" />;
  if (route === 'admin/article-mod') return <AdminArticleModeration />;
  if (route === 'admin/article-mod-detail') return <ArticleModerationDetail />;
  if (route === 'admin/comments') return <AdminComments />;
  if (route === 'admin/transactions') return <AdminTransactions />;
  if (route === 'admin/disputes') return <AdminDisputes />;
  if (route === 'admin/audit') return <AdminAuditLogs />;
  if (route === 'admin/ai-logs') return <AdminAILogs />;
  if (route === 'admin/settings') return <SystemSettings />;

  return <LandingPage />;
}

function LandingPage() {
  const nav = useNav();
  return (
    <PublicChrome>
      <section style={{ padding: '72px 40px 44px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 6px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 999, fontSize: 12, color: 'var(--ink-2)' }}>
          <span className="pmh-badge pmh-badge--accent" style={{ height: 18, fontSize: 10 }}>MỚI</span>
          Tổng quan nền tảng đặt hàng, báo giá và theo dõi tiến độ
        </div>
        <h1 style={{ fontSize: 58, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.035em', marginTop: 20, maxWidth: 920 }}>
          Tổng quan nền tảng hỗ trợ đồ án,<br />nghiên cứu và dự án kỹ thuật<br />
          <span style={{ color: 'var(--accent)' }}>cho sinh viên Việt Nam.</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)', marginTop: 22, maxWidth: 650 }}>
          Xem các dự án mẫu, hiểu quy trình đặt hàng, nhận báo giá, chốt giá qua escrow
          và theo dõi tiến độ từng task trong một hệ thống minh bạch có admin bảo vệ.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          <button className="pmh-btn pmh-btn--accent pmh-btn--lg" onClick={() => nav.navigate('public/login')}>Đăng nhập để đặt yêu cầu <Icon name="arrowRight" size={15} /></button>
          <button className="pmh-btn pmh-btn--ghost pmh-btn--lg" onClick={() => nav.navigate('public/feed')}>Khám phá bài viết</button>
          <button className="pmh-btn pmh-btn--ghost pmh-btn--lg" onClick={() => nav.navigate('public/workflow')}><Icon name="play" size={12} /> Xem quy trình</button>
          <button className="pmh-btn pmh-btn--ghost pmh-btn--lg" onClick={() => nav.navigate('public/pricing')}>Xem bảng giá</button>
        </div>

        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 24 }}>
          <SectionCard style={{ padding: 20, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center' }}>
                <Icon name="sparkle" size={15} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Trợ lý AI phân tích yêu cầu</div>
                <div className="pmh-mono" style={{ fontSize: 11 }}>giúp làm rõ phạm vi trước khi báo giá</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                ['Module cần làm', '7 modules'],
                ['Thời gian dự kiến', '6 tuần'],
                ['Độ khó', 'Trung bình'],
              ].map(([l, v]) => (
                <div key={l} style={{ padding: 12, border: '1px dashed var(--line-2)', borderRadius: 10 }}>
                  <div className="pmh-mono" style={{ fontSize: 10 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 12, background: 'var(--surface-2)', borderRadius: 10, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
              Mọi trao đổi dự án đi qua request có cấu trúc. Không chia sẻ số điện thoại, email, Facebook, Zalo hoặc thông tin thanh toán ngoài nền tảng.
            </div>
          </SectionCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['4.900+', 'Đồ án được hỗ trợ', 'trong 2 năm'],
              ['320+', 'Chuyên gia đã xác minh', 'từ 18 trường ĐH'],
              ['4.87★', 'Đánh giá trung bình', 'từ sinh viên'],
            ].map(([v, l, s]) => (
              <SectionCard key={l} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', width: 110 }}>{v}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{l}</div>
                  <div className="pmh-mono" style={{ fontSize: 11 }}>{s}</div>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '46px 40px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 18 }}>
          <div>
            <div className="pmh-eyebrow">Quy trình làm việc</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>Từ xem gói dự án đến bàn giao đều có bước rõ ràng</h2>
          </div>
          <button className="pmh-btn pmh-btn--ghost pmh-btn--sm" onClick={() => nav.navigate('public/workflow')}>Xem chi tiết <Icon name="arrowRight" size={13} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            ['01', 'Xem dự án / gửi yêu cầu', 'Người dùng xem bảng giá hoặc đăng nhập để tạo yêu cầu riêng.'],
            ['02', 'Nhận báo giá', 'Hệ thống phân tích phạm vi, admin kiểm tra và gửi báo giá minh bạch.'],
            ['03', 'Chốt giá qua escrow', 'Người dùng xác nhận phạm vi, thanh toán giữ chỗ trong ví nền tảng.'],
            ['04', 'Theo dõi task', 'Tiến độ, file bàn giao, chỉnh sửa và duyệt task đều ghi log.'],
          ].map(([n, t, d]) => (
            <SectionCard key={n}>
              <div className="pmh-mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{n}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55, marginTop: 6 }}>{d}</div>
            </SectionCard>
          ))}
        </div>
      </section>

      <section style={{ padding: '46px 40px', background: 'var(--surface)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 18 }}>
            <div>
              <div className="pmh-eyebrow">Bảng giá</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>Dự án được đăng bán sẵn</h2>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>Người dùng có thể xem, so sánh và chọn mua. Đăng nhập mới bắt đầu đặt đơn hoặc mua gói.</div>
            </div>
            <button className="pmh-btn pmh-btn--ghost pmh-btn--sm" onClick={() => nav.navigate('public/pricing')}>Xem bảng giá <Icon name="arrowRight" size={13} /></button>
          </div>
          <PublicPackageGrid packages={PUBLIC_PROJECT_PACKAGES.slice(0, 3)} compact />
        </div>
      </section>

      <section style={{ padding: '46px 40px', background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 18 }}>
            <div>
              <div className="pmh-eyebrow">Bài viết nổi bật</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>Kiến thức kỹ thuật đáng đọc tuần này</h2>
            </div>
            <button className="pmh-btn pmh-btn--ghost pmh-btn--sm" onClick={() => nav.navigate('public/feed')}>Xem tất cả <Icon name="arrowRight" size={13} /></button>
          </div>
          <ArticleGrid articles={MOCK.ARTICLES.slice(0, 3)} routePrefix="public" />
        </div>
      </section>
    </PublicChrome>
  );
}

function PublicWorkflowPage() {
  const nav = useNav();
  return (
    <PublicChrome>
      <section style={{ padding: '64px 40px 44px', maxWidth: 1180, margin: '0 auto' }}>
        <div className="pmh-eyebrow">Quy trình làm việc</div>
        <h1 style={{ fontSize: 44, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 10, maxWidth: 820 }}>
          Người dùng đặt hàng, nhận báo giá, chốt giá và theo dõi tiến độ như thế nào?
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 16, maxWidth: 760 }}>
          Đây là quy trình public để người dùng hiểu cách nền tảng vận hành trước khi đăng nhập. Khi đã đăng nhập,
          người dùng sẽ vào dashboard nội bộ để tạo đơn riêng hoặc mua một gói dự án có sẵn.
        </p>
      </section>

      <section style={{ padding: '0 40px 58px', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {[
            ['01', 'Xem bảng giá hoặc đăng nhập để tạo yêu cầu', 'Người dùng có thể xem các dự án/gói được admin hoặc mentor đăng bán. Nếu cần đặt yêu cầu riêng, người dùng đăng nhập rồi mở Project Request Wizard.'],
            ['02', 'Nhập thông tin đồ án', 'Mô tả đề tài, deadline, tài liệu yêu cầu, ngân sách dự kiến và các tiêu chí cần bàn giao. Hệ thống cảnh báo không chia sẻ thông tin liên hệ ngoài nền tảng.'],
            ['03', 'AI phân tích phạm vi', 'AI tóm tắt yêu cầu, đề xuất module, rủi ro, câu hỏi cần bổ sung và ước lượng timeline để báo giá rõ hơn.'],
            ['04', 'Nhận báo giá và chốt phạm vi', 'Admin kiểm tra, mentor/admin gửi báo giá theo phạm vi. Người dùng so sánh, xác nhận hạng mục, deadline, giá và điều kiện bàn giao.'],
            ['05', 'Thanh toán escrow qua ví nền tảng', 'Người dùng nạp ví và thanh toán theo mốc. Tiền được giữ trong hệ thống, không chuyển khoản trực tiếp bên ngoài.'],
            ['06', 'Theo dõi tiến độ từng task', 'Workspace hiển thị task, timeline, file bàn giao, trạng thái duyệt. Tất cả cập nhật và phản hồi đi qua Request Center.'],
            ['07', 'Duyệt, yêu cầu chỉnh sửa hoặc khiếu nại', 'Người dùng duyệt task, từ chối task kèm lý do, yêu cầu chỉnh sửa, yêu cầu hoàn tiền hoặc khiếu nại bằng form có cấu trúc.'],
            ['08', 'Bàn giao, đóng đơn và đánh giá', 'Sau khi hoàn thành, hệ thống ghi audit log, mở mốc thanh toán cuối và cho phép người dùng đánh giá chất lượng.'],
          ].map(([n, t, d]) => (
            <SectionCard key={n} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{n}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 5 }}>{d}</div>
              </div>
            </SectionCard>
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <button className="pmh-btn pmh-btn--accent pmh-btn--lg" onClick={() => nav.navigate('public/login')}>Đăng nhập để đặt đơn</button>
          <button className="pmh-btn pmh-btn--ghost pmh-btn--lg" onClick={() => nav.navigate('public/pricing')}>Xem bảng giá dự án</button>
        </div>
      </section>
    </PublicChrome>
  );
}

function PublicPricingPage() {
  const nav = useNav();
  return (
    <PublicChrome>
      <section style={{ padding: '64px 40px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="pmh-eyebrow">Bảng giá</div>
        <h1 style={{ fontSize: 44, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 10, maxWidth: 820 }}>
          Dự án và gói hỗ trợ được đăng bán sẵn
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 16, maxWidth: 760 }}>
          Các gói dưới đây do admin hoặc mentor đã xác minh đăng lên. Người dùng có thể xem trước phạm vi,
          giá tham khảo, thời gian thực hiện và deliverables. Khi chọn mua, hệ thống yêu cầu đăng nhập để tạo đơn chính thức.
        </p>
      </section>
      <section style={{ padding: '0 40px 60px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['Tất cả', 'IoT / Embedded', 'Web App', 'AI / ML', 'Robotics'].map((f, i) => (
            <button key={f} className={`pmh-chip ${i === 0 ? 'pmh-chip--active' : ''}`}>{f}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button className="pmh-btn pmh-btn--ghost pmh-btn--sm" onClick={() => nav.navigate('public/workflow')}>Xem quy trình mua</button>
        </div>
        <PublicPackageGrid packages={PUBLIC_PROJECT_PACKAGES} />
      </section>
    </PublicChrome>
  );
}

function PublicPackageGrid({ packages, compact = false }) {
  const nav = useNav();
  const app = useAppState();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: 14 }}>
      {packages.map((pkg, i) => (
        <SectionCard key={pkg.id} style={{ display: 'flex', flexDirection: 'column', minHeight: compact ? 260 : 310 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className="pmh-badge">{pkg.id}</span>
                <span className="pmh-badge pmh-badge--accent">{pkg.category}</span>
              </div>
              <div style={{ fontSize: compact ? 15 : 17, fontWeight: 700, lineHeight: 1.32 }}>{pkg.title}</div>
              <div className="pmh-mono" style={{ fontSize: 10.5, marginTop: 5 }}>{pkg.seller}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: compact ? 20 : 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{fmtMoney(pkg.price)}</div>
              <div className="pmh-mono" style={{ fontSize: 10.5 }}>{pkg.time}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 14 }}>
            <div style={{ padding: 10, borderRadius: 10, background: 'var(--surface-2)' }}>
              <div className="pmh-mono" style={{ fontSize: 10 }}>Độ khó</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 3 }}>{pkg.level}</div>
            </div>
            <div style={{ padding: 10, borderRadius: 10, background: 'var(--surface-2)' }}>
              <div className="pmh-mono" style={{ fontSize: 10 }}>Hình thức</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 3 }}>Mua gói / tạo đơn</div>
            </div>
          </div>
          <div style={{ marginTop: 12, flex: 1 }}>
            <div className="pmh-eyebrow" style={{ fontSize: 10.5, marginBottom: 8 }}>Bao gồm</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {pkg.deliverables.map(d => <span key={d} className="pmh-chip" style={{ height: 24, fontSize: 11 }}>{d}</span>)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="pmh-btn pmh-btn--ghost pmh-btn--sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => app.setModal({ type: 'preview', title: pkg.title, body: `${pkg.title}\n\nGiá tham khảo: ${fmtMoney(pkg.price)}\nThời gian: ${pkg.time}\nDeliverables:\n- ${pkg.deliverables.join('\n- ')}` })}>Xem chi tiết</button>
            <button className="pmh-btn pmh-btn--accent pmh-btn--sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => nav.navigate('public/login', { intent: 'buy', packageId: pkg.id })}>Chọn mua</button>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function ArticleGrid({ articles, routePrefix = 'user' }) {
  const nav = useNav();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(articles.length, 3)}, 1fr)`, gap: 14 }}>
      {articles.map((a, i) => (
        <button
          key={a.id}
          onClick={() => nav.navigate(`${routePrefix}/article`, { id: a.id })}
          className="pmh-card"
          style={{ padding: 16, textAlign: 'left', cursor: 'pointer' }}
        >
          <StripedImg label={a.category} style={{ height: 92, marginBottom: 12 }} hue={220 + i * 36} />
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <span className="pmh-badge">{a.category}</span>
            {a.tag && <span className="pmh-badge pmh-badge--accent">{a.tag === 'featured' ? 'Nổi bật' : 'Trending'}</span>}
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.35, marginBottom: 6 }}>{a.title}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5, minHeight: 54 }}>{a.excerpt}</div>
          <div className="pmh-mono" style={{ fontSize: 10.5, marginTop: 12 }}>{a.read} · {a.likes} lượt thích · {a.comments} bình luận</div>
        </button>
      ))}
    </div>
  );
}

function KnowledgePage({ role }) {
  const [filter, setFilter] = React.useState('Tất cả');
  const [sort, setSort] = React.useState('Mới nhất');
  const content = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, maxWidth: 1180, margin: role === 'public' ? '28px auto 60px' : 0, padding: role === 'public' ? '0 28px' : 0 }}>
      <div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {['Tất cả', 'Embedded', 'AI/ML', 'Cơ điện tử', 'IoT', 'Web App', 'Kinh nghiệm', 'Học thuật'].map(c => (
            <button key={c} className={`pmh-chip ${filter === c ? 'pmh-chip--active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
          {['Mới nhất', 'Được yêu thích', 'Xu hướng'].map(s => (
            <button key={s} className={`pmh-tab ${sort === s ? 'pmh-tab--active' : ''}`} onClick={() => setSort(s)}>{s}</button>
          ))}
          <div style={{ flex: 1 }} />
          <span className="pmh-mono" style={{ alignSelf: 'center' }}>{filter} · {sort}</span>
        </div>
        <ArticleGrid articles={MOCK.ARTICLES} routePrefix={role === 'public' ? 'public' : 'user'} />
      </div>
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SectionCard>
          <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Chủ đề hot</div>
          {['#stm32', '#freertos', '#cnn', '#yolov8', '#esp32', '#nextjs'].map((t, i) => (
            <button key={t} onClick={() => setFilter(t.replace('#', '').toUpperCase())} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 0', borderTop: i ? '1px solid var(--line)' : '', textAlign: 'left' }}>
              <span className="pmh-mono" style={{ fontSize: 12, color: 'var(--accent)' }}>{t}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{42 + i * 9} bài</span>
            </button>
          ))}
        </SectionCard>
        <SectionCard style={{ background: 'var(--ink)', color: '#fff', borderColor: 'transparent' }}>
          <Icon name="sparkle" size={18} color="oklch(0.85 0.1 270)" />
          <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 8 }}>AI chọn bài phù hợp</div>
          <div style={{ fontSize: 12, opacity: 0.76, lineHeight: 1.55, marginTop: 4 }}>Dựa trên lĩnh vực đồ án, AI đề xuất thứ tự đọc và tóm tắt nhanh.</div>
          <button className="pmh-btn pmh-btn--accent pmh-btn--sm" style={{ marginTop: 12 }}>Cá nhân hóa feed</button>
        </SectionCard>
      </aside>
    </div>
  );

  if (role === 'public') return <PublicChrome>{content}</PublicChrome>;
  return <Shell role="user" breadcrumb="Học tập / Kho kiến thức" title="Kho kiến thức kỹ thuật">{content}</Shell>;
}

function ArticlePage({ role }) {
  const nav = useNav();
  const app = useAppState();
  const article = MOCK.ARTICLES.find(a => a.id === nav.params.id) || MOCK.ARTICLES[1];
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const leaks = detectLeaks(comment);

  const content = (
    <div style={{ maxWidth: 1100, margin: role === 'public' ? '28px auto 60px' : '0 auto', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 28, padding: role === 'public' ? '0 28px' : 0 }}>
      <article>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <span className="pmh-badge pmh-badge--accent">{article.category}</span>
          <span className="pmh-badge">{article.read}</span>
          <span className="pmh-badge pmh-badge--ok">Đã xuất bản</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 16 }}>{article.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Avatar initials={article.author.split(' ').slice(-2).map(w => w[0]).join('')} size={40} hue={220} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{article.author}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{article.role} · {article.date} 2026</div>
          </div>
          <ActionMenu actions={[
            { label: `${liked ? article.likes + 1 : article.likes}`, icon: 'heart', onClick: () => setLiked(v => !v) },
            { label: bookmarked ? 'Đã lưu' : 'Lưu', icon: 'bookmark', onClick: () => setBookmarked(v => !v) },
            { label: 'Báo cáo', icon: 'alert', onClick: () => app.notify('Đã gửi báo cáo bài viết cho admin moderation.') },
          ]} />
        </div>
        <SectionCard style={{ marginBottom: 20, display: 'flex', gap: 12, background: 'linear-gradient(to right, var(--accent-soft), var(--surface))', borderColor: 'transparent' }}>
          <Icon name="sparkle" size={18} color="var(--accent)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>AI summary</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>Bài viết đưa ra lộ trình thực hành theo tuần, danh sách module nên làm, rủi ro thường gặp và cách trình bày báo cáo để bảo vệ.</div>
          </div>
          <button className="pmh-btn pmh-btn--accent pmh-btn--sm" onClick={() => { app.setAiSeed('Tóm tắt bài viết này thành 5 ý chính'); app.setAiOpen(true); }}>Tóm tắt sâu</button>
        </SectionCard>
        <StripedImg label="cover.jpg · 1920x820" style={{ height: 280, marginBottom: 22 }} hue={220} />
        <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-2)' }}>
          <p style={{ marginBottom: 16 }}>{article.excerpt}</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginTop: 28, marginBottom: 12 }}>Giai đoạn 1 · Nền tảng</h2>
          <p style={{ marginBottom: 16 }}>Sinh viên nên bắt đầu bằng việc xác định mục tiêu học tập, phần cứng có sẵn, tài liệu yêu cầu từ giảng viên và tiêu chí đánh giá. Mentor chỉ hỗ trợ định hướng, giải thích và kiểm tra tiến độ.</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginTop: 28, marginBottom: 12 }}>Giai đoạn 2 · Prototype</h2>
          <p>Chia dự án thành task nhỏ, mỗi task có deliverable rõ ràng, file bàn giao và tiêu chí duyệt. Điều này giúp tránh hiểu sai phạm vi và giữ mọi trao đổi minh bạch trên hệ thống.</p>
        </div>
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Bình luận · {article.comments}</div>
          <div style={{ fontSize: 12, color: 'var(--warn-ink)', marginBottom: 12 }}>Không chèn số điện thoại, email, link mạng xã hội hoặc thông tin giao dịch ngoài nền tảng.</div>
          <textarea className="pmh-textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Thảo luận về nội dung kỹ thuật..." />
          {leaks.length > 0 && <div style={{ marginTop: 8, color: 'var(--danger-ink)', fontSize: 12, fontWeight: 700 }}>Nội dung có thể chứa thông tin liên hệ ngoài nền tảng. Vui lòng chỉnh sửa trước khi gửi.</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button className="pmh-btn pmh-btn--ghost pmh-btn--sm" onClick={() => setComment('')}>Hủy</button>
            <button className="pmh-btn pmh-btn--accent pmh-btn--sm" disabled={leaks.length > 0} onClick={() => app.notify('Bình luận đã được gửi vào hàng kiểm duyệt.')}>Đăng bình luận</button>
          </div>
        </div>
      </article>
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SectionCard style={{ position: 'sticky', top: 16 }}>
          <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Mục lục</div>
          {['Nền tảng', 'Prototype', 'Kiểm thử', 'Báo cáo', 'Tài nguyên'].map((m, i) => (
            <button key={m} onClick={() => app.notify(`Đã cuộn đến mục ${m}.`)} style={{ display: 'block', width: '100%', textAlign: 'left', fontSize: 12.5, padding: '6px 0', color: i === 0 ? 'var(--accent)' : 'var(--ink-2)' }}>{m}</button>
          ))}
        </SectionCard>
        <SectionCard>
          <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Bài viết liên quan</div>
          {MOCK.ARTICLES.slice(0, 3).map((a, i) => (
            <button key={a.id} onClick={() => nav.navigate(`${role === 'public' ? 'public' : 'user'}/article`, { id: a.id })} style={{ textAlign: 'left', padding: i ? '12px 0 0' : 0, marginTop: i ? 12 : 0, borderTop: i ? '1px solid var(--line)' : '', width: '100%' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.35 }}>{a.title}</div>
              <div className="pmh-mono" style={{ fontSize: 10.5, marginTop: 4 }}>{a.read} · {a.likes} lượt thích</div>
            </button>
          ))}
        </SectionCard>
      </aside>
    </div>
  );

  if (role === 'public') return <PublicChrome>{content}</PublicChrome>;
  return <Shell role="user" breadcrumb="Học tập / Chi tiết bài viết" title={article.title}>{content}</Shell>;
}

function AuthPage({ mode }) {
  const nav = useNav();
  const [role, setRole] = React.useState('user');
  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot';
  const submit = () => {
    if (isForgot) return nav.navigate('public/login');
    if (role === 'admin') nav.navigate('admin/dashboard');
    else if (role === 'actor') nav.navigate(isRegister ? 'actor/verification' : 'actor/dashboard');
    else nav.navigate('user/dashboard');
  };

  return (
    <ScreenFrame plain>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
        <div style={{ padding: '48px 56px', background: 'linear-gradient(160deg, oklch(0.22 0.04 260), oklch(0.15 0.03 260))', color: '#fff', display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => nav.navigate('public/landing')} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 80, color: '#fff' }}>
            <Logo size={30} />
            <div style={{ fontWeight: 700, fontSize: 16 }}>ProjectMentor Hub</div>
          </button>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, maxWidth: 410 }}>
            Học cùng mentor,<br />không phải học hộ mentor.
          </div>
          <div style={{ fontSize: 14, opacity: 0.72, marginTop: 16, maxWidth: 430, lineHeight: 1.6 }}>
            Mọi giao tiếp dự án được cấu trúc, kiểm duyệt và ghi log để bảo vệ sinh viên, mentor và nền tảng.
          </div>
          <div style={{ flex: 1 }} />
          <SectionCard style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>“Quy trình request rõ ràng giúp mình theo dõi task, duyệt file và hỏi mentor đúng trọng tâm.”</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12 }}>
              <Avatar initials="HT" size={30} hue={260} />
              <div style={{ fontSize: 12 }}><b>Hoàng Thư</b><div style={{ opacity: 0.65 }}>K63 · ĐH SPKT</div></div>
            </div>
          </SectionCard>
        </div>
        <div style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: 12.5, color: 'var(--ink-3)' }}>
            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            <button onClick={() => nav.navigate(isRegister ? 'public/login' : 'public/register')} style={{ color: 'var(--accent)', fontWeight: 600, marginLeft: 6 }}>
              {isRegister ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 420, margin: '0 auto', width: '100%' }}>
            <div className="pmh-eyebrow">{isForgot ? 'Khôi phục mật khẩu' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 6, marginBottom: 8 }}>
              {isForgot ? 'Lấy lại quyền truy cập' : isRegister ? 'Bắt đầu với ProjectMentor' : 'Chào mừng quay lại'}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 22 }}>
              {isForgot ? 'Nhập email để nhận liên kết đặt lại mật khẩu.' : 'Chọn vai trò để mô phỏng luồng đăng nhập thành công.'}
            </div>
            {!isForgot && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                {[
                  ['user', 'Sinh viên', 'academic'],
                  ['actor', 'Mentor', 'briefcase'],
                  ['admin', 'Admin', 'shield'],
                ].map(([id, label, icon]) => (
                  <button key={id} className={`pmh-chip ${role === id ? 'pmh-chip--active' : ''}`} onClick={() => setRole(id)} style={{ justifyContent: 'center' }}>
                    <Icon name={icon} size={12} /> {label}
                  </button>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="pmh-input" placeholder="Email học tập" />
              {!isForgot && <input className="pmh-input" type="password" placeholder="Mật khẩu" />}
              {isRegister && <input className="pmh-input" placeholder={role === 'actor' ? 'Chuyên môn mentor' : 'Trường / khoa'} />}
            </div>
            <button className="pmh-btn pmh-btn--accent pmh-btn--lg" style={{ marginTop: 18, width: '100%', justifyContent: 'center' }} onClick={submit}>
              {isForgot ? 'Gửi liên kết khôi phục' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
            </button>
            {!isForgot && <button onClick={() => nav.navigate('public/forgot')} style={{ marginTop: 12, color: 'var(--accent)', fontSize: 12.5, fontWeight: 600 }}>Quên mật khẩu?</button>}
          </div>
        </div>
      </div>
    </ScreenFrame>
  );
}

function UserDashboard() {
  const nav = useNav();
  const app = useAppState();
  return (
    <Shell
      role="user"
      breadcrumb="Chính / Tổng quan"
      title="Chào buổi sáng, Minh Anh"
      actions={<button className="pmh-btn pmh-btn--accent pmh-btn--sm" onClick={() => nav.navigate('user/wizard')}><Icon name="plus" size={13} /> Tạo yêu cầu mới</button>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        <MiniStat label="Đơn đang làm" value="2" icon="folder" onClick={() => nav.navigate('user/orders')} />
        <MiniStat label="Chờ báo giá" value="1" icon="clock" tone="cyan" onClick={() => nav.navigate('user/orders', { filter: 'waiting' })} />
        <MiniStat label="Số dư ví" value="1.2M" icon="wallet" tone="ok" onClick={() => nav.navigate('user/wallet')} />
        <MiniStat label="Request mở" value={app.requests.filter(r => !r.status.includes('Đã')).length} icon="send" tone="warn" onClick={() => nav.navigate('user/requests')} />
        <MiniStat label="Bài đã lưu" value="34" icon="bookmark" onClick={() => nav.navigate('user/saved')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SectionCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Đơn đang hoạt động</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Theo dõi tiến độ real-time</div>
              </div>
              <button onClick={() => nav.navigate('user/orders')} style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600 }}>Xem tất cả →</button>
            </div>
            {app.orders.filter(o => o.status !== 'done').slice(0, 4).map((o, i) => (
              <OrderRow key={o.id} order={o} border={i > 0} onClick={() => nav.navigate('user/order-detail', { id: o.id })} />
            ))}
          </SectionCard>
          <SectionCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Bài viết đề xuất</div>
              <button onClick={() => nav.navigate('user/feed')} style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600 }}>Kho kiến thức →</button>
            </div>
            <ArticleGrid articles={MOCK.ARTICLES.slice(1, 4)} routePrefix="user" />
          </SectionCard>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionCard style={{ background: 'linear-gradient(135deg, oklch(0.3 0.08 270), oklch(0.22 0.04 260))', color: '#fff', borderColor: 'transparent' }}>
            <Icon name="sparkle" size={16} color="oklch(0.85 0.1 270)" />
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>Bạn cần hỗ trợ gì?</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6, lineHeight: 1.55 }}>AI có thể tóm tắt tiến độ, gợi ý đề tài hoặc giúp viết request rõ ràng hơn.</div>
            {['Tóm tắt tiến độ PRJ-2841', 'Gợi ý đề tài đồ án', 'Viết yêu cầu chỉnh sửa rõ ràng hơn'].map(p => (
              <button key={p} onClick={() => { app.setAiSeed(p); app.setAiOpen(true); }} style={{ marginTop: 8, width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.09)', color: '#fff', textAlign: 'left', fontSize: 12 }}>→ {p}</button>
            ))}
          </SectionCard>
          <SectionCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Request gần đây</div>
              <span className="pmh-badge pmh-badge--accent">Có kiểm duyệt</span>
            </div>
            {app.requests.slice(0, 3).map((r, i) => (
              <button key={r.id} onClick={() => nav.navigate('user/request-detail', { id: r.id })} style={{ width: '100%', textAlign: 'left', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : '' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{r.title}</div>
                <div className="pmh-mono" style={{ fontSize: 10.5 }}>{r.id} · {r.status}</div>
              </button>
            ))}
          </SectionCard>
        </div>
      </div>
    </Shell>
  );
}

function OrderRow({ order, border, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', padding: '14px 0', borderTop: border ? '1px solid var(--line)' : '', display: 'grid', gridTemplateColumns: '1fr 210px 110px', gap: 16, alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
          <span className="pmh-mono" style={{ fontSize: 10.5 }}>{order.id}</span>
          <StatusBadge status={order.status} label={order.statusLabel} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{order.title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3 }}>{order.category} · Deadline {order.deadline} · Cập nhật {order.updated || 'vừa xong'}</div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>
          <span>Tiến độ</span><b>{order.progress}%</b>
        </div>
        <div className="pmh-progress"><span style={{ width: order.progress + '%' }} /></div>
      </div>
      <span className="pmh-btn pmh-btn--ghost pmh-btn--sm" style={{ justifySelf: 'end' }}>Xem tiến độ</span>
    </button>
  );
}

function ProjectWizard() {
  const nav = useNav();
  const app = useAppState();
  const [step, setStep] = React.useState(1);
  const [kind, setKind] = React.useState('Hỗ trợ đồ án IoT / Embedded');
  const [title, setTitle] = React.useState('Hệ thống giám sát nhà kính IoT với STM32');
  const [deadline, setDeadline] = React.useState('28/05/2026');
  const steps = ['Chọn loại hỗ trợ', 'Nhập thông tin đồ án', 'AI phân tích yêu cầu', 'Xác nhận gửi yêu cầu báo giá'];

  const submit = () => {
    const newOrder = {
      id: 'PRJ-2850', title, category: 'IoT', status: 'waiting', statusLabel: 'Chờ báo giá',
      progress: 0, deadline: '28 Th.5 2026', actor: null, budget: 0, paid: 0, updated: 'vừa xong',
    };
    app.setOrders(list => [newOrder, ...list.filter(o => o.id !== newOrder.id)]);
    app.notify('Đã gửi yêu cầu báo giá. Admin và mentor phù hợp sẽ xem yêu cầu.');
    nav.navigate('user/order-detail', { id: newOrder.id, status: 'waiting' });
  };

  return (
    <Shell role="user" breadcrumb="Đơn của tôi / Yêu cầu mới" title="Tạo yêu cầu hỗ trợ đồ án">
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
          {steps.map((s, i) => {
            const active = step === i + 1;
            const done = step > i + 1;
            return (
              <button key={s} onClick={() => setStep(i + 1)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center',
                  background: active ? 'var(--accent)' : done ? 'var(--ink)' : 'var(--surface)',
                  color: active || done ? '#fff' : 'var(--ink-3)', border: `1px solid ${active ? 'var(--accent)' : done ? 'var(--ink)' : 'var(--line-2)'}`,
                  fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)',
                }}>{done ? <Icon name="check" size={14} /> : i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{s}</div>
                  <div className="pmh-mono" style={{ fontSize: 10 }}>Bước {i + 1}</div>
                </div>
                {i < steps.length - 1 && <div style={{ width: 24, height: 1, background: done ? 'var(--ink)' : 'var(--line-2)' }} />}
              </button>
            );
          })}
        </div>

        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {['Hỗ trợ đồ án IoT / Embedded', 'Web App / Dashboard', 'AI / Data / Computer Vision'].map((t, i) => (
              <button key={t} onClick={() => setKind(t)} className="pmh-card" style={{ padding: 20, textAlign: 'left', borderColor: kind === t ? 'var(--accent)' : 'var(--line)' }}>
                <Icon name={['cpu', 'globe', 'sparkle'][i]} size={20} color="var(--accent)" />
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 12 }}>{t}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55, marginTop: 6 }}>Chọn phạm vi để AI gợi ý câu hỏi, module và mentor phù hợp.</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <SectionCard>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14 }}>
              <div>
                <div className="pmh-mono" style={{ fontSize: 10.5, marginBottom: 4 }}>TÊN ĐỀ TÀI</div>
                <input className="pmh-input" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <div className="pmh-mono" style={{ fontSize: 10.5, marginBottom: 4 }}>DEADLINE</div>
                <input className="pmh-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
              <textarea className="pmh-textarea" rows={7} placeholder="Mục tiêu, module cần hỗ trợ, tiêu chí bảo vệ..." defaultValue="Cần mentor hướng dẫn thiết kế firmware STM32, ESP32 gateway, MQTT dashboard và báo cáo bảo vệ. Em muốn học cách tự triển khai từng module." />
              <div>
                <ContactWarning compact />
                <div style={{ marginTop: 12, padding: 12, border: '1px dashed var(--line-2)', borderRadius: 10, fontSize: 12.5, color: 'var(--ink-2)' }}>
                  Đính kèm đề cương, rubric, ảnh mạch hoặc file mô tả. Hệ thống sẽ scan virus và kiểm tra thông tin liên hệ ngoài nền tảng.
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            <SectionCard>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center' }}><Icon name="sparkle" size={17} color="var(--accent)" /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700 }}>AI phân tích yêu cầu của bạn</div><div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Tin cậy 92% · đề xuất cho mentor Embedded</div></div>
                <button className="pmh-btn pmh-btn--soft pmh-btn--sm" onClick={() => app.notify('AI đã phân tích lại yêu cầu.')}>Phân tích lại</button>
              </div>
              <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 10, marginBottom: 18, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
                <b>Tóm tắt:</b> {title}. Phạm vi gồm phần cứng, firmware, gateway MQTT, dashboard, cảnh báo Telegram và báo cáo bảo vệ.
              </div>
              <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Module đề xuất · 07</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {['Sơ đồ khối hệ thống', 'Thiết kế PCB mở rộng', 'Firmware STM32 HAL', 'Gateway ESP32 + MQTT', 'Dashboard Node-RED', 'Telegram Bot cảnh báo', 'Báo cáo & slide'].map((m, i) => (
                  <div key={m} style={{ display: 'flex', gap: 10, padding: 10, border: '1px solid var(--line)', borderRadius: 10, alignItems: 'center' }}>
                    <Icon name={['layers', 'cpu', 'code', 'globe', 'chart', 'bell', 'file'][i]} size={15} color="var(--accent)" />
                    <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{m}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard>
              <div className="pmh-eyebrow" style={{ marginBottom: 8 }}>Ước lượng</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>~ 24 ngày</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 12 }}>cho 7 module</div>
              {[
                ['Độ khó', 'Trung bình'],
                ['Ngân sách gợi ý', '4.0 - 4.8 triệu'],
                ['Câu hỏi bổ sung', '4 câu'],
                ['Rủi ro', 'Mất kết nối MQTT'],
              ].map(([l, v]) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--line)', fontSize: 12.5 }}><span style={{ color: 'var(--ink-3)' }}>{l}</span><b>{v}</b></div>)}
            </SectionCard>
          </div>
        )}

        {step === 4 && (
          <SectionCard>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Xác nhận gửi yêu cầu báo giá</div>
            <ContactWarning />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 16 }}>
              {[
                ['Loại hỗ trợ', kind],
                ['Đề tài', title],
                ['Deadline', deadline],
                ['Trạng thái sau khi gửi', 'Chờ báo giá'],
              ].map(([l, v]) => (
                <div key={l} style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 10 }}>
                  <div className="pmh-mono" style={{ fontSize: 10.5 }}>{l}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button className="pmh-btn pmh-btn--ghost" onClick={() => step === 1 ? nav.navigate('user/dashboard') : setStep(step - 1)}><Icon name="chevronLeft" size={14} /> Quay lại</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="pmh-btn pmh-btn--soft" onClick={() => app.notify('Đã lưu nháp yêu cầu.')}>Lưu nháp</button>
            <button className="pmh-btn pmh-btn--accent" onClick={() => step === 4 ? submit() : setStep(step + 1)}>
              {step === 4 ? 'Gửi yêu cầu báo giá' : 'Tiếp tục'} <Icon name="arrowRight" size={14} />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function UserOrders() {
  const nav = useNav();
  const app = useAppState();
  const [filter, setFilter] = React.useState('all');
  const list = filter === 'all' ? app.orders : app.orders.filter(o => o.status === filter);
  return (
    <Shell role="user" breadcrumb="Đơn của tôi / Danh sách" title="Đơn của tôi" actions={<button className="pmh-btn pmh-btn--accent pmh-btn--sm" onClick={() => nav.navigate('user/wizard')}><Icon name="plus" size={13} /> Tạo yêu cầu mới</button>}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[
          ['all', 'Tất cả'],
          ['waiting', 'Chờ báo giá'],
          ['in-progress', 'Đang làm'],
          ['review', 'Chờ duyệt'],
          ['done', 'Hoàn thành'],
        ].map(([id, label]) => <button key={id} className={`pmh-chip ${filter === id ? 'pmh-chip--active' : ''}`} onClick={() => setFilter(id)}>{label}</button>)}
      </div>
      <SectionCard>{list.length ? list.map((o, i) => <OrderRow key={o.id} order={o} border={i > 0} onClick={() => nav.navigate('user/order-detail', { id: o.id })} />) : <EmptyState title="Không có đơn phù hợp" body="Thay đổi bộ lọc hoặc tạo yêu cầu mới để nhận báo giá từ mentor." action={<button className="pmh-btn pmh-btn--accent pmh-btn--sm" onClick={() => nav.navigate('user/wizard')}>Tạo yêu cầu mới</button>} />}</SectionCard>
    </Shell>
  );
}

function UserOrderDetail() {
  const nav = useNav();
  const app = useAppState();
  const order = app.orders.find(o => o.id === nav.params.id) || app.orders[0];
  const [tab, setTab] = React.useState('tasks');
  const statusLabel = nav.params.status === 'waiting' ? 'Chờ báo giá' : order.statusLabel;
  const actions = [
    { label: 'Yêu cầu chỉnh sửa', icon: 'edit', onClick: () => nav.navigate('user/request-new', { type: 'Yêu cầu chỉnh sửa', orderId: order.id }) },
    { label: 'Yêu cầu bổ sung chức năng', icon: 'plus', onClick: () => nav.navigate('user/request-new', { type: 'Yêu cầu bổ sung chức năng', orderId: order.id }) },
    { label: 'Quay lại', icon: 'chevronLeft', onClick: () => nav.navigate('user/orders') },
  ];
  return (
    <Shell role="user" breadcrumb={`Đơn của tôi / ${order.id}`} title={order.title} actions={<ActionMenu actions={actions} />}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          <SectionCard style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="pmh-mono">{order.id}</span><StatusBadge status={nav.params.status === 'waiting' ? 'waiting' : order.status} label={statusLabel} /></div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>Mọi trao đổi dự án nằm trong Request Center, được admin kiểm duyệt và ghi audit log.</div>
              </div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 26, fontWeight: 700 }}>{order.progress}%</div><div className="pmh-mono">tiến độ</div></div>
            </div>
            <div className="pmh-progress"><span style={{ width: order.progress + '%' }} /></div>
          </SectionCard>
          <div style={{ display: 'flex', gap: 18, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
            {[
              ['tasks', 'Task', 7],
              ['timeline', 'Timeline'],
              ['requests', 'Request Center', app.requests.length],
              ['files', 'Files', 8],
              ['payment', 'Thanh toán'],
            ].map(([id, label, count]) => (
              <button key={id} className={`pmh-tab ${tab === id ? 'pmh-tab--active' : ''}`} onClick={() => setTab(id)}>{label}{count ? <span className="pmh-badge" style={{ marginLeft: 6 }}>{count}</span> : null}</button>
            ))}
          </div>
          {tab === 'tasks' && <TaskListForUser />}
          {tab === 'timeline' && <TimelinePanel />}
          {tab === 'requests' && <RequestThread role="user" orderId={order.id} />}
          {tab === 'files' && <FilesPanel />}
          {tab === 'payment' && <PaymentPanel order={order} />}
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionCard>
            <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Mentor phụ trách</div>
            {order.actor ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={order.actor.avatar} size={42} hue={220} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 700 }}>{order.actor.name}</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{order.actor.role} · ★ {order.actor.rating}</div></div>
                </div>
                <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: 'var(--warn-soft)', color: 'var(--warn-ink)', fontSize: 11.5, lineHeight: 1.5 }}>
                  Thông tin email, số điện thoại, mạng xã hội và thanh toán của mentor đã được ẩn. Chỉ dùng request có cấu trúc.
                </div>
              </>
            ) : (
              <EmptyState title="Chưa gán mentor" body="Yêu cầu đang chờ báo giá. Bạn sẽ nhận thông báo khi có đề xuất phù hợp." />
            )}
          </SectionCard>
          <SectionCard style={{ background: 'var(--ink)', color: '#fff', borderColor: 'transparent' }}>
            <Icon name="sparkle" size={14} color="oklch(0.85 0.1 270)" />
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>AI trợ lý dự án</div>
            <div style={{ fontSize: 12, lineHeight: 1.55, opacity: 0.85, marginTop: 6 }}>T-05 đang chờ duyệt. AI có thể tóm tắt tiến độ hoặc giúp viết request từ chối task.</div>
            <button className="pmh-btn pmh-btn--accent pmh-btn--sm" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={() => { app.setAiSeed('Tóm tắt tiến độ đơn hàng'); app.setAiOpen(true); }}>Tóm tắt tiến độ</button>
          </SectionCard>
        </aside>
      </div>
    </Shell>
  );
}

function TaskListForUser() {
  const nav = useNav();
  const app = useAppState();
  return (
    <SectionCard>
      {MOCK.TASKS.map((t, i) => (
        <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 220px', gap: 14, alignItems: 'center', padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '' }}>
          <div><div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div><div className="pmh-mono" style={{ fontSize: 10.5 }}>{t.id} · deadline {t.deadline}</div></div>
          <div className="pmh-progress"><span style={{ width: t.progress + '%' }} /></div>
          <StatusBadge status={t.status} />
          <ActionMenu actions={[
            { label: 'Duyệt task', icon: 'check', primary: t.status === 'review', onClick: () => app.setConfirm({ title: 'Duyệt task?', body: `Xác nhận task "${t.title}" đạt yêu cầu. Hệ thống sẽ ghi audit log và mở mốc thanh toán tiếp theo.`, confirmText: 'Duyệt task', onConfirm: () => app.notify('Task đã được duyệt và ghi log.') }) },
            { label: 'Từ chối task', icon: 'close', onClick: () => nav.navigate('user/request-new', { type: 'Từ chối task và nêu lý do', task: t.id }) },
          ]} />
        </div>
      ))}
    </SectionCard>
  );
}

function TimelinePanel() {
  return <SectionCard>{['Khởi tạo yêu cầu', 'Mentor nhận dự án', 'Hoàn tất phần cứng', 'Firmware đang review', 'Bàn giao cuối'].map((t, i) => <div key={t} style={{ display: 'flex', gap: 10, padding: '10px 0', borderTop: i ? '1px solid var(--line)' : '' }}><StatusBadge status={i < 3 ? 'done' : i === 3 ? 'review' : 'todo'} /><div><b style={{ fontSize: 13 }}>{t}</b><div className="pmh-mono">AUD-{5520 + i} · {i < 3 ? 'đã đóng' : 'đang mở'}</div></div></div>)}</SectionCard>;
}

function FilesPanel() {
  return <SectionCard>{['firmware-stm32.zip', 'dashboard-mqtt.mp4', 'bom-list.xlsx', 'report-draft.docx'].map((f, i) => <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i ? '1px solid var(--line)' : '' }}><Icon name="file" size={15} color="var(--accent)" /><span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{f}</span><span className="pmh-badge pmh-badge--ok">Đã scan</span><button className="pmh-btn pmh-btn--ghost pmh-btn--sm">Tải</button></div>)}</SectionCard>;
}

function PaymentPanel({ order }) {
  return <SectionCard>{[
    ['Đặt cọc 30%', 1260000, 'Đã thanh toán'],
    ['Mốc 1 · Phần cứng', 840000, 'Đã thanh toán'],
    ['Mốc 2 · Firmware', 1260000, 'Đang chờ duyệt'],
    ['Bàn giao cuối', 840000, 'Chờ hoàn thành'],
  ].map(([l, v, s], i) => <div key={l} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : '', alignItems: 'center' }}><b style={{ fontSize: 13 }}>{l}</b><span>{fmtMoney(v)}</span><StatusBadge status={s.includes('Đã') ? 'done' : 'review'} label={s} /></div>)}</SectionCard>;
}

function RequestCenter({ role }) {
  const nav = useNav();
  const app = useAppState();
  const title = role === 'actor' ? 'Hộp thư yêu cầu' : 'Request Center';
  const shellRole = role === 'actor' ? 'actor' : 'user';
  return (
    <Shell role={shellRole} breadcrumb={`${role === 'actor' ? 'Công việc' : 'Đơn của tôi'} / Request Center`} title={title} actions={<button className="pmh-btn pmh-btn--accent pmh-btn--sm" onClick={() => nav.navigate(role === 'actor' ? 'actor/request-detail' : 'user/request-new')}><Icon name="plus" size={13} /> {role === 'actor' ? 'Phản hồi request' : 'Tạo request'}</button>}>
      <ContactWarning />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '16px 0' }}>
        <MiniStat label="Đang mở" value={app.requests.filter(r => !r.status.includes('Đã')).length} icon="send" />
        <MiniStat label="Bị flag" value="1" icon="alert" tone="warn" />
        <MiniStat label="Đã xử lý" value="24" icon="check" tone="ok" />
      </div>
      <SectionCard>
        {app.requests.map((r, i) => (
          <button key={r.id} onClick={() => nav.navigate(role === 'actor' ? 'actor/request-detail' : 'user/request-detail', { id: r.id })} style={{ width: '100%', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 130px 120px 120px', gap: 14, padding: '14px 0', borderTop: i ? '1px solid var(--line)' : '', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.title}</div>
              <div className="pmh-mono" style={{ fontSize: 10.5 }}>{r.id} · {r.type} · {r.relatedOrder}</div>
            </div>
            <StatusBadge status={r.status.includes('Đã') ? 'done' : r.status.includes('Admin') ? 'review' : 'waiting'} label={r.status} />
            <span className={`pmh-badge ${r.priority === 'Khẩn cấp' ? 'pmh-badge--danger' : r.priority === 'Cao' ? 'pmh-badge--warn' : ''}`}>{r.priority}</span>
            <span className="pmh-mono">{r.time.split('·')[0]}</span>
          </button>
        ))}
      </SectionCard>
    </Shell>
  );
}

function StructuredRequestPage({ role }) {
  const nav = useNav();
  const app = useAppState();
  const [type, setType] = React.useState(nav.params.type || 'Yêu cầu chỉnh sửa');
  const [title, setTitle] = React.useState('');
  const [detail, setDetail] = React.useState('');
  const [priority, setPriority] = React.useState('Trung bình');
  const leaks = detectLeaks(`${title} ${detail}`);
  const orderId = nav.params.orderId || 'PRJ-2841';
  const types = ['Yêu cầu chỉnh sửa', 'Yêu cầu bổ sung chức năng', 'Yêu cầu giải thích tiến độ', 'Yêu cầu cập nhật file', 'Yêu cầu kiểm tra lỗi', 'Yêu cầu gia hạn deadline', 'Yêu cầu hoàn tiền', 'Khiếu nại', 'Duyệt task', 'Từ chối task và nêu lý do'];
  const submit = () => {
    const req = {
      id: `REQ-${1100 + app.requests.length}`, type, status: 'Chờ mentor phản hồi', priority,
      creator: role === 'actor' ? 'Trần Minh Khoa' : 'Nguyễn Minh Anh', relatedOrder: orderId,
      time: 'Vừa xong', title: title || type, files: '0 file',
      ai: 'AI tóm tắt: request đã được chuẩn hóa, không phát hiện liên hệ ngoài nền tảng.',
      adminNote: 'Auto moderation: an toàn.', audit: 'AUD-new · scan PII · tạo request · ghi log',
    };
    app.setRequests(list => [req, ...list]);
    app.notify('Đã gửi request có cấu trúc và ghi audit log.');
    nav.navigate(role === 'actor' ? 'actor/request-detail' : 'user/request-detail', { id: req.id });
  };

  return (
    <Shell role={role === 'actor' ? 'actor' : 'user'} breadcrumb="Request Center / Tạo mới" title="Tạo structured request">
      <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18 }}>
        <SectionCard>
          <ContactWarning compact style={{ marginBottom: 14 }} />
          <div className="pmh-eyebrow" style={{ marginBottom: 8 }}>Loại request</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {types.map(t => <button key={t} className={`pmh-chip ${type === t ? 'pmh-chip--active' : ''}`} onClick={() => setType(t)}>{t}</button>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 12 }}>
            <input className="pmh-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề request" />
            <select className="pmh-select" value={priority} onChange={e => setPriority(e.target.value)}>
              {['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <textarea className="pmh-textarea" rows={9} value={detail} onChange={e => setDetail(e.target.value)} placeholder="Mô tả rõ mục tiêu, task liên quan, file cần kiểm tra và tiêu chí chấp nhận..." style={{ marginTop: 12 }} />
          {leaks.length > 0 && (
            <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'var(--danger-soft)', border: '1px solid var(--danger)', color: 'var(--danger-ink)', fontSize: 12, fontWeight: 700 }}>
              Nội dung có thể chứa thông tin liên hệ ngoài nền tảng: {leaks.map(l => l.type).join(', ')}. Vui lòng chỉnh sửa trước khi gửi.
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <span className="pmh-mono">Liên quan đơn {orderId} · file sẽ được scan virus</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="pmh-btn pmh-btn--ghost" onClick={() => nav.navigate(role === 'actor' ? 'actor/inbox' : 'user/requests')}>Hủy</button>
              <button className="pmh-btn pmh-btn--accent" disabled={leaks.length > 0} onClick={submit}><Icon name="send" size={13} /> Gửi request</button>
            </div>
          </div>
        </SectionCard>
        <SectionCard>
          <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Metadata bắt buộc</div>
          {[
            ['Status', 'Chờ phản hồi'],
            ['Timestamp', 'Tự động'],
            ['Creator', role === 'actor' ? 'Mentor' : 'Sinh viên'],
            ['Related order', orderId],
            ['Priority', priority],
            ['Files', 'Tối đa 5 file'],
            ['AI summary', 'Tự tạo'],
            ['Admin note', 'Auto moderation'],
            ['Audit log', 'Không thể xóa'],
          ].map(([l, v]) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--line)', fontSize: 12.5 }}><span style={{ color: 'var(--ink-3)' }}>{l}</span><b>{v}</b></div>)}
        </SectionCard>
      </div>
    </Shell>
  );
}

function RequestDetail({ role }) {
  const nav = useNav();
  const app = useAppState();
  const req = app.requests.find(r => r.id === nav.params.id) || app.requests[0];
  const shellRole = role === 'actor' ? 'actor' : 'user';
  return (
    <Shell role={shellRole} breadcrumb={`Request Center / ${req.id}`} title={req.title} actions={<ActionMenu actions={[
      { label: role === 'actor' ? 'Phản hồi có cấu trúc' : 'Tạo request mới', icon: 'send', primary: true, onClick: () => nav.navigate(role === 'actor' ? 'actor/request-detail' : 'user/request-new', { orderId: req.relatedOrder }) },
      { label: 'Quay lại', icon: 'chevronLeft', onClick: () => nav.navigate(role === 'actor' ? 'actor/inbox' : 'user/requests') },
    ]} />}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ContactWarning />
          <SectionCard>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                ['Trạng thái', req.status],
                ['Timestamp', req.time],
                ['Creator', req.creator],
                ['Related order', req.relatedOrder],
                ['Priority', req.priority],
                ['Files', req.files],
              ].map(([l, v]) => <div key={l} style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 10 }}><div className="pmh-mono" style={{ fontSize: 10.5 }}>{l}</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{v}</div></div>)}
            </div>
          </SectionCard>
          <RequestThread role={role} orderId={req.relatedOrder} />
          {role === 'actor' && <StructuredResponsePanel orderId={req.relatedOrder} />}
        </div>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionCard>
            <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>AI summary</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>{req.ai}</div>
          </SectionCard>
          <SectionCard>
            <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Admin note</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>{req.adminNote}</div>
          </SectionCard>
          <SectionCard>
            <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Audit log</div>
            <div className="pmh-mono" style={{ fontSize: 11, lineHeight: 1.6 }}>{req.audit}</div>
          </SectionCard>
        </aside>
      </div>
    </Shell>
  );
}

function StructuredResponsePanel({ orderId }) {
  const app = useAppState();
  const templates = window.RESPONSE_TEMPLATES || [
    { id: 'progress', label: 'Cập nhật tiến độ' },
    { id: 'submit-work', label: 'Gửi file hoàn thành' },
    { id: 'scope-change', label: 'Đề xuất thay đổi phạm vi công việc' },
  ];
  const [template, setTemplate] = React.useState(templates[0]?.id || 'progress');
  const [body, setBody] = React.useState('');
  const leaks = detectLeaks(body);
  return (
    <SectionCard>
      <div className="pmh-eyebrow" style={{ marginBottom: 8 }}>Structured response form · {orderId}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {templates.map(t => (
          <button key={t.id} className={`pmh-chip ${template === t.id ? 'pmh-chip--active' : ''}`} onClick={() => setTemplate(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <textarea
        className="pmh-textarea"
        rows={5}
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Trả lời bằng form có cấu trúc: tiến độ, file bàn giao, lý do, tác động deadline/chi phí, yêu cầu admin xác nhận..."
      />
      {leaks.length > 0 && (
        <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: 'var(--danger-soft)', color: 'var(--danger-ink)', fontSize: 12, fontWeight: 700 }}>
          Phát hiện thông tin liên hệ ngoài nền tảng. Xóa trước khi gửi phản hồi.
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <span className="pmh-mono">Response sẽ có timestamp, creator, files, AI summary, admin note và audit log.</span>
        <button className="pmh-btn pmh-btn--accent pmh-btn--sm" disabled={leaks.length > 0} onClick={() => app.notify('Phản hồi có cấu trúc đã được gửi và ghi audit log.')}>
          <Icon name="send" size={12} /> Gửi phản hồi
        </button>
      </div>
    </SectionCard>
  );
}

function WalletPage() {
  const app = useAppState();
  return (
    <Shell role="user" breadcrumb="Chính / Ví" title="Ví ProjectMentor">
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ padding: 24, borderRadius: 18, background: 'linear-gradient(135deg, oklch(0.25 0.05 265), oklch(0.18 0.03 260))', color: '#fff' }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Số dư hiện tại</div>
          <div style={{ fontSize: 38, fontWeight: 700, marginTop: 4 }}>1.245.000đ</div>
          <div className="pmh-mono" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 18 }}>•••• 7821 · MINH ANH · K63</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            {['Nạp tiền', 'Rút tiền', 'Thanh toán'].map((a, i) => <button key={a} className="pmh-btn pmh-btn--accent" onClick={() => app.notify(`${a} được mở trong modal giao dịch.`)}><Icon name={i === 0 ? 'plus' : i === 1 ? 'upload' : 'money'} size={13} /> {a}</button>)}
          </div>
        </div>
        <SectionCard>
          <div className="pmh-eyebrow">Tháng này</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Chi tiêu 3.8M</div>
          <BarChart width={380} height={130} color="var(--accent)" data={[{l:'T2',v:.6},{l:'T3',v:.8},{l:'T4',v:1.4},{l:'T5',v:2.1},{l:'T6',v:1.9},{l:'T7',v:2.4},{l:'CN',v:1.2}]} />
        </SectionCard>
      </div>
      <TransactionList />
    </Shell>
  );
}

function TransactionList() {
  return (
    <SectionCard>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Lịch sử giao dịch</div>
      {[
        ['Thanh toán mốc 2 · PRJ-2839', 'Chi tiêu', 'Lê Hà Phương', -2000000, 'Thành công'],
        ['Nạp ví qua Momo', 'Nạp tiền', 'Momo', 2500000, 'Thành công'],
        ['Đặt cọc 30% · PRJ-2841', 'Chi tiêu', 'Hệ thống escrow', -1260000, 'Thành công'],
        ['Hoàn tiền hủy đơn PRJ-2815', 'Hoàn tiền', 'Hệ thống', 800000, 'Thành công'],
      ].map(([t, c, p, v, s], i) => (
        <div key={t} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 120px 130px', padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '', alignItems: 'center', fontSize: 12.5 }}>
          <b>{t}</b><span>{c}</span><span>{p}</span><StatusBadge status="done" label={s} /><b style={{ textAlign: 'right', color: v > 0 ? 'var(--ok-ink)' : 'var(--ink)' }}>{v > 0 ? '+' : ''}{fmtMoney(v)}</b>
        </div>
      ))}
    </SectionCard>
  );
}

function UserProfilePage() {
  return (
    <Shell role="user" breadcrumb="Tài khoản / Hồ sơ" title="Hồ sơ cá nhân">
      <ProfileLayout name="Nguyễn Minh Anh" sub="Sinh viên năm 4 · Điện tử viễn thông · ĐH Bách Khoa HN" privateNote="Thông tin liên hệ chỉ hiển thị với chính bạn và admin. Mentor không thấy email, SĐT hoặc thanh toán." />
    </Shell>
  );
}

function ProfileLayout({ name, sub, privateNote }) {
  return (
    <>
      <SectionCard style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 20, alignItems: 'center', marginBottom: 20 }}>
        <Avatar initials={name.split(' ').slice(-2).map(w => w[0]).join('')} size={90} hue={270} />
        <div><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div style={{ fontSize: 22, fontWeight: 700 }}>{name}</div><span className="pmh-badge pmh-badge--ok">Đã xác minh</span></div><div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>{sub}</div><div style={{ fontSize: 12, color: 'var(--warn-ink)', marginTop: 10 }}>{privateNote}</div></div>
        <button className="pmh-btn pmh-btn--ghost"><Icon name="edit" size={13} /> Chỉnh sửa</button>
      </SectionCard>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <SectionCard><div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Năng lực & hồ sơ</div>{['Trường / đơn vị', 'Chuyên ngành', 'Kỹ năng', 'Điểm tin cậy', 'Lĩnh vực quan tâm', 'Ngôn ngữ'].map((l, i) => <div key={l} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', padding: '9px 0', borderTop: i ? '1px solid var(--line)' : '', fontSize: 13 }}><span className="pmh-mono">{l}</span><b>{['ĐH Bách Khoa Hà Nội', 'Kỹ thuật máy tính', 'IoT, Embedded, AI', '98/100', 'STM32, ESP32, Computer Vision', 'Tiếng Việt, English'][i]}</b></div>)}</SectionCard>
        <SectionCard><div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Hoạt động</div>{[['Đồ án đã hỗ trợ', '4'], ['Bài viết đã lưu', '34'], ['Request đã tạo', '18'], ['Đánh giá', '4.9★']].map(([l, v], i) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: i ? '1px solid var(--line)' : '' }}><span>{l}</span><b>{v}</b></div>)}</SectionCard>
      </div>
    </>
  );
}

function SavedArticlesPage() {
  return (
    <Shell role="user" breadcrumb="Học tập / Đã lưu" title="Bài viết đã lưu">
      {MOCK.ARTICLES.length ? <ArticleGrid articles={MOCK.ARTICLES.slice(0, 6)} routePrefix="user" /> : <EmptyState title="Chưa lưu bài viết" body="Bấm Lưu trong Article Detail để xây dựng thư viện học tập cá nhân." />}
    </Shell>
  );
}

function SettingsPage({ role }) {
  const app = useAppState();
  const shellRole = role === 'actor' ? 'actor' : 'user';
  return (
    <Shell role={shellRole} breadcrumb="Tài khoản / Cài đặt" title="Cài đặt">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {['Bảo mật đăng nhập 2FA', 'Thông báo request', 'Ẩn thông tin liên hệ với đối tác', 'Cho phép AI tóm tắt tiến độ', 'Nhận email bài viết mới', 'Chế độ tiết kiệm dữ liệu'].map((s, i) => (
          <SectionCard key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontSize: 13.5, fontWeight: 700 }}>{s}</div><div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>Có thể thay đổi bất kỳ lúc nào.</div></div>
            <button onClick={() => app.notify(`Đã cập nhật: ${s}`)} className={`pmh-chip ${i < 4 ? 'pmh-chip--active' : ''}`}>{i < 4 ? 'Bật' : 'Tắt'}</button>
          </SectionCard>
        ))}
      </div>
    </Shell>
  );
}

function ActorDashboard() {
  const nav = useNav();
  return (
    <Shell role="actor" breadcrumb="Công việc / Tổng quan" title="Actor Dashboard" actions={<ActionMenu actions={[
      { label: 'Tìm dự án', icon: 'briefcase', primary: true, onClick: () => nav.navigate('actor/market') },
      { label: 'Viết bài chia sẻ kiến thức', icon: 'edit', onClick: () => nav.navigate('actor/article-edit', { mode: 'new' }) },
      { label: 'Quản lý bài viết', icon: 'book', onClick: () => nav.navigate('actor/articles') },
    ]} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        <MiniStat label="Dự án đang làm" value="5" icon="folder" onClick={() => nav.navigate('actor/workspace')} />
        <MiniStat label="Dự án hoàn thành" value="47" icon="check" tone="ok" />
        <MiniStat label="Thu nhập tháng" value="24.8M" icon="money" tone="cyan" onClick={() => nav.navigate('actor/income')} />
        <MiniStat label="Task đến hạn" value="3" icon="clock" tone="warn" onClick={() => nav.navigate('actor/tasks')} />
        <MiniStat label="Request mới" value="3" icon="send" onClick={() => nav.navigate('actor/inbox')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <SectionCard><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Thu nhập 6 tháng gần nhất</div><BarChart width={620} height={170} color="var(--accent)" data={[{l:'T11',v:14.2},{l:'T12',v:18.6},{l:'T1',v:16.4},{l:'T2',v:20.1},{l:'T3',v:22.8},{l:'T4',v:24.8}]} /></SectionCard>
        <SectionCard><div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Dự án phù hợp</div>{MARKET_PROJECTS.slice(0, 3).map((p, i) => <button key={p.id} onClick={() => nav.navigate('actor/project-detail', { id: p.id })} style={{ textAlign: 'left', width: '100%', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : '' }}><b style={{ fontSize: 12.5 }}>{p.title}</b><div className="pmh-mono">{p.budget} · {p.match}</div></button>)}</SectionCard>
      </div>
    </Shell>
  );
}

function ProjectMarketplace() {
  const nav = useNav();
  const app = useAppState();
  const [filter, setFilter] = React.useState('Phù hợp với bạn');
  const accept = (p) => app.setConfirm({ title: 'Nhận dự án?', body: `Bạn sắp nhận ${p.id}. Sau khi xác nhận, workspace sẽ được tạo và thông tin liên hệ của sinh viên vẫn được ẩn.`, confirmText: 'Nhận dự án', onConfirm: () => nav.navigate('actor/workspace', { id: p.id }) });
  return (
    <Shell role="actor" breadcrumb="Công việc / Marketplace" title="Dự án đang cần mentor">
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['Tất cả', 'Phù hợp với bạn', 'Mới đăng', 'Ngân sách cao', 'Sắp hết hạn'].map(f => <button key={f} className={`pmh-chip ${filter === f ? 'pmh-chip--active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {MARKET_PROJECTS.map(p => <ProjectCard key={p.id} p={p} onDetail={() => nav.navigate('actor/project-detail', { id: p.id })} onAccept={() => accept(p)} />)}
      </div>
    </Shell>
  );
}

function ProjectCard({ p, onDetail, onAccept }) {
  return (
    <SectionCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
        <div><div style={{ display: 'flex', gap: 6, marginBottom: 6 }}><span className="pmh-mono">{p.id}</span><span className="pmh-badge">{p.cat}</span><span className="pmh-badge pmh-badge--accent">Phù hợp {p.match}</span></div><div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35 }}>{p.title}</div></div>
        <Icon name="bookmark" size={15} color="var(--ink-3)" />
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 12 }}>Sinh viên cần mentor có kinh nghiệm, tài liệu hướng dẫn và bàn giao theo task. Thông tin cá nhân đã được ẩn theo chính sách nền tảng.</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>{p.skills.map(s => <span key={s} className="pmh-chip" style={{ height: 24, fontSize: 11 }}>{s}</span>)}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: 10, background: 'var(--surface-2)', borderRadius: 10, marginBottom: 12 }}>
        {[[ 'Ngân sách', p.budget ], [ 'Deadline', p.deadline ], [ 'Đăng', p.posted ]].map(([l, v]) => <div key={l}><div className="pmh-mono" style={{ fontSize: 10 }}>{l}</div><b style={{ fontSize: 13 }}>{v}</b></div>)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}><button className="pmh-btn pmh-btn--ghost pmh-btn--sm" style={{ flex: 1, justifyContent: 'center' }} onClick={onDetail}>Xem chi tiết</button><button className="pmh-btn pmh-btn--accent pmh-btn--sm" style={{ flex: 1, justifyContent: 'center' }} onClick={onAccept}>Nhận dự án</button></div>
    </SectionCard>
  );
}

function ProjectRequestDetail() {
  const nav = useNav();
  const app = useAppState();
  const p = MARKET_PROJECTS.find(x => x.id === nav.params.id) || MARKET_PROJECTS[0];
  return (
    <Shell role="actor" breadcrumb={`Marketplace / ${p.id}`} title={p.title} actions={<ActionMenu actions={[
      { label: 'Nhận dự án', icon: 'check', primary: true, onClick: () => app.setConfirm({ title: 'Nhận dự án?', body: 'Workspace sẽ được tạo. Bạn chỉ trao đổi qua structured request và không thấy thông tin liên hệ cá nhân của sinh viên.', confirmText: 'Nhận dự án', onConfirm: () => nav.navigate('actor/workspace', { id: p.id }) }) },
      { label: 'Yêu cầu admin xác nhận', icon: 'shield', onClick: () => app.notify('Đã gửi yêu cầu admin xác nhận phạm vi.') },
    ]} />}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
        <SectionCard><ContactWarning compact /><div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)' }}>Sinh viên cần hỗ trợ hoàn thiện prototype, giải thích kỹ thuật và báo cáo. Không cung cấp số điện thoại, email, Zalo, Facebook hoặc thông tin thanh toán. Mọi báo giá và trao đổi đều qua hệ thống.</div><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>{p.skills.map(s => <span className="pmh-chip" key={s}>{s}</span>)}</div></SectionCard>
        <SectionCard>{[['Mã dự án', p.id], ['Ngân sách', p.budget], ['Deadline', p.deadline], ['Độ khó', p.diff], ['Sinh viên', 'Đã ẩn danh'], ['Thanh toán', 'Escrow nền tảng']].map(([l, v]) => <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: '1px solid var(--line)' }}><span className="pmh-mono">{l}</span><b>{v}</b></div>)}</SectionCard>
      </div>
    </Shell>
  );
}

function ActorWorkspace() {
  const app = useAppState();
  const nav = useNav();
  const cols = [
    ['todo', 'Cần làm', MOCK.TASKS.filter(t => t.status === 'todo')],
    ['doing', 'Đang làm', MOCK.TASKS.filter(t => t.status === 'doing')],
    ['review', 'Chờ duyệt', MOCK.TASKS.filter(t => t.status === 'review')],
    ['done', 'Hoàn thành', MOCK.TASKS.filter(t => t.status === 'done')],
  ];
  return (
    <Shell role="actor" breadcrumb="Dự án đang làm / PRJ-2841" title="Workspace · Hệ thống nhà kính IoT" actions={<ActionMenu actions={[
      { label: 'Tạo task', icon: 'plus', primary: true, onClick: () => app.setModal({ type: 'task' }) },
      { label: 'AI đề xuất task', icon: 'sparkle', onClick: () => { app.setAiSeed('Tạo task cho dự án'); app.setAiOpen(true); } },
      { label: 'Cập nhật tiến độ', icon: 'trend', onClick: () => app.setModal({ type: 'progress' }) },
      { label: 'Gửi file hoàn thành', icon: 'upload', onClick: () => app.setModal({ type: 'file' }) },
    ]} />}>
      <ContactWarning compact style={{ marginBottom: 14 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {cols.map(([id, title, tasks]) => (
          <div key={id} className="pmh-card" style={{ background: 'var(--surface-2)', padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}><b>{title}</b><span className="pmh-badge">{tasks.length}</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks.map(t => <button key={t.id} onClick={() => app.setModal({ type: 'task-detail', task: t })} className="pmh-card" style={{ padding: 12, textAlign: 'left', background: '#fff' }}><div style={{ fontSize: 12.5, fontWeight: 700 }}>{t.title}</div><div className="pmh-mono" style={{ marginTop: 5 }}>{t.id} · {t.progress}% · {t.deadline}</div></button>)}
            </div>
          </div>
        ))}
      </div>
      <SectionCard style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Request từ sinh viên</div>
        {STRUCTURED_REQUESTS.slice(0, 2).map((r, i) => <button key={r.id} onClick={() => nav.navigate('actor/request-detail', { id: r.id })} style={{ width: '100%', textAlign: 'left', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : '' }}><b>{r.title}</b><div className="pmh-mono">{r.id} · {r.status}</div></button>)}
      </SectionCard>
    </Shell>
  );
}

function TaskManagement() {
  const app = useAppState();
  return (
    <Shell role="actor" breadcrumb="Công việc / Task Management" title="Task Management">
      <SectionCard>{MOCK.TASKS.map((t, i) => <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px 170px', gap: 14, padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '', alignItems: 'center' }}><div><b>{t.title}</b><div className="pmh-mono">{t.id} · PRJ-2841</div></div><div className="pmh-progress"><span style={{ width: t.progress + '%' }} /></div><StatusBadge status={t.status} /><button className="pmh-btn pmh-btn--ghost pmh-btn--sm" onClick={() => app.setModal({ type: 'progress', task: t })}>Cập nhật tiến độ</button></div>)}</SectionCard>
    </Shell>
  );
}

function MentorKnowledgePage() {
  const nav = useNav();
  return (
    <Shell role="actor" breadcrumb="Nội dung / Quản lý bài viết" title="Mentor Knowledge Management" actions={<button className="pmh-btn pmh-btn--accent pmh-btn--sm" onClick={() => nav.navigate('actor/article-edit', { mode: 'new' })}><Icon name="plus" size={13} /> Viết bài mới</button>}>
      <ArticleListPanel scope="mentor" />
    </Shell>
  );
}

function ArticleEditorPage({ scope }) {
  const nav = useNav();
  const app = useAppState();
  const [title, setTitle] = React.useState(nav.params.mode === 'new' ? '' : 'Pattern thiết kế firmware FreeRTOS cho IoT');
  const [desc, setDesc] = React.useState('Hướng dẫn tách task, queue và watchdog cho đồ án IoT.');
  const [body, setBody] = React.useState('## Mở đầu\n\nViết nội dung bài chia sẻ kỹ thuật, không chèn thông tin liên hệ ngoài nền tảng.\n\n```c\nvoid app_main(void) {}\n```');
  const [category, setCategory] = React.useState('Embedded');
  const [tags, setTags] = React.useState('stm32, freertos, firmware');
  const [difficulty, setDifficulty] = React.useState('Trung bình');
  const [slug, setSlug] = React.useState('firmware-freertos-iot');
  const [meta, setMeta] = React.useState('Best practice thiết kế firmware FreeRTOS cho sinh viên.');
  const leaks = detectLeaks(`${title} ${desc} ${body} ${tags} ${meta}`);
  const isAdmin = scope === 'admin';
  const submit = () => app.setConfirm({
    title: isAdmin ? 'Xuất bản bài viết?' : 'Gửi admin duyệt?',
    body: isAdmin ? 'Bài viết sẽ được publish trực tiếp hoặc theo lịch đã chọn.' : 'Bài viết sẽ chuyển sang trạng thái “Chờ admin duyệt”.',
    confirmText: isAdmin ? 'Xuất bản' : 'Gửi duyệt',
    onConfirm: () => {
      app.notify(isAdmin ? 'Bài viết đã được xuất bản.' : 'Bài viết đã chuyển sang trạng thái Chờ admin duyệt.');
      nav.navigate(isAdmin ? 'admin/articles' : 'actor/articles');
    }
  });

  return (
    <Shell role={isAdmin ? 'admin' : 'actor'} breadcrumb={`${isAdmin ? 'Admin' : 'Mentor'} / Editor`} title={isAdmin ? 'Admin Create/Edit Article' : 'Mentor Create/Edit Article'}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 16 }}>
        <SectionCard>
          <div style={{ padding: 12, borderRadius: 10, background: 'var(--warn-soft)', color: 'var(--warn-ink)', fontSize: 12.5, fontWeight: 700, marginBottom: 14 }}>
            Không chèn số điện thoại, email, link mạng xã hội hoặc thông tin giao dịch ngoài nền tảng.
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề bài viết" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 28, fontWeight: 700, marginBottom: 12 }} />
          <textarea className="pmh-textarea" rows={2} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Mô tả ngắn" style={{ marginBottom: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 140px', gap: 10, marginBottom: 12 }}>
            <select className="pmh-select" value={category} onChange={e => setCategory(e.target.value)}>{['Embedded', 'IoT', 'Web App', 'AI/ML', 'Robotics', 'Học thuật'].map(c => <option key={c}>{c}</option>)}</select>
            <input className="pmh-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags" />
            <select className="pmh-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>{['Cơ bản', 'Trung bình', 'Nâng cao'].map(d => <option key={d}>{d}</option>)}</select>
          </div>
          <StripedImg label="thumbnail upload · 1200x630" style={{ height: 120, marginBottom: 12 }} hue={220} />
          <div style={{ display: 'flex', gap: 4, padding: 6, background: 'var(--surface-2)', borderRadius: 8, marginBottom: 12 }}>
            {['Rich text', 'Markdown', 'Code block', 'Image block', 'Attachment', 'Callout', 'Table', 'Equation', 'Preview'].map((b, i) => <button key={b} className="pmh-btn pmh-btn--soft pmh-btn--sm" onClick={() => i === 8 ? app.setModal({ type: 'preview', title, body }) : app.notify(`${b} block đã được thêm.`)}>{b}</button>)}
          </div>
          <textarea value={body} onChange={e => setBody(e.target.value)} className="pmh-textarea" rows={18} style={{ fontFamily: 'var(--font-mono)', lineHeight: 1.7 }} />
          {leaks.length > 0 && <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: 'var(--danger-soft)', color: 'var(--danger-ink)', fontWeight: 700 }}>Nội dung có thể chứa thông tin liên hệ ngoài nền tảng. Vui lòng chỉnh sửa trước khi gửi duyệt.</div>}
        </SectionCard>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionCard>
            <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>Hành động</div>
            <button className="pmh-btn pmh-btn--ghost pmh-btn--sm" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }} onClick={() => app.notify('Đã lưu nháp.')}>Lưu nháp</button>
            <button className="pmh-btn pmh-btn--accent pmh-btn--sm" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }} disabled={leaks.length > 0} onClick={submit}>{isAdmin ? 'Publish trực tiếp' : 'Gửi admin duyệt'}</button>
            {isAdmin && <button className="pmh-btn pmh-btn--soft pmh-btn--sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => app.notify('Đã lên lịch xuất bản 08:00 ngày mai.')}>Schedule publication</button>}
          </SectionCard>
          <SectionCard>
            <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>SEO & Metadata</div>
            <input className="pmh-input" value={slug} onChange={e => setSlug(e.target.value)} placeholder="SEO slug" style={{ marginBottom: 8 }} />
            <textarea className="pmh-textarea" rows={3} value={meta} onChange={e => setMeta(e.target.value)} placeholder="Meta description" />
            <div className="pmh-mono" style={{ marginTop: 8 }}>{Math.ceil(body.length / 1000)} phút đọc · attachments: 2</div>
          </SectionCard>
          <SectionCard>
            <div className="pmh-eyebrow" style={{ marginBottom: 10 }}>AI writing assistant</div>
            {['Gợi ý tiêu đề', 'Tạo outline', 'Viết phần giới thiệu', 'Tóm tắt', 'Sửa lỗi', 'Tạo tags', 'Tạo mô tả ngắn', 'Kiểm tra vi phạm chính sách'].map(p => <button key={p} className="pmh-chip" style={{ margin: 3 }} onClick={() => { app.setAiSeed(p); app.setAiOpen(true); }}>{p}</button>)}
          </SectionCard>
          {isAdmin && <SectionCard>{['Gắn nổi bật', 'Pin bài viết', 'Bật bình luận', 'Tắt bình luận'].map(a => <button key={a} className="pmh-btn pmh-btn--ghost pmh-btn--sm" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} onClick={() => app.notify(`Đã cập nhật: ${a}`)}>{a}</button>)}</SectionCard>}
        </aside>
      </div>
    </Shell>
  );
}

function ActorEarnings() {
  return <Shell role="actor" breadcrumb="Tài chính / Thu nhập" title="Actor Earnings"><TransactionList /></Shell>;
}

function ActorProfilePage() {
  return <Shell role="actor" breadcrumb="Tài khoản / Hồ sơ mentor" title="Actor Profile"><ProfileLayout name="Trần Minh Khoa" sub="Mentor · Embedded · 47 dự án hoàn thành" privateNote="Sinh viên không thấy email, số điện thoại, mạng xã hội hoặc thông tin thanh toán của bạn." /></Shell>;
}

function ActorVerification() {
  const nav = useNav();
  return (
    <Shell role="actor" breadcrumb="Tài khoản / Xác minh" title="Actor Verification">
      <SectionCard><div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Hoàn tất xác minh mentor</div><div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>Tải bằng cấp, portfolio, kinh nghiệm dự án và cam kết bảo vệ nền tảng. Sau khi gửi, admin có thể duyệt, yêu cầu bổ sung hoặc từ chối.</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>{['CMND/CCCD', 'Bằng cấp / chứng chỉ', 'Portfolio dự án'].map(f => <div key={f} style={{ padding: 14, border: '1px dashed var(--line-2)', borderRadius: 10 }}><Icon name="upload" size={18} color="var(--accent)" /><div style={{ fontWeight: 700, marginTop: 8 }}>{f}</div></div>)}</div><button className="pmh-btn pmh-btn--accent" style={{ marginTop: 18 }} onClick={() => nav.navigate('actor/dashboard')}>Gửi xác minh · vào Dashboard</button></SectionCard>
    </Shell>
  );
}

function AdminDashboard() {
  const nav = useNav();
  return (
    <Shell role="admin" breadcrumb="Quản lý / Tổng quan" title="Admin Dashboard">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        <MiniStat label="Người dùng" value="3.2k" icon="users" onClick={() => nav.navigate('admin/users')} />
        <MiniStat label="Mentor" value="342" icon="academic" onClick={() => nav.navigate('admin/actors')} />
        <MiniStat label="Đơn hàng" value="128" icon="folder" onClick={() => nav.navigate('admin/orders')} />
        <MiniStat label="Request cần duyệt" value="12" icon="send" tone="warn" onClick={() => nav.navigate('admin/requests-mod')} />
        <MiniStat label="Bài chờ duyệt" value="7" icon="book" tone="cyan" onClick={() => nav.navigate('admin/article-mod')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <AdminQuickTable title="Đơn mới" rows={MOCK.ORDERS.slice(0, 4)} route="admin/order-detail" />
        <AdminRiskPanel />
      </div>
    </Shell>
  );
}

function AdminQuickTable({ title, rows, route }) {
  const nav = useNav();
  return <SectionCard><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{title}</div>{rows.map((o, i) => <button key={o.id} onClick={() => nav.navigate(route, { id: o.id })} style={{ width: '100%', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 120px 110px', gap: 14, padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '' }}><div><b>{o.title}</b><div className="pmh-mono">{o.id}</div></div><StatusBadge status={o.status} /><b>{fmtMoney(o.budget)}</b></button>)}</SectionCard>;
}

function AdminRiskPanel() {
  const nav = useNav();
  return <SectionCard><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Risk queue</div>{[['Request nghi chia sẻ Zalo', 'admin/request-mod-detail'], ['Bài viết có link ngoài', 'admin/article-mod-detail'], ['Khiếu nại thiếu file train', 'admin/disputes'], ['AI log bất thường', 'admin/ai-logs']].map(([t, r], i) => <button key={t} onClick={() => nav.navigate(r)} style={{ width: '100%', textAlign: 'left', padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '' }}><span className="pmh-badge pmh-badge--warn" style={{ marginRight: 8 }}>FLAG</span><b>{t}</b></button>)}</SectionCard>;
}

function AdminTable({ type }) {
  const nav = useNav();
  const app = useAppState();
  const cfg = {
    users: { title: 'User Management', route: 'admin/user-detail', rows: [['Nguyễn Minh Anh', 'Sinh viên', 'Active', '4 đơn'], ['Phạm Thanh Lâm', 'Sinh viên', 'Active', '2 đơn'], ['Lê Khánh Vy', 'Sinh viên', 'Chờ xác minh', '0 đơn']] },
    actors: { title: 'Actor/Mentor Management', route: 'admin/actor-detail', rows: [['Trần Minh Khoa', 'Embedded', 'Verified', '47 dự án'], ['Lê Hà Phương', 'AI/ML', 'Verified', '32 dự án'], ['Võ Hoài Nam', 'Web App', 'Chờ duyệt', '0 dự án']] },
    orders: { title: 'Order Management', route: 'admin/order-detail', rows: MOCK.ORDERS.map(o => [o.title, o.id, o.statusLabel, fmtMoney(o.budget)]) },
  }[type];
  return (
    <Shell role="admin" breadcrumb={`Admin / ${cfg.title}`} title={cfg.title}>
      <SectionCard>
        {cfg.rows.map((r, i) => (
          <button key={i} onClick={() => nav.navigate(cfg.route, { id: r[1] })} style={{ width: '100%', textAlign: 'left', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 150px', gap: 14, padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '', alignItems: 'center' }}>
            <b>{r[0]}</b><span>{r[1]}</span><StatusBadge status={String(r[2]).includes('Active') || String(r[2]).includes('Verified') ? 'done' : 'review'} label={r[2]} /><span>{r[3]}</span><ActionMenu actions={[{ label: 'Block', icon: 'lock', onClick: (e) => { e?.stopPropagation?.(); app.notify('Đã mở workflow block tài khoản.'); } }, { label: 'Edit', icon: 'edit', onClick: (e) => { e?.stopPropagation?.(); app.notify('Đã mở chỉnh sửa.'); } }]} /></button>
        ))}
      </SectionCard>
    </Shell>
  );
}

function AdminEntityDetail({ type }) {
  const app = useAppState();
  const label = type === 'actor' ? 'Actor Detail' : 'User Detail';
  return (
    <Shell role="admin" breadcrumb={`Admin / ${label}`} title={label} actions={<ActionMenu actions={[{ label: 'Block', icon: 'lock', onClick: () => app.notify('Tài khoản đã được đưa vào luồng block.') }, { label: 'Request revision', icon: 'edit', onClick: () => app.notify('Đã yêu cầu bổ sung hồ sơ.') }]} />}>
      <ProfileLayout name={type === 'actor' ? 'Trần Minh Khoa' : 'Nguyễn Minh Anh'} sub={type === 'actor' ? 'Mentor · Embedded · Verified' : 'Sinh viên · ĐH Bách Khoa'} privateNote="Admin có quyền xem thông tin bảo mật, mọi thao tác đều ghi audit log." />
    </Shell>
  );
}

function AdminOrderDetail() {
  const app = useAppState();
  return (
    <Shell role="admin" breadcrumb="Admin / Order Detail" title="Admin Order Detail" actions={<ActionMenu actions={[{ label: 'Intervene', icon: 'shield', primary: true, onClick: () => app.notify('Admin đã can thiệp và tạo audit log.') }, { label: 'Refund', icon: 'money', onClick: () => app.notify('Đã mở quy trình hoàn tiền.') }, { label: 'Archive', icon: 'file', onClick: () => app.notify('Đã lưu trữ đơn.') }]} />}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}><UserOrderDetailContentForAdmin /><AdminRiskPanel /></div>
    </Shell>
  );
}

function UserOrderDetailContentForAdmin() {
  return <SectionCard><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>PRJ-2841 · Hệ thống giám sát nhà kính IoT</div>{['Sinh viên: Nguyễn Minh Anh', 'Mentor: Trần Minh Khoa', 'Escrow: 4.200.000đ', 'Tiến độ: 64%', 'Request mở: 2', 'PII flags: 0'].map((x, i) => <div key={x} style={{ padding: '10px 0', borderTop: i ? '1px solid var(--line)' : '', fontSize: 13 }}>{x}</div>)}<RequestThread role="admin" orderId="PRJ-2841" /></SectionCard>;
}

function AdminRequestModeration() {
  const nav = useNav();
  return (
    <Shell role="admin" breadcrumb="Tin cậy / Request Moderation" title="Request Moderation">
      <SectionCard>{STRUCTURED_REQUESTS.map((r, i) => <button key={r.id} onClick={() => nav.navigate('admin/request-mod-detail', { id: r.id })} style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 160px 120px 140px', gap: 14, padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '', textAlign: 'left', alignItems: 'center' }}><div><b>{r.title}</b><div className="pmh-mono">{r.id} · {r.audit}</div></div><StatusBadge status="review" label={r.status} /><span className="pmh-badge pmh-badge--warn">AI risk: thấp</span><span>{r.relatedOrder}</span></button>)}</SectionCard>
    </Shell>
  );
}

function AdminRequestModerationDetail() {
  const app = useAppState();
  return (
    <Shell role="admin" breadcrumb="Tin cậy / Request Detail" title="Request Moderation Detail" actions={<AdminModerationActions />}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}><RequestThread role="admin" orderId="PRJ-2841" /><SectionCard><div className="pmh-eyebrow" style={{ marginBottom: 10 }}>AI risk analysis</div>{['Phone/email: không phát hiện', 'Social links: không phát hiện', 'Payment keywords: không phát hiện', 'Tone: bình thường', 'Admin suggestion: approve'].map(x => <div key={x} style={{ padding: '8px 0', borderTop: '1px solid var(--line)', fontSize: 12.5 }}>{x}</div>)}<textarea className="pmh-textarea" rows={4} placeholder="Admin note..." style={{ marginTop: 12 }} /><button className="pmh-btn pmh-btn--accent pmh-btn--sm" style={{ marginTop: 8 }} onClick={() => app.notify('Đã lưu admin note.')}>Lưu note</button></SectionCard></div>
    </Shell>
  );
}

function AdminModerationActions() {
  const app = useAppState();
  return <ActionMenu actions={['Approve', 'Reject', 'Edit', 'Block', 'Flag'].map((l, i) => ({ label: l, icon: i === 0 ? 'check' : i === 1 ? 'close' : i === 2 ? 'edit' : i === 3 ? 'lock' : 'alert', primary: i === 0, onClick: () => app.notify(`Admin action: ${l}`) }))} />;
}

function AdminKnowledgePage() {
  const nav = useNav();
  return <Shell role="admin" breadcrumb="Nội dung / Knowledge Management" title="Knowledge Management" actions={<button className="pmh-btn pmh-btn--accent pmh-btn--sm" onClick={() => nav.navigate('admin/article-edit', { mode: 'new' })}><Icon name="plus" size={13} /> Tạo bài admin</button>}><ArticleListPanel scope="admin" /></Shell>;
}

function AdminArticleModeration() {
  const nav = useNav();
  return (
    <Shell role="admin" breadcrumb="Nội dung / Article Moderation" title="Article Moderation" actions={<button className="pmh-btn pmh-btn--soft pmh-btn--sm" onClick={() => nav.navigate('admin/article-mod-detail')}><Icon name="eye" size={13} /> Mở bài đầu tiên</button>}>
      <ArticleModerationPanel />
      <div style={{ marginTop: 14 }}><button className="pmh-btn pmh-btn--accent" onClick={() => nav.navigate('admin/article-mod-detail')}>Đi tới Article Moderation Detail</button></div>
    </Shell>
  );
}

function ArticleModerationDetail() {
  const app = useAppState();
  return (
    <Shell role="admin" breadcrumb="Nội dung / Duyệt bài / a2003" title="Article Moderation Detail" actions={<ActionMenu actions={[
      { label: 'Duyệt và xuất bản', icon: 'check', primary: true, onClick: () => app.notify('Bài viết đã được duyệt và xuất bản.') },
      { label: 'Yêu cầu chỉnh sửa', icon: 'edit', onClick: () => app.notify('Đã gửi feedback chỉnh sửa cho mentor.') },
      { label: 'Từ chối bài viết', icon: 'close', onClick: () => app.notify('Bài viết đã bị từ chối.') },
      { label: 'Gắn nổi bật', icon: 'star', onClick: () => app.notify('Đã gắn nổi bật.') },
      { label: 'Lưu trữ', icon: 'file', onClick: () => app.notify('Đã lưu trữ.') },
    ]} />}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18 }}>
        <SectionCard><div className="pmh-eyebrow">Article preview</div><h1 style={{ fontSize: 28, margin: '10px 0' }}>Mẹo chọn linh kiện giá rẻ ở chợ Nhật Tảo</h1><StripedImg label="article preview" style={{ height: 220, marginBottom: 14 }} hue={60} /><p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7 }}>Bài viết đang chờ duyệt. Admin kiểm tra rủi ro liên hệ ngoài nền tảng, độ phù hợp học thuật, lịch sử chỉnh sửa và file đính kèm.</p></SectionCard>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><SectionCard><div className="pmh-eyebrow">Author info</div><div style={{ display: 'flex', gap: 10, marginTop: 10 }}><Avatar initials="VH" hue={60} /><div><b>Nguyễn Văn Hùng</b><div className="pmh-mono">Mentor · Embedded</div></div></div></SectionCard><SectionCard><div className="pmh-eyebrow">AI risk analysis</div>{['External contact detection: 1 link nghi vấn', 'Payment keywords: 0', 'Revision history: 4 phiên bản', 'Attached files: bom.xlsx', 'Suggested decision: request revision'].map(x => <div key={x} style={{ padding: '8px 0', borderTop: '1px solid var(--line)', fontSize: 12.5 }}>{x}</div>)}</SectionCard><SectionCard><textarea className="pmh-textarea" rows={5} placeholder="Admin feedback form..." /><button className="pmh-btn pmh-btn--accent pmh-btn--sm" style={{ marginTop: 8 }}>Gửi feedback</button></SectionCard></aside>
      </div>
    </Shell>
  );
}

function AdminComments() {
  const app = useAppState();
  return <Shell role="admin" breadcrumb="Nội dung / Comment Moderation" title="Comment Moderation"><SectionCard>{['Bài này hay quá, cho mình hỏi thêm về FreeRTOS?', 'Bạn liên hệ fb.com/example nhé', 'Có thể chia sẻ code mẫu không?'].map((c, i) => <div key={c} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 240px', gap: 14, padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '', alignItems: 'center' }}><div><b>{c}</b><div className="pmh-mono">Article a1001 · user K63</div></div><span className={`pmh-badge ${detectLeaks(c).length ? 'pmh-badge--danger' : 'pmh-badge--ok'}`}>{detectLeaks(c).length ? 'Có rủi ro' : 'An toàn'}</span><ActionMenu actions={[{label:'Approve',icon:'check',onClick:()=>app.notify('Đã duyệt bình luận.')},{label:'Reject',icon:'close',onClick:()=>app.notify('Đã từ chối bình luận.')},{label:'Block',icon:'lock',onClick:()=>app.notify('Đã block nội dung.')}]}/></div>)}</SectionCard></Shell>;
}

function AdminTransactions() {
  const app = useAppState();
  return <Shell role="admin" breadcrumb="Tin cậy / Transaction Management" title="Transaction Management" actions={<button className="pmh-btn pmh-btn--ghost pmh-btn--sm" onClick={() => app.notify('Đã xuất báo cáo giao dịch.')}>Xuất báo cáo</button>}><TransactionList /></Shell>;
}

function AdminDisputes() {
  const app = useAppState();
  return <Shell role="admin" breadcrumb="Tin cậy / Dispute Management" title="Dispute Management"><SectionCard>{['File bàn giao thiếu dữ liệu train', 'Mentor xin gia hạn lần 2', 'Sinh viên yêu cầu hoàn tiền'].map((d, i) => <div key={d} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 250px', gap: 14, padding: '12px 0', borderTop: i ? '1px solid var(--line)' : '', alignItems: 'center' }}><b>{d}</b><StatusBadge status="review" label="Đang xử lý" /><ActionMenu actions={[{label:'Intervene',icon:'shield',primary:true,onClick:()=>app.notify('Admin đã can thiệp dispute.')},{label:'Refund',icon:'money',onClick:()=>app.notify('Đã mở workflow refund.')}]}/></div>)}</SectionCard></Shell>;
}

function AdminAuditLogs() {
  return <Shell role="admin" breadcrumb="Tin cậy / Admin Moderation Logs" title="Admin Moderation Logs"><LogList items={['AUD-5581 · request created · scan PII · safe', 'AUD-5529 · mentor response · closed', 'AUD-5488 · dispute flag · payout locked', 'AUD-5412 · article rejected · external link']} /></Shell>;
}

function AdminAILogs() {
  return <Shell role="admin" breadcrumb="Hệ thống / AI Logs" title="AI Logs"><LogList items={['AI-9921 · Wizard analysis · confidence 92%', 'AI-9918 · Article policy check · flagged external link', 'AI-9914 · Admin risk summary · suggest request revision', 'AI-9902 · Task breakdown · 7 tasks generated']} /></Shell>;
}

function LogList({ items }) {
  return <SectionCard>{items.map((l, i) => <div key={l} className="pmh-mono" style={{ padding: '10px 0', borderTop: i ? '1px solid var(--line)' : '', fontSize: 12 }}>{l}</div>)}</SectionCard>;
}

function SystemSettings() {
  const app = useAppState();
  return <Shell role="admin" breadcrumb="Hệ thống / Settings" title="System Settings"><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>{['Bật AI PII detector', 'Tự khóa payout khi dispute', 'Yêu cầu admin duyệt bài mentor', 'Ẩn contact giữa user và mentor', 'Moderate comments trước publish', 'Log toàn bộ request thread'].map(s => <SectionCard key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><b>{s}</b><button className="pmh-chip pmh-chip--active" onClick={() => app.notify(`Đã cập nhật ${s}`)}>Bật</button></SectionCard>)}</div></Shell>;
}

function GlobalModals() {
  const app = useAppState();
  if (app.confirm) {
    return (
      <div style={overlayStyle}>
        <div className="pmh-card" style={{ width: 420, padding: 20, boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{app.confirm.title}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 18 }}>{app.confirm.body}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="pmh-btn pmh-btn--ghost" onClick={() => app.setConfirm(null)}>Hủy</button>
            <button className="pmh-btn pmh-btn--accent" onClick={() => { const fn = app.confirm.onConfirm; app.setConfirm(null); fn?.(); }}>{app.confirm.confirmText || 'Xác nhận'}</button>
          </div>
        </div>
      </div>
    );
  }
  if (!app.modal) return null;
  const close = () => app.setModal(null);
  const titles = { task: 'Tạo task mới', progress: 'Cập nhật tiến độ', file: 'Gửi file hoàn thành', preview: 'Preview bài viết', 'task-detail': 'Chi tiết task' };
  return (
    <div style={overlayStyle}>
      <div className="pmh-card" style={{ width: app.modal.type === 'preview' ? 720 : 480, padding: 20, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{titles[app.modal.type] || 'Modal'}</div>
          <button onClick={close}><Icon name="close" size={16} /></button>
        </div>
        {app.modal.type === 'preview' ? (
          <div><h2 style={{ fontSize: 24, marginBottom: 12 }}>{app.modal.title || 'Untitled'}</h2><div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.65, color: 'var(--ink-2)' }}>{app.modal.body}</div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="pmh-input" placeholder="Tiêu đề / tên task" defaultValue={app.modal.task?.title || ''} />
            <textarea className="pmh-textarea" rows={5} placeholder="Nội dung có cấu trúc, không chứa thông tin liên hệ ngoài nền tảng..." />
            <ContactWarning compact />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button className="pmh-btn pmh-btn--ghost" onClick={close}>Đóng</button>
          {app.modal.type !== 'preview' && <button className="pmh-btn pmh-btn--accent" onClick={() => { close(); app.notify('Đã lưu và ghi audit log.'); }}>Lưu</button>}
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(18,22,38,0.32)',
  display: 'grid', placeItems: 'center', zIndex: 80, backdropFilter: 'blur(3px)',
};

function FloatingAI() {
  const nav = useNav();
  const app = useAppState();
  const route = nav.route;
  const prompts = route.includes('wizard') ? ['Gợi ý đề tài đồ án', 'Phân tích yêu cầu này', 'Ước lượng timeline']
    : route.includes('order-detail') ? ['Tóm tắt tiến độ', 'Giải thích task status', 'Viết yêu cầu chỉnh sửa rõ ràng hơn']
    : route.includes('workspace') ? ['Tạo task cho dự án', 'Viết progress update', 'Ước lượng thêm thời gian']
    : route.includes('article-edit') ? ['Tạo outline bài viết', 'Gợi ý tiêu đề', 'Kiểm tra nội dung có vi phạm không']
    : route.startsWith('admin') ? ['Tóm tắt rủi ro', 'Detect suspicious communication', 'Đề xuất quyết định moderation']
    : ['Gợi ý đề tài đồ án', 'Khám phá bài viết', 'Tóm tắt nội dung hiện tại'];
  const [answer, setAnswer] = React.useState('');
  React.useEffect(() => { if (app.aiSeed) setAnswer(`Đã nhận: "${app.aiSeed}". AI sẽ trả lời theo ngữ cảnh trang ${ROUTE_TITLES[route] || route}.`); }, [app.aiSeed, route]);
  return (
    <>
      <button onClick={() => app.setAiOpen(true)} style={{ position: 'fixed', right: 22, bottom: 22, width: 52, height: 52, borderRadius: 16, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 8px 20px rgba(18,22,38,0.25)', zIndex: 50 }}>
        <Icon name="sparkle" size={22} color="oklch(0.85 0.1 270)" />
      </button>
      {app.aiOpen && (
        <div className="pmh-card" style={{ position: 'fixed', right: 22, bottom: 86, width: 420, maxHeight: 600, overflow: 'hidden', zIndex: 70, boxShadow: '0 20px 60px rgba(18,22,38,0.18)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, oklch(0.25 0.06 270), oklch(0.2 0.04 260))', color: '#fff' }}>
            <Icon name="sparkle" size={16} color="oklch(0.85 0.1 270)" />
            <div style={{ flex: 1 }}><b style={{ fontSize: 13.5 }}>PMH Assistant</b><div style={{ fontSize: 11, opacity: 0.7 }}>Context: {ROUTE_TITLES[route] || route}</div></div>
            <button onClick={() => app.setAiOpen(false)}><Icon name="close" size={15} color="rgba(255,255,255,0.8)" /></button>
          </div>
          <div style={{ padding: 16, overflow: 'auto' }}>
            <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 12, fontSize: 12.5, lineHeight: 1.55, marginBottom: 12 }}>
              AI thích nghi theo trang hiện tại và chỉ hỗ trợ viết nội dung, phân tích, tóm tắt. Không thay thế quyết định của admin, mentor hoặc sinh viên.
            </div>
            {prompts.map(p => <button key={p} onClick={() => setAnswer(`Gợi ý cho "${p}": chia nội dung thành các bước rõ ràng, bám theo policy không chia sẻ thông tin liên hệ và tạo request có cấu trúc khi liên quan dự án.`)} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: '1px solid var(--line-2)', borderRadius: 10, fontSize: 12.5, marginBottom: 7 }}><Icon name="arrowRight" size={12} color="var(--accent)" /> {p}</button>)}
            {answer && <div style={{ padding: 12, background: 'var(--accent-soft)', borderRadius: 12, fontSize: 12.5, lineHeight: 1.6, color: 'var(--accent-ink)', marginTop: 10 }}>{answer}</div>}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--line)', display: 'flex', gap: 6 }}>
            <input className="pmh-input" placeholder="Hỏi AI..." onKeyDown={e => { if (e.key === 'Enter') setAnswer(`AI trả lời theo ngữ cảnh ${ROUTE_TITLES[route] || route}: ${e.currentTarget.value}`); }} />
            <button className="pmh-btn pmh-btn--accent pmh-btn--sm"><Icon name="send" size={12} /></button>
          </div>
        </div>
      )}
    </>
  );
}

function SearchOverlay() {
  const nav = useNav();
  const app = useAppState();
  const [q, setQ] = React.useState('');
  if (!app.searchOpen) return null;
  const results = Object.entries(ROUTE_TITLES).filter(([k, v]) => (`${k} ${v}`).toLowerCase().includes(q.toLowerCase())).slice(0, 10);
  return (
    <div style={overlayStyle}>
      <div className="pmh-card" style={{ width: 620, padding: 16, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><input autoFocus className="pmh-input" placeholder="Tìm route, đơn hàng, bài viết..." value={q} onChange={e => setQ(e.target.value)} /><button className="pmh-btn pmh-btn--ghost" onClick={() => app.setSearchOpen(false)}>Đóng</button></div>
        {results.map(([route, title]) => <button key={route} onClick={() => { app.setSearchOpen(false); nav.navigate(route); }} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 0', borderTop: '1px solid var(--line)', textAlign: 'left' }}><b>{title}</b><span className="pmh-mono">{route}</span></button>)}
      </div>
    </div>
  );
}

function NotificationCenter() {
  const nav = useNav();
  const app = useAppState();
  if (!app.notificationsOpen) return null;
  const normalized = MOCK.NOTIFICATIONS.map(n => n.type === 'message' ? { ...n, title: 'Request hệ thống mới', body: 'Mentor đã phản hồi qua structured request. Không có chat riêng.', type: 'task' } : n);
  return (
    <div className="pmh-card" style={{ position: 'fixed', top: 62, right: 24, width: 360, zIndex: 65, boxShadow: '0 16px 40px rgba(18,22,38,0.14)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}><b>Thông báo</b><button onClick={() => app.notify('Đã đánh dấu tất cả đã đọc.')} style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 11.5 }}>Đánh dấu đã đọc</button></div>
      {normalized.map((n, i) => <button key={n.id} onClick={() => { app.setNotificationsOpen(false); nav.navigate(n.type === 'quote' ? 'user/order-detail' : n.type === 'task' ? 'user/requests' : 'user/wallet'); }} style={{ display: 'flex', gap: 10, width: '100%', textAlign: 'left', padding: '12px 16px', borderTop: i ? '1px solid var(--line)' : '', background: n.unread ? 'var(--accent-soft)' : 'transparent' }}><Icon name={n.type === 'payment' ? 'money' : n.type === 'quote' ? 'tag' : 'bell'} size={15} color="var(--accent)" /><div><b style={{ fontSize: 12.5 }}>{n.title}</b><div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.4 }}>{n.body}</div><div className="pmh-mono">{n.time}</div></div></button>)}
    </div>
  );
}

function Toast() {
  const app = useAppState();
  if (!app.toast) return null;
  return <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', background: 'var(--ink)', color: '#fff', padding: '10px 14px', borderRadius: 10, zIndex: 90, boxShadow: 'var(--shadow-lg)', fontSize: 13 }}>{app.toast}</div>;
}

function LoadingLayer() {
  const app = useAppState();
  if (!app.isLoading) return null;
  return <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.45)', display: 'grid', placeItems: 'center', zIndex: 85 }}><div className="pmh-card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="sparkle" size={16} color="var(--accent)" /><b>Đang tải trạng thái...</b></div></div>;
}

Object.assign(window, { PMHApp });
