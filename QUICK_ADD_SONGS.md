# Hướng dẫn nhanh thêm bài hát test

## Đã làm gì:

✅ **Thêm link "Học qua Bài Hát" vào trang Mandarin Index**
- Card đẹp với gradient red/orange
- Icon Music và animation
- Link đến `/mandarin/songs`

✅ **Tạo SQL template** (`ADD_TEST_SONGS.sql`)
- Template để thêm bài hát Mandarin và Cantonese
- Hướng dẫn lấy LRC từ nguồn hợp pháp

## Cách thêm bài hát test:

### Bước 1: Lấy LRC content

Vào một trong các trang sau để tìm LRC:
- **LRCLib.net**: https://lrclib.net
- **Megalobiz**: https://www.megalobiz.com/lrc
- Hoặc search Google: `"tên bài hát" LRC`

### Bước 2: Lấy YouTube Video ID

Từ URL YouTube: `https://www.youtube.com/watch?v=OlFeoi-9Ahs`
→ Video ID là: **OlFeoi-9Ahs** (phần sau `?v=`)

### Bước 3: Thêm vào database

**Cách 1: Qua Supabase Dashboard (Dễ nhất)**
1. Vào **Supabase Dashboard** > **Table Editor** > **songs**
2. Click **Insert row**
3. Điền:
   - `title`: "七里香"
   - `artist`: "Jay Chou 周杰倫"
   - `youtube_video_id`: "OlFeoi-9Ahs"
   - `lrc`: Copy toàn bộ LRC content từ LRCLib.net
4. Click **Save**

**Cách 2: Qua SQL Editor**
1. Copy template từ `ADD_TEST_SONGS.sql`
2. Thay `[Lyrics line 1...]` bằng LRC thật từ LRCLib.net
3. Run trong Supabase SQL Editor

### Bước 4: Test

1. Deploy code lên production
2. Vào `/mandarin` → Click vào card "Học qua Bài Hát"
3. Sẽ thấy bài hát vừa thêm
4. Click vào bài hát → Play video và xem lyrics sync!

## Ví dụ LRC format đúng:

```lrc
[00:00.00]七里香 - 周杰倫
[00:12.50]窗外的麻雀 在電線桿上多嘴
[00:16.30]你說這一句 很有夏天的感覺
[00:20.00]手中的鉛筆 在紙上來來回回
```

Format: `[MM:SS.MS]Text`

## Gợi ý bài hát test phổ biến:

**Mandarin (Mandopop):**
- 七里香 - Jay Chou (Video ID: OlFeoi-9Ahs)
- 告白氣球 - Jay Chou
- 小幸運 - Hebe Tien
- 演員 - Joker Xue

**Cantonese (Cantopop):**
- 喜歡你 - Beyond (Video ID: dODi8MLvdvk)
- 海闊天空 - Beyond
- 光輝歲月 - Beyond

## Lưu ý:

⚠️ **Chỉ sử dụng nội dung từ nguồn hợp pháp**
- LRCLib.net và Megalobiz là các nguồn community-driven
- Không copy lyrics từ trang web có bản quyền
- Nếu không chắc, tự tạo LRC bằng cách nghe và ghi timestamp

---

**Chúc bạn test thành công!** 🎵🎤
