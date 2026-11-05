# Khôi phục và đối chiếu Msutong

Đã nhận đủ 4 PDF nén (152 + 153 + 145 + 137 = 587 trang scan). OCR dùng để định vị; chữ Hán, pinyin và nghĩa được nhập từ 16 trang phụ lục, rồi đối chiếu bằng hình ảnh các bảng Từ mới của 40 bài, gồm từ thành phần và tên riêng.

| Quyển | Dòng phụ lục | Mục học theo bài |
| --- | ---: | ---: |
| 1 | 198 | 200 |
| 2 | 217 | 220 |
| 3 | 198 | 198 |
| 4 | 192 | 194 |
| Tổng | 805 | 812 |

812 mục học là hợp của phụ lục và bảng Từ mới, không phải 812 từ duy nhất: cùng từ xuất hiện ở bài khác hoặc có nghĩa/cách đọc khác được giữ riêng. Đã rà 807 lượt từ trong các bảng theo bài. Phạm vi không bao gồm việc coi mọi chữ trong ví dụ, bài khóa hoặc bảng ngữ pháp là một từ mới riêng.

- Nguồn nhập có thể kiểm tra: `src/data/msutong/reviewed/book*.tsv` và `lesson-census.txt`.
- Danh mục chạy trong ứng dụng: `src/data/msutong/pdf-vocabulary.json`.
- SHA256 tệp nguồn, số trang và tổng từng bài: [manifest](docs/msutong/source-manifest.json).
- Kiểm tra độ bao phủ, sửa nghĩa/gán bài: [báo cáo](docs/msutong-data-audit.json).
- CSV tải trong giao diện: `public/data/msutong-vocabulary.csv`, gồm nguồn trang và ghi chú sửa.

Số trang là vị trí PDF, bắt đầu từ 1. Thứ tự dòng bảng bài học gồm cả các từ thành phần, không phải số thứ tự in sẵn. Một số mép scan bị cắt; những mục chỉ rõ ở phụ lục được giữ nguồn phụ lục. Ví dụ câu và bài đọc cũ được đánh dấu nội dung bổ sung, không tuyên bố trích nguyên văn từ PDF. Các tệp dữ liệu cũ được giữ để tra cứu; 600 mục mở rộng chưa có căn cứ PDF không trộn vào danh mục đã đối chiếu.

Đáng chú ý: bổ sung 很 (quyển 1 bài 3), 们 (bài 1), 垃圾 / 箱 (quyển 4 bài 8); sửa 旅行 về quyển 2 bài 5; tách 号 (số) khỏi 号 (cỡ); sửa nghĩa 人气 từ “ý chí, chí khí” trong bản in thành sự yêu mến/độ nổi tiếng theo ngữ cảnh nhà hàng. Giữ hai cách đọc của 长 và hai nghĩa của 比. Bộ nhớ đợt flashcard dùng phiên bản mới vì thứ tự và số mục thay đổi; ID cũ được giữ khi từ/quyển/bài/pinyin khớp.

Trang giáo trình, flashcard, trắc nghiệm nghĩa/pinyin, phát âm, điền chữ và luyện viết dùng chung danh mục này. Điền chữ và chấm phát âm chấp nhận dạng thay thế và phần tùy chọn trong sách; luyện viết chỉ gửi chữ Hán đến Hanzi Writer.

## Tái tạo và kiểm tra

```bash
npm run audit:msutong
npm run lint
npm run typecheck
npm test
npm run test:browser
npm run build
```

Audit so sánh từng dòng nguồn với danh mục ứng dụng và báo lỗi nếu mất dòng hoặc đổi tổng. Kiểm thử trình duyệt giả lập Supabase; không kiểm chứng kết nối cơ sở dữ liệu thật. PDF đầy đủ không được đưa vào repository.

Kết quả kiểm tra: audit không thiếu dòng nguồn, lint/typecheck/build đạt, 21 kiểm thử Node đạt, 57 tình huống Chromium đạt ở chiều rộng 320px.
