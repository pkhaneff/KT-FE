BÁO CÁO NGUYÊN TẮC XÂY DỰNG DỰ ÁN MOBILE REACT NATIVE (TYPESCRIPT) CHUẨN PRODUCTION
1. Mục tiêu kiến trúc
Xây dựng codebase theo hướng: Scalable, Testable, Reviewable, Maintainable.
Tách lớp rõ ràng để tránh "Spaghetti code" trong Component:

API Layer: Định nghĩa call API (Axios/Fetch).

Service Layer: Xử lý logic trung gian, biến đổi dữ liệu (Data Transformer).

Domain/Business Logic: Các quy tắc nghiệp vụ, validation, state management logic.

Infrastructure Layer: Cấu hình storage (MMKV/AsyncStorage), Client (Axios instance), Native Modules.

Presentation Layer (UI): React Native components + Tailwind (NativeWind).

2. Nguyên tắc tổ chức codebase (Feature-first)
Ưu tiên tổ chức theo Feature/Module, không tổ chức thuần theo Technical Layer (không gom tất cả Screen vào một chỗ).
Mỗi module (ví dụ: auth, order, profile) tự chứa:

components/: UI con của module.

hooks/: Logic hook riêng cho feature (Query/Mutation).

services/: Các hàm gọi API.

types.ts: Interface/Type riêng.

store/: Local state (Zustand/Redux slice).

3. Cấu trúc thư mục khuyến nghị (Dự án vừa & lớn)
src/
├── app/                 # Entry point, App Navigation (Expo Router hoặc React Navigation)
├── assets/              # Images, Fonts, Icons
├── components/          # Shared UI Components (Button, Input, Card...)
├── core/                # Cấu hình hệ thống (Axios, Theme, Constants, I18n)
├── features/            # Business Modules (Trái tim của dự án)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts     # Public API của module
│   └── orders/
├── hooks/               # Custom hooks dùng chung (useDebounce, useAppTheme...)
├── services/            # Global services (Push Notification, Deep Link)
├── store/               # Global state (Zustand/Redux)
├── theme/               # Tailwind config, global styles
├── utils/               # Helper functions (Format date, money...)
├── types/               # Global Types/Interfaces
└── App.tsx              # Root Component
4. Quy tắc phân lớp trách nhiệm (Mobile)
Component (Presentation): Chỉ render UI và nhận user input. Sử dụng Tailwind để styling. Không viết logic tính toán phức tạp hay gọi API trực tiếp.

Hooks (Controller): Kết nối UI và Logic. Xử lý việc loading, error state.

Service (Data): Nơi giao tiếp với Backend. Thực hiện mapping dữ liệu từ API (CamelCase) sang UI nếu cần.

Store (State): Quản lý trạng thái bền vững (User info, Cart, Token).

5. Quy tắc Clean Code & SOLID cho Mobile
SRP: Một Component chỉ làm một việc. Nếu file dài quá 200 dòng -> Tách nhỏ.

DIP: Component không nên phụ thuộc trực tiếp vào Axios instance. Nên gọi qua Service/Hooks.

Không truyền "God Object": Không truyền cả đối tượng Navigation hay User to đùng xuống các component con quá sâu -> Dùng Context hoặc Zustand.

Magic Numbers: Tuyệt đối không hard-code khoảng cách, màu sắc. Dùng theme hoặc tailwind classes.

6. Xử lý Config & Environment (ENV)
Dùng react-native-config hoặc expo-constants (nếu dùng Expo).

Tách biệt các file: .env.development, .env.staging, .env.production.

Bắt buộc: Phải có file env.d.ts để định nghĩa type-safe cho các biến môi trường.

Prefix ENV: API_URL, SENTRY_DSN, REVENUE_CAT_KEY.

7. Quy tắc Styling (Tailwind/NativeWind)
Sử dụng NativeWind để đồng nhất styling giống Web.

Ưu tiên dùng className cho các style đơn giản.

Với các style động phức tạp (ví dụ tính toán dựa trên độ rộng màn hình), dùng StyleSheet kết hợp.

Xây dựng hệ thống Design System (Atom components) trước khi làm Feature.

8. Quản lý State & Data Fetching
Server State: Dùng @tanstack/react-query. Nó giải quyết: Caching, Retry, Loading, Pagination tự động.

Local State: Dùng Zustand (nhẹ, dễ scale hơn Redux).

Persistence: Dùng MMKV (nhanh hơn AsyncStorage gấp nhiều lần) để lưu Token/Settings.

9. Quy tắc API Layer (Mobile)
Tất cả response từ API phải được định nghĩa Interface.

Sử dụng Axios Interceptors để xử lý:

Inject Bearer Token vào Header.

Xử lý Refresh Token tự động khi nhận lỗi 401.

Log lỗi tập trung (Sentry/Bugsnag).

10. Chiến lược Testing
Unit Test (Jest): Test các hàm utils, logic trong services, và các hàm tính toán nghiệp vụ.

Component Test (React Native Testing Library): Test các tương tác UI (nhấn nút, nhập text).

E2E Test (Detox): Test các luồng chính (Login -> Purchase -> Success).

11. Production Readiness (Cần có trước khi Store)
Sentry/Bugsnag: Theo dõi Crash và Exception.

App Versioning: Quản lý build number tự động.

Proguard (Android): Obfuscate code để tăng tính bảo mật.

SSL Pinning: Nếu app yêu cầu bảo mật cao.

CodePush: Để update logic nhanh không cần qua Store (tùy dự án).

12. Những điều CẤM (Anti-patterns)
Cấm: Sử dụng any trong TypeScript.

Cấm: Gọi API trực tiếp bên trong useEffect của Component. (Dùng React Query).

Cấm: Lưu thông tin nhạy cảm (Password) vào AsyncStorage dưới dạng plain text.

Cấm: Để file ảnh quá lớn (> 1MB) trong thư mục assets mà không tối ưu.

Cấm: Viết quá nhiều inline style (style={{...}}).