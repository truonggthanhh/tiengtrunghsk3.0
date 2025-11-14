# 🎵 YouTube Lyrics Sync Feature Guide

## ✨ Tính năng đã hoàn thành

Đã build xong tính năng **học qua bài hát với YouTube lyrics sync** cho cả **Mandarin** và **Cantonese**!

### 🎯 Cách hoạt động

Giống như các ứng dụng nghe nhạc hiện đại:
- YouTube video phát đến đâu
- Lời bài hát tự động highlight dòng đó
- Tự động scroll để dòng đang hát luôn ở giữa màn hình
- Smooth animation và transition

## 📱 Các trang đã tạo

### Mandarin (Tiếng Quan Thoại)
- **`/mandarin/songs`** - Danh sách bài hát Mandopop
- **`/mandarin/songs/:songId`** - Player + lyrics sync

### Cantonese (Tiếng Quảng Đông)
- **`/cantonese/songs`** - Danh sách bài hát Cantopop
- **`/cantonese/songs/:songId`** - Player + lyrics sync

## 🛠️ Cách thêm bài hát mới

### 1. Chuẩn bị dữ liệu

Bạn cần 3 thông tin:
- **title**: Tên bài hát (ví dụ: "七里香")
- **artist**: Ca sĩ (ví dụ: "Jay Chou 周杰倫")
- **youtube_video_id**: ID của video YouTube (ví dụ: "OlFeoi-9Ahs")
- **lrc**: Lời bài hát theo format LRC

### 2. Format LRC (Lyrics)

LRC là format chuẩn cho lyrics có timestamp:

```lrc
[00:12.50]歌词第一dòng
[00:16.30]歌词第hai dòng
[00:20.00]歌词第ba dòng
```

Format: `[MM:SS.MS]Text`
- MM: Phút (2 chữ số)
- SS: Giây (2 chữ số)
- MS: Mili giây (2-3 chữ số)
- Text: Lời bài hát

**Ví dụ thực tế**:

```lrc
[00:00.00]七里香 - 周杰倫
[00:12.50]窗外的麻雀 在電線桿上多嘴
[00:16.30]你說這一句 很有夏天的感覺
[00:20.00]手中的鉛筆 在紙上來來回回
[00:24.00]我用幾行字形容你是我的誰
```

### 3. Thêm vào database

Có 2 cách:

#### Cách 1: Qua Supabase Dashboard (Dễ nhất)

1. Vào **Supabase Dashboard** > **Table Editor** > **songs**
2. Click **Insert row**
3. Điền:
   - `title`: "七里香"
   - `artist`: "Jay Chou 周杰倫"
   - `youtube_video_id`: "OlFeoi-9Ahs"
   - `lrc`: Copy toàn bộ LRC content
4. Click **Save**

#### Cách 2: Qua SQL Editor

```sql
INSERT INTO songs (title, artist, youtube_video_id, lrc, created_at)
VALUES (
  '七里香',
  'Jay Chou 周杰倫',
  'OlFeoi-9Ahs',
  '[00:12.50]窗外的麻雀 在電線桿上多嘴
[00:16.30]你說這一句 很有夏天的感覺
[00:20.00]手中的鉛筆 在紙上來來回回
[00:24.00]我用幾行字形容你是我的誰',
  NOW()
);
```

### 4. Lấy YouTube Video ID

Từ URL YouTube: `https://www.youtube.com/watch?v=OlFeoi-9Ahs`
→ Video ID là: **OlFeoi-9Ahs** (phần sau `?v=`)

## 🔧 Technical Details

### LRC Parser

Code tự động parse LRC:
```typescript
[00:12.50]Text → { time: 12500, text: "Text" }
```
Time được convert sang milliseconds để so sánh với currentTime từ YouTube player.

### YouTube API Integration

Sử dụng **YouTube IFrame API** với `enablejsapi=1`:
- Listen `message` events từ YouTube player
- Poll `getCurrentTime` mỗi 200ms khi đang play
- Update `currentTime` state để trigger lyrics sync

### Auto-scroll Logic

```typescript
if (activeLineIndex !== -1) {
  lyricRefs.current[activeLineIndex]?.scrollIntoView({
    behavior: 'smooth',
    block: 'center', // Dòng active luôn ở giữa
  });
}
```

### Active Line Detection

```typescript
const activeIndex = lrcLines.findIndex((line, index) => {
  const nextLineTime = lrcLines[index + 1]?.time || Infinity;
  return currentTime >= line.time && currentTime < nextLineTime;
});
```

## 🎨 Design Features

### Mandarin (Red/Orange theme)
- Play button: Red gradient
- Active lyric: Red background
- Hover: Orange accent

### Cantonese (Cyan/Purple theme)
- Play button: Cyan gradient
- Active lyric: Cyan background
- Hover: Purple accent

## 📚 Nguồn LRC

Bạn có thể tìm LRC từ:

1. **LRC Libraries**:
   - [LRCLib.net](https://lrclib.net)
   - [Megalobiz](https://www.megalobiz.com/lrc)

2. **Tự tạo**:
   - Nghe bài hát
   - Ghi timestamp cho mỗi dòng
   - Format theo `[MM:SS.MS]Text`

3. **Tools**:
   - MiniLyrics
   - LRC Editor

## 🚀 Testing

1. Deploy code lên production
2. Thêm vài bài hát test vào database
3. Vào `/mandarin/songs` hoặc `/cantonese/songs`
4. Click vào bài hát
5. Play video và xem lyrics sync!

## 💡 Tips

- **Lyrics quality**: LRC càng chính xác thì sync càng mượt
- **Video quality**: Chọn official video để tránh bị xóa
- **Testing**: Test với vài bài trước khi add hàng loạt
- **Format**: Giữ format LRC chuẩn để parser hoạt động đúng

## 🐛 Troubleshooting

### Lyrics không sync
- Check format LRC có đúng không
- Verify YouTube video ID đúng
- Check console logs

### Video không play
- Verify YouTube video ID
- Check video có bị restrict không (age-restricted, region-locked)

### Scroll không smooth
- Check browser có support smooth scroll không
- Test trên browser khác

---

**Enjoy learning through music!** 🎵 🎤 🎸
