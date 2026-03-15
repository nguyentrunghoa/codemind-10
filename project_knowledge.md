# CodeMind10 - Project Knowledge (Brain)

## 📌 Tổng quan dự án (Project Overview)
CodeMind10 là một ứng dụng Web AI với các công nghệ chính:
- **Frontend**: React 19, Vite, TailwindCSS v4. Các thư viện quan trọng: `@monaco-editor/react` (trình soạn thảo code), `react-markdown` (hiển thị markdown), `lucide-react` (icon).
- **Backend**: Node.js, Express 5, tích hợp Google AI qua SDK `@google/genai`.

## 🛠 Cấu trúc thư mục cốt lõi
- `frontend/`: Chứa mã nguồn giao diện người dùng.
  - Các component chính định vị ở `frontend/src/components/` (như `Login.jsx`, `Chatbot.jsx`, `EditorPane.jsx`, v.v.).
- `backend/`: Chứa server xử lý logic và gọi AI API (`server.js`).

## 📝 Nhật ký Fix Bug quan trọng (Changelog)

### [14/03/2026] Debugging & Fix: White Screen Error (Lỗi màn hình trắng)
- **Bối cảnh**: Ứng dụng xuất hiện lỗi màn hình trắng trống trơn trên Frontend (React crash) ngay sau khi tích hợp hoặc cập nhật UI cho chức năng **Instruction Modal**.
- **Cách khắc phục**: Đã khoanh vùng và xử lý triệt để nguyên nhân phát sinh trong chu trình render của các components (đặc biệt liên quan đến `Login.jsx` và các modal components).
- **Kết quả**: Frontend đã hoạt động trơn tru trở lại, UI hiển thị bình thường mà không bị crash tree.

## 🔐 Các phương án Xác thực Học sinh (Authentication) đã thảo luận
Dự án đã xem xét 3 phương án để quản lý đăng nhập cho học sinh:

### 1. Dùng chung 1 Mật mã lớp học (Shared Passcode) — **ĐANG SỬ DỤNG**
- **Cách hoạt động:** Dùng chung 1 mã (ví dụ: `TIN10_2024`) cấu hình trong file `.env`. 
- **Đặc điểm:** Nhanh gọn nhất cho tiết học 45 phút, không cần đăng ký tài khoản. Dữ liệu (code dở, lịch sử chat) lưu ở localStorage (mất khi đổi máy/ẩn danh). Không phân biệt được danh tính cá nhân.

### 2. Hệ thống Tài khoản nội bộ (Custom JWT + MongoDB/MySQL)
- **Cách hoạt động:** Học sinh tự tạo User/Pass riêng, lưu trên Database tự build.
- **Đặc điểm:** Dữ liệu độc lập hoàn toàn, dễ mở rộng tính năng quản lý, phân quyền. Tuy nhiên triển khai phức tạp, tốn công bảo mật code và tốn thời gian hỗ trợ khi học sinh quên mật khẩu.

### 3. Tích hợp Hệ sinh thái Google Firebase (Firebase Auth + Firestore)
- **Cách hoạt động:** Học sinh "Đăng nhập bằng Google/Gmail" với 1 click qua Firebase Auth. Code và lịch sử chat tự động lưu lên Firestore.
- **Đặc điểm:** Tiện lợi, bảo mật cao do Google quản lý, đồng bộ dữ liệu đa thiết bị (học sinh về nhà mở đúng tài khoản là còn nguyên code và bài học). Là giải pháp đường dài tối ưu nhất. Cần có Internet và cấu hình Firebase Security Rules ban đầu.

---
**💡 Ghi chú cho AI Assistant:**
Khi bắt đầu một cuộc trò chuyện mới, hãy đọc file này để nắm bắt được Architecture, Tech Stack và tiến trình xử lý lỗi gần nhất của dự án. Không cần hỏi lại User các thông tin cơ bản này.
