# Frontend Architecture (Production-ready)

## 1) Mục tiêu
- Scale theo feature module.
- Dễ maintain, test, review.
- Tách trách nhiệm theo SOLID, đặc biệt `SRP` và `DIP`.

## 2) Cấu trúc thư mục
- `src/app`: shell app, layout, router, providers.
- `src/core`: constants, seo, utils dùng toàn cục.
- `src/components`: shared UI atoms/molecules độc lập business.
- `src/features/public`: UI cho public pages.
- `src/features/user`: UI cho user pages.

## 3) Quy tắc coding
- Không hardcode style lặp lại, ưu tiên component tái sử dụng.
- Page chỉ orchestration UI, không nhồi business logic.
- Utility độc lập (`sanitizeText`, `cn`) đặt ở `core/utils`.
- Route tập trung tại `core/constants/routes.js`.

## 4) Security & Accessibility baseline
- Sanitize input text trước xử lý/render.
- Có skip-link, focus ring rõ ràng, semantic layout.
- SEO metadata qua `react-helmet-async`.

## 5) Checklist trước khi mở rộng
- Mỗi feature mới phải có: `pages/`, `components/`, `services/` (khi có API), `hooks/` (khi có state/flow phức tạp).
- Tất cả route mới phải khai báo trong `routes.js`.
- Tất cả form phải có validation + empty/loading/error states.
