# 🎯 HƯỚNG DẪN TRUY CẬP DASHBOARD OWNER

## ✅ BƯỚC 1: FIX DATABASE (BẮT BUỘC)

Vào Supabase Dashboard → SQL Editor → Chạy lệnh này:

```sql
-- Fix constraint để cho phép role OWNER
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('USER', 'OWNER'));

-- Tắt RLS cho bảng users (đã làm rồi thì skip)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Thêm column address vào hotels (nếu chưa có)
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS address TEXT;
```

## ✅ BƯỚC 2: KHỞI ĐỘNG SERVER VÀ CLIENT

### Terminal 1 - Server:
```bash
cd D:\DTDM\hotelbooking\HotelBooking-server\server
npm start
```

### Terminal 2 - Client:
```bash
cd D:\DTDM\hotelbooking\HotelBooking-main\client
npm run dev
```

**Đợi đến khi thấy:**
- Server: `Server running on port 3000`
- Client: `Local: http://localhost:5173`

## ✅ BƯỚC 3: ĐĂNG NHẬP

1. Mở browser: `http://localhost:5173`
2. Click **"Login"** ở góc trên phải
3. Đăng nhập bằng Clerk (email/password hoặc Google)

## ✅ BƯỚC 4: CHUYỂN SANG OWNER

### Cách 1: Dùng nút "Become Hotel Owner" (Navbar)
1. Sau khi đăng nhập, tìm nút **"Become Hotel Owner"** ở Navbar (góc trên)
2. Click vào nút đó
3. Đợi thông báo: "🎉 You are now a hotel owner! Redirecting to dashboard..."
4. Sau 1.5 giây → Tự động vào Dashboard

### Cách 2: Dùng RoleSelector (Góc dưới phải)
1. Tìm panel **"🔧 Dev: Change Role"** ở góc dưới bên phải
2. Click nút **"Make Owner"** (màu xanh lá)
3. Đợi thông báo success
4. Page reload → Role đã đổi
5. Bây giờ click "Dashboard" trên Navbar HOẶC vào URL `/dashboard`

### Cách 3: Truy cập trực tiếp (sau khi đã đổi role)
1. Vào URL: `http://localhost:5173/dashboard`

## 📍 CÁC TRANG OWNER

Sau khi vào Dashboard, bạn sẽ thấy:

### 1. Dashboard (`/dashboard`)
- Tổng quan bookings
- Total Revenue
- Danh sách Recent Bookings

### 2. Add Room (`/dashboard/add-room`)
- Form thêm phòng mới
- Upload ảnh
- Chọn hotel, room type, price
- Chọn amenities

### 3. List Room (`/dashboard/list-room`)
- Danh sách tất cả phòng
- Toggle available/unavailable
- Quản lý phòng

## 🔍 KIỂM TRA KẾT QUẢ

✅ **Thành công nếu:**
- Sau khi click "Become Hotel Owner" → Có alert thông báo
- Page reload và redirect đến `/dashboard`
- Thấy sidebar bên trái với: Dashboard, Add Room, List Room
- Thấy nội dung Dashboard với Total Bookings, Total Revenue

❌ **Lỗi nếu:**
- Click "Become Hotel Owner" nhưng không có alert → Check console log
- Có alert nhưng redirect về home → Role chưa update (check SQL constraint)
- Vào `/dashboard` bị redirect về home → User role vẫn là USER

## 🐛 DEBUG

### Nếu không update được role:
1. Mở Console (F12) → Tab Console
2. Click "Become Hotel Owner"
3. Xem log:
   - `Updating role for user: user_xxx`
   - `Role updated successfully...`
4. Nếu có lỗi → Copy lỗi và báo

### Nếu vào Dashboard bị redirect:
1. Mở Console → Tab Console
2. Tìm log: `Layout - Authentication status:`
3. Check `user.role` → Phải là `'OWNER'`
4. Nếu vẫn là `'USER'` → Role chưa update trong DB

## 📝 CHECKLIST

- [ ] Đã chạy SQL fix constraint trong Supabase
- [ ] Server đang chạy (port 3000)
- [ ] Client đang chạy (port 5173)
- [ ] Đã đăng nhập vào app
- [ ] Đã click "Become Hotel Owner" hoặc "Make Owner"
- [ ] Thấy alert thông báo thành công
- [ ] Tự động redirect vào Dashboard
- [ ] Thấy sidebar với Dashboard, Add Room, List Room
- [ ] Thấy dữ liệu Dashboard (bookings, revenue)

## 🎉 HOÀN THÀNH!

Nếu tất cả các bước trên OK, bạn đã thành công truy cập vào Owner Dashboard!
