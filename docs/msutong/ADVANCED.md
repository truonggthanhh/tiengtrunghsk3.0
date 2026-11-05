# Msutong cao cấp — 4 quyển

Nguồn là bốn PDF người dùng gửi, tổng 518 trang. Không đưa toàn bộ PDF hoặc OCR toàn sách vào Git. SHA256 và số trang gốc nằm trong [manifest](advanced-source-manifest.json).

Đã xem ảnh và chép từng bảng `关键词语`: **40 bài × 6 bảng = 240 bảng**, gồm **1.410 mục xuất hiện**. Tính cả dòng từ thành phần thụt vào, không chỉ các dòng đánh số. Bảng từ cuối sách được rà để bổ sung mục ngoài bảng bài học; 107 dòng đối chiếu phụ lục được lưu riêng, trong đó 1 dòng xác nhận lại một mục đã có. Gộp cùng chữ Hán và cách đọc trong cùng bài, giữ các nghĩa và mọi vị trí nguồn; những lần xuất hiện ở bài khác vẫn là thẻ riêng.

| Quyển | Bảng | Mục trong bảng bài học | Dòng đối chiếu phụ lục | Thẻ học |
| --- | ---: | ---: | ---: | ---: |
| 1 | 60 | 393 | 52 | 443 |
| 2 | 60 | 390 | 18 | 408 |
| 3 | 60 | 313 | 25 | 338 |
| 4 | 60 | 314 | 12 | 326 |
| Tổng | 240 | 1.410 | 107 | 1.515 |

Phạm vi là các mục trong bảng từ vựng và phụ lục từ vựng. Không biến mọi từ xuất hiện trong bài đọc, lời dẫn, bài tập hoặc đáp án thành mục từ mới. Không tự tạo bài khóa hoặc câu ví dụ rồi gán là nội dung sách.

## Chữ Hán, cách đọc và nghĩa

- Chữ Hán, pinyin và nghĩa của từng bảng được đối chiếu ảnh PDF; không lấy nguyên OCR bị lỗi. Giữ các từ đa âm, thanh nhẹ, 儿, thành ngữ và mẫu có chỗ trống. `V得了/V不了` và `AA制` có ký hiệu Latin hợp lệ, không phải pinyin lẫn vào trường chữ Hán.
- Quyển 1, 3, 4: nghĩa Việt được hiệu đính/rút gọn từ bảng nguồn (`reviewed-source-vietnamese`).
- Quyển 2: sách dùng nghĩa Anh. Giữ nguyên nghĩa Anh từng dòng trong `sources[].originalMeaning`; nghĩa Việt dịch cho hoạt động học có nhãn `translated-from-source-english`.
- Các mục chỉ có trong phụ lục không có nghĩa đi kèm: nghĩa Việt biên soạn, nhãn `editorial-vietnamese`. Ví dụ: 志愿者, 集约农业. Flashcard hiển thị chú thích nguồn bản dịch.
- Quyển 2 bài 6 bảng 2 in `门卫` với nghĩa `goal keeper`. Giữ chữ nguồn và ghi rõ “thủ môn (trong bài này)”; cách gọi thủ môn thông dụng là 门将/守门员, còn 门卫 thường là người gác cổng.
- Không gán độ chính xác tuyệt đối cho OCR. Những bảng OCR mất số thứ tự vẫn được đọc ảnh đến dòng cuối: ví dụ quyển 1 trang 48 có đủ 8 mục tới 营养; quyển 1 trang 60 tới 居然; quyển 3 trang 79 có 6 mục; quyển 4 trang 107 có 申报.

## Nguồn có thể kiểm tra lại

- `src/data/msutong/advanced-reviewed/bookN.tsv`: tiêu đề `@bài bảng trang-PDF`; dòng `chữ Hán|pinyin|nghĩa Việt[|nghĩa Anh gốc]`. `row` là thứ tự mục trong bảng, tính cả dòng từ thành phần.
- `bookN-index.tsv`: `bài|trang-PDF|chữ Hán|pinyin|nghĩa Việt`. `row` là thứ tự dòng đã lưu trên trang phụ lục, không phải số dòng in trên trang.
- [Manifest](advanced-source-manifest.json): vị trí và số mục kỳ vọng của từng bảng, đếm từ ảnh, không dùng số thứ tự OCR.
- [Audit](advanced-data-audit.json): tổng từng quyển/bài, đối chiếu đủ 240 bảng, đối chiếu từng dòng nguồn với JSON, phát hiện nguồn thừa/thiếu và ID trùng cả ba cấp.
- `src/data/msutong/advanced-vocabulary.json`: dữ liệu chạy trong ứng dụng.
- `public/data/msutong-advanced-vocabulary.csv`: CSV UTF-8 có BOM, đầy đủ nguồn và bản dịch để giáo viên kiểm tra hoặc nhập vào công cụ khác.

## Sử dụng và kiểm tra

Chọn **Cao cấp** tại `/mandarin/msutong?level=cao-cap`. Có 4 quyển, mỗi quyển 10 bài. Chọn nhiều quyển/bài để học flashcard, chọn nghĩa, chọn pinyin, điền từ, phát âm và viết chữ. Trang chủ có liên kết cho cả 12 quyển của ba cấp. Liên kết tiếp tục học và dữ liệu tiến độ giữ cấp độ riêng.

Mặt trước flashcard chỉ hiện trường chữ Hán; pinyin ở mặt đáp án theo thiết lập hiển thị. Chú thích có trang PDF và bảng nguồn. Luyện phát âm bỏ mẫu có ký hiệu chỗ trống; các mẫu đó vẫn có trong flashcard và hoạt động từ vựng. Viết chữ chỉ luyện ký tự Hán. Hoạt động câu/đọc hiểu chỉ mở khi có dữ liệu tương ứng.

```bash
npm run build:msutong-advanced
npm run audit:msutong-advanced
npm run audit:msutong
npm run audit:msutong-intermediate
npm run lint
npm run typecheck
npm test
npm run test:browser
npm run build
```

Kiểm thử trình duyệt dùng Supabase giả lập để kiểm tra giao diện và luồng chọn bài; không kiểm chứng cơ sở dữ liệu hoặc dịch vụ nhận dạng giọng nói thật.

Kết quả kiểm tra: audit cả ba cấp không có lỗi; lint, typecheck và 23 kiểm thử Node đạt; 61 tình huống Chromium đạt ở chiều rộng 1440px và 320px.
