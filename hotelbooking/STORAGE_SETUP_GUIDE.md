# Supabase Storage Setup Guide

## Tạo Storage Buckets

### 1. Truy cập Supabase Dashboard
- Vào https://supabase.com/dashboard
- Chọn project: `duwgswndwphvnagfedix`

### 2. Tạo Bucket cho Hotel Images
1. Click **Storage** ở sidebar
2. Click **New bucket**
3. Name: `hotel-images`
4. **Public bucket**: ✅ Check (để ảnh public)
5. Click **Create bucket**

### 3. Tạo Bucket cho Room Images
1. Click **New bucket**
2. Name: `room-images`
3. **Public bucket**: ✅ Check
4. Click **Create bucket**

### 4. Setup RLS Policies (Quan trọng!)

#### Cho bucket `hotel-images`:
1. Click vào bucket `hotel-images`
2. Click **Policies** tab
3. Click **New Policy**
4. Chọn template: **Enable insert for authenticated users only**
5. Policy name: `Allow authenticated uploads`
6. Click **Review** → **Save policy**

#### Cho bucket `room-images`:
1. Click vào bucket `room-images`
2. Click **Policies** tab
3. Click **New Policy**
4. Chọn template: **Enable insert for authenticated users only**
5. Click **Review** → **Save policy**

### 5. Kiểm tra
- Vào mỗi bucket, click **Policies**
- Nên có ít nhất 1 policy cho INSERT
- Nếu chưa có, tạo policy custom:

```sql
-- For hotel-images bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'hotel-images');

-- For room-images bucket  
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'room-images');

-- Allow public read
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'hotel-images' OR bucket_id = 'room-images');
```

## Kiểm tra Upload

1. Vào AddHotel hoặc AddRoom
2. Upload ảnh
3. Mở DevTools Console (F12)
4. Xem logs:
   - ✅ "Image uploaded successfully: [URL]"
   - ❌ "Supabase storage upload error: ..."

## Xử lý lỗi thường gặp

### Lỗi: "new row violates row-level security policy"
- **Nguyên nhân**: Chưa có RLS policy cho INSERT
- **Fix**: Tạo policy như hướng dẫn ở trên

### Lỗi: "Bucket not found"
- **Nguyên nhân**: Bucket chưa được tạo
- **Fix**: Tạo bucket `hotel-images` và `room-images`

### Lỗi: "Access denied"
- **Nguyên nhân**: Bucket không public hoặc RLS chặn
- **Fix**: 
  1. Đảm bảo bucket là **Public**
  2. Thêm policy cho public read

## Test Upload Thủ công

1. Vào Storage → Chọn bucket `room-images`
2. Click **Upload file**
3. Chọn 1 ảnh bất kỳ
4. Upload thành công → Storage hoạt động ✅
5. Upload thất bại → Kiểm tra lại policies

## Lưu ý
- Mỗi room cần có ảnh riêng
- Upload thất bại → Room vẫn được tạo nhưng không có ảnh
- Ảnh phải < 5MB để upload nhanh
