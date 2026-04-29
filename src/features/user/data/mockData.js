export const userMetrics = [
  { label: 'Đơn đang làm', value: '2' },
  { label: 'Yêu cầu mở', value: '4' },
  { label: 'Số dư ví', value: '1.200.000đ' },
  { label: 'Bài đã lưu', value: '34' },
]

export const orders = [
  {
    id: 'PRJ-2845',
    title: 'Drone tự động né vật cản bằng LiDAR',
    category: 'Robotics',
    budget: '6.5 - 8.0M',
    status: 'Đang triển khai',
    statusKey: 'in-progress',
    progress: 62,
    deadline: '28 Th.5 2026',
    updated: '2 giờ trước',
    actor: {
      name: 'Lê Hà Phương',
      role: 'Mentor Embedded',
      rating: '4.9',
    },
  },
  {
    id: 'PRJ-2844',
    title: 'App theo dõi bệnh nhân tim mạch + IoT patch',
    category: 'IoT',
    budget: '5.0 - 6.5M',
    status: 'Chờ báo giá',
    statusKey: 'waiting',
    progress: 18,
    deadline: '16 Th.6 2026',
    updated: 'Hôm qua',
    actor: null,
  },
]

export const requests = [
  {
    id: 'REQ-1094',
    title: 'Chỉnh lại retry logic cho Telegram Bot',
    status: 'Chờ mentor phản hồi',
    priority: 'Cao',
    type: 'Yêu cầu chỉnh sửa',
    relatedOrder: 'PRJ-2845',
    time: '09:42 · 18 Th.5',
    files: 'demo.mp4, log.csv',
    ai: 'AI tóm tắt: cần sửa exponential backoff, không có thông tin liên hệ ngoài nền tảng.',
    adminNote: 'Đã scan PII, an toàn.',
    audit: 'AUD-5581 · tạo request · scan nội dung · gửi mentor',
  },
  {
    id: 'REQ-1088',
    title: 'Giải thích trạng thái dashboard MQTT',
    status: 'Đã phản hồi',
    priority: 'Trung bình',
    type: 'Yêu cầu giải thích tiến độ',
    relatedOrder: 'PRJ-2845',
    time: '17:00 · 17 Th.5',
    files: 'Không có',
    ai: 'AI tóm tắt: mentor đã giải thích lý do chậm 1 ngày và kế hoạch bù.',
    adminNote: 'Không cần can thiệp.',
    audit: 'AUD-5529 · phản hồi mentor · đóng request',
  },
]

export const articles = [
  {
    id: 'a1001',
    title: 'Thiết kế hệ thống IoT chống mất gói dữ liệu',
    author: 'Mentor Nam',
    readTime: '8 phút',
  },
  {
    id: 'a1002',
    title: 'Checklist demo đồ án tốt nghiệp trước hội đồng',
    author: 'Mentor Linh',
    readTime: '6 phút',
  },
]

export const orderTasks = [
  { id: 'T-01', title: 'Sơ đồ khối hệ thống', deadline: '15 Th.5', progress: 100, status: 'done' },
  { id: 'T-02', title: 'Thiết kế PCB mở rộng', deadline: '19 Th.5', progress: 100, status: 'done' },
  { id: 'T-03', title: 'Firmware STM32 HAL', deadline: '24 Th.5', progress: 74, status: 'review' },
  { id: 'T-04', title: 'Gateway ESP32 + MQTT', deadline: '27 Th.5', progress: 55, status: 'doing' },
  { id: 'T-05', title: 'Dashboard Node-RED', deadline: '30 Th.5', progress: 30, status: 'todo' },
]

export const orderTimeline = [
  { title: 'Khởi tạo yêu cầu', audit: 'AUD-5520 · đã đóng', status: 'done' },
  { title: 'Mentor nhận dự án', audit: 'AUD-5523 · đã đóng', status: 'done' },
  { title: 'Hoàn tất phần cứng', audit: 'AUD-5531 · đã đóng', status: 'done' },
  { title: 'Firmware đang review', audit: 'AUD-5547 · đang mở', status: 'review' },
  { title: 'Bàn giao cuối', audit: 'AUD-5560 · chờ kích hoạt', status: 'todo' },
]

export const orderFiles = [
  { name: 'firmware-stm32.zip', status: 'Đã scan' },
  { name: 'dashboard-mqtt.mp4', status: 'Đã scan' },
  { name: 'bom-list.xlsx', status: 'Đã scan' },
  { name: 'report-draft.docx', status: 'Đã scan' },
]

export const orderPayments = [
  { label: 'Đặt cọc 30%', amount: '1.260.000đ', status: 'Đã thanh toán', statusKey: 'done' },
  { label: 'Mốc 1 · Phần cứng', amount: '840.000đ', status: 'Đã thanh toán', statusKey: 'done' },
  { label: 'Mốc 2 · Firmware', amount: '1.260.000đ', status: 'Đang chờ duyệt', statusKey: 'review' },
  { label: 'Bàn giao cuối', amount: '840.000đ', status: 'Chờ hoàn thành', statusKey: 'todo' },
]

export const walletTransactions = [
  { title: 'Thanh toán mốc 2 · PRJ-2839', category: 'Chi tiêu', partner: 'Lê Hà Phương', amount: '-2.000.000đ', status: 'Thành công', type: 'out' },
  { title: 'Nạp ví qua Momo', category: 'Nạp tiền', partner: 'Momo', amount: '+2.500.000đ', status: 'Thành công', type: 'in' },
  { title: 'Đặt cọc 30% · PRJ-2845', category: 'Chi tiêu', partner: 'Escrow', amount: '-1.260.000đ', status: 'Thành công', type: 'out' },
  { title: 'Hoàn tiền hủy đơn PRJ-2815', category: 'Hoàn tiền', partner: 'Hệ thống', amount: '+800.000đ', status: 'Thành công', type: 'in' },
]
