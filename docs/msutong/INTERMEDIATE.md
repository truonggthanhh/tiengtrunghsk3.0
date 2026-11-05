# Msutong trung cấp

Bốn PDF người dùng cung cấp có tổng cộng 510 trang (118 / 134 / 134 / 124). Tệp PDF đầy đủ không được đưa vào Git.

| Quyển | Dòng phụ lục | Mục trong ứng dụng | Bài |
| --- | ---: | ---: | ---: |
| 1 | 273 | 273 | 10 |
| 2 | 355 | 355 | 10 |
| 3 | 235 | 239 | 10 |
| 4 | 209 | 209 | 10 |
| Tổng | 1.072 | 1.076 | 40 |

Đã nhập chữ Hán và số bài từ toàn bộ 22 trang bảng từ vựng cuối sách bằng cách xem ảnh trang. Bộ từ bao gồm các mục bổ sung, thành ngữ, mẫu câu và tên riêng có trong bảng. Bản OCR trong PDF nhận sai nhiều chữ và dấu; không nhập trực tiếp kết quả OCR vào danh mục.

Một lượt rà tọa độ các dòng từ vựng trong lớp OCR được dùng để phát hiện mục có trong bài nhưng chưa có ở phụ lục. Từ đó bổ sung 刘强, 里尔克 (quyển 3 bài 1), 王菲, 田中爱子 (quyển 3 bài 2). Lượt rà tự động này không thay thế việc hiệu đính độc lập mọi dòng bảng trong 40 bài. Phạm vi không coi mọi chữ xuất hiện trong bài khóa/ví dụ/ngữ pháp là từ mới riêng.

Nghĩa tiếng Việt được biên soạn ngắn gọn cho thẻ học, không tuyên bố chép nguyên văn bản dịch trong PDF. Pinyin được hỗ trợ bằng pinyin-pro và sửa cụ thể trong tệp nguồn đối với tên riêng, chữ đa âm, thanh nhẹ, âm cuốn lưỡi 儿 và mẫu câu. Cách tách âm tiết có thể khác cách viết liền trong sách. Những mẫu có hai dạng dùng dấu `/` để giữ cùng một mục học.

- Nguồn hiệu đính: `src/data/msutong/intermediate-reviewed/book1.tsv` đến `book4.tsv`. Dòng tiêu đề `@trang cột [loại] [nguồn]`; mỗi mục `chữ Hán|nghĩa Việt|bài|pinyin ghi đè nếu có`.
- Dữ liệu ứng dụng: `src/data/msutong/intermediate-vocabulary.json`.
- Tệp gốc, SHA256, tổng từng bài và phạm vi: [manifest](intermediate-source-manifest.json).
- Kiểm tra mất dòng/trùng ID: [audit](intermediate-data-audit.json).
- Xuất CSV: `public/data/msutong-intermediate-vocabulary.csv`; nút tải có trong trang Trung cấp.

Chọn cấp Trung cấp ở `/mandarin/msutong?level=trung-cap`, sau đó chọn quyển và bài. Homepage có liên kết riêng cho cả 8 quyển của hai cấp. URL hoạt động và liên kết tiếp tục học giữ `level`, tránh lẫn các bài có cùng số ở Sơ cấp.

Flashcard, chọn nghĩa/pinyin, điền từ, luyện phát âm và luyện viết dùng bộ từ này. Các hoạt động câu và đọc hiểu chỉ mở khi có nội dung bổ sung tương ứng; không tạo đoạn văn rồi gán thành bài khóa trong PDF.

Mặt trước flashcard tiếng Trung chỉ có chữ Hán và nút nghe. Pinyin nằm ở mặt đáp án và tuân theo thiết lập bật/tắt phiên âm. Thành ngữ dài có cỡ chữ nhỏ hơn; mặt đáp án cuộn được khi nội dung dài.

```bash
npm run build:msutong-intermediate
npm run audit:msutong-intermediate
npm run audit:msutong
npm run lint
npm run typecheck
npm test
npm run test:browser
npm run build
```

Bộ kiểm thử trình duyệt dùng Supabase giả lập, không kiểm chứng cơ sở dữ liệu thật. Việc nghe/nhận dạng giọng nói còn phụ thuộc hỗ trợ của trình duyệt.

Kết quả: audit Sơ cấp/Trung cấp đều không thiếu dòng và không trùng ID; lint, typecheck, build và 22 kiểm thử Node đạt; 60 tình huống Chromium đạt ở màn hình 320px.
