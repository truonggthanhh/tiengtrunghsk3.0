# Thư viện bài luyện và giáo trình cộng đồng

## Nội dung bổ sung

Đợt này thêm **534 câu gốc**, chia cụm từ để sắp xếp, có pinyin và nghĩa Việt; **89 đoạn đọc gốc với 178 câu hỏi**. Các câu này được biên soạn cho luyện tập, không gán là trích nguyên văn giáo trình. Hai trường hợp đổi vị trí trạng ngữ thời gian có đáp án thay thế được khai báo rõ.

- Msutong: thêm 6 câu cho mỗi bài trung cấp và cao cấp (80 bài), cùng 42 câu và 7 bài đọc để lấp các khoảng thiếu ở sơ cấp. Cộng với dữ liệu có sẵn, cả **120 bài** có ít nhất 6 câu khác nhau và có đọc hiểu.
- HSK Standard Course: thêm 12 câu và 2 đoạn đọc cho nhóm từ bổ sung và một bài còn ít câu.
- Cả **277 bài/nhóm bài** trong sáu danh mục đều có ít nhất 6 câu để hoàn thành và sắp xếp. Nguồn cộng đồng dùng lại các ví dụ phù hợp đã có trong thư viện khi từ mục tiêu khớp chính xác. Không tự nhận đã có đoạn đọc riêng cho mọi bài của các bộ mới.
- Chọn nghĩa và phiên âm dùng toàn bộ từ vựng theo quyển/bài, không phụ thuộc vào việc có câu ví dụ.

Xem [độ bao phủ từng bài](practice-coverage.json). Bộ kiểm tra xác nhận không trùng ID giữa các danh mục, không có trường rỗng, câu có đúng một vị trí từ mục tiêu, cụm ghép lại thành đáp án và mọi bài Msutong có đọc hiểu.

## Phạm vi ba bộ mới

| Danh mục | Phạm vi nguồn thực có | Mục học | Bài/nhóm |
| --- | --- | ---: | ---: |
| Boya | Sơ cấp II, bản 2 | 836 | 25 |
| Giáo trình Hán ngữ | Quyển 2, tệp cộng đồng `初级第二册上`, chưa xác nhận lần xuất bản | 1.046 | 25 |
| Giáo trình chuẩn HSK | HSK 1, 2, 3, 4 tập 1–2, 5 tập 1–2 | 2.914 | 107 |
| Tổng | 9 quyển/tập từ cộng đồng | 4.796 | 157 |

Đây là danh sách từ theo bài của cộng đồng, chưa được đối chiếu độc lập từng dòng với PDF. Chưa bao gồm các quyển Boya/Hán ngữ khác hoặc HSK 6. Giao diện ghi rõ phạm vi và liên kết nguồn. Không nhập ảnh, âm thanh, bài khóa hoặc bài tập nguyên bản của các nhà xuất bản.

Website `xiehanzi.com` trả lỗi proxy `403 CONNECT` trong môi trường hiện tại. Vì vậy dữ liệu này được lấy từ các kho công khai bên dưới, không tuyên bố đã sao chép hoặc kiểm chứng trực tiếp thư viện của xiehanzi.com. Bản nháp quyền mạng đã được chuẩn bị; phải lưu/publish cấu hình môi trường trước khi có thể đối chiếu trang đó.

### Nguồn và bản dịch

1. [jay-pee/BoyaChinese_Elementary_II_Vocabulary_List](https://github.com/jay-pee/BoyaChinese_Elementary_II_Vocabulary_List): danh sách chữ, pinyin dạng số, nghĩa Anh và chương. Nguồn công bố GPL-3.0. Bản CSV gốc và giấy phép được cung cấp ở `public/data/textbooks/boya-source.csv` và `LICENSE-boya.txt`. Dữ liệu Boya dẫn xuất giữ giấy phép GPL-3.0; thay đổi gồm chuẩn hóa phiên âm, sửa dòng lỗi và thêm nghĩa Việt.
2. [kevinstadler/pleco-flashcards](https://github.com/kevinstadler/pleco-flashcards): danh sách Hán ngữ quyển 2 theo chương, chỉ có chữ và cách đọc. Kho không công bố LICENSE riêng; chỉ nhập các trường từ vựng thực tế, không nhập tài liệu hướng dẫn, hình hoặc phần mềm.
3. [joelypoley/hsk_standard_course_vocab](https://github.com/joelypoley/hsk_standard_course_vocab): bảng từ theo bài của HSK Standard Course. Nguồn tự ghi là công việc đang tiếp tục, không bảo đảm mọi dòng đã hiệu đính; chưa có HSK 6. Kho không công bố LICENSE riêng. Chỉ nhập các trường từ vựng, không sao chép nội dung bài khóa.

Nghĩa Việt lấy từ kho từ đã có khi khớp từ, hoặc được biên soạn tại `src/data/textbooks/vietnamese-glosses.tsv`. Tên riêng chưa có tên Việt được ghi là tên riêng kèm cách đọc. Không để nghĩa Anh hoặc mục không có nghĩa xuất hiện dưới nhãn nghĩa Việt. Từng thẻ giữ URL, tên tệp và thứ tự dòng trong tập nguồn chuẩn hóa.

Các đầu vào chuẩn hóa nằm ở `src/data/textbooks/source-rows.json`; [manifest](source-manifest.json) lưu checksum các tệp tải về để phân biệt phiên bản. Có 2 lần lặp được gộp trong cùng bài và cách đọc; [báo cáo nhập](import-audit.json) ghi số dòng và tổng sau gộp.

### Sửa lỗi rõ ràng trong nguồn

- Boya: dòng 农村 bị lệch cột, mã chương nằm trong cột nghĩa. Khôi phục về chương 10 trước khi chuẩn hóa.
- Hán ngữ: 岀 được chuẩn hóa thành 出. Hai dòng trùng cùng cách đọc được nhận diện khi nhập.
- HSK: dùng mã bài trong `Unique Key` để tránh `5.1` bị hiểu là bài 1 thay vì bài 10; `5.2` thành bài 20. Các mục không ghi bài được giữ ở nhóm “Từ bổ sung cuối sách”, không gán tùy ý vào bài học.
- Sửa chữ OCR: エ人 → 工人, 只有……オ…… → 只有……才……, 尽(カ) → 尽(力), 知感 → 质感, 蒙胧 → 朦胧; chuẩn hóa 內容、何況、丟、賞心悅目、贏 sang giản thể tương ứng. Trường `originalHanzi` vẫn giữ chữ đầu vào.
- Chuẩn hóa thanh nhẹ 5/0 và các âm tiết có gạch nối mà bộ chuyển đổi không xử lý cả chuỗi; hiệu đính cụ thể 面积、出来、起来、结果.

## Cách chạy

```bash
npm run build:textbook-library
npm run build:practice-library
npm run audit:practice-library
npm run audit:msutong
npm run audit:msutong-intermediate
npm run audit:msutong-advanced
npm run lint
npm run typecheck
npm test
npm run test:browser
npm run build
```

JSON ví dụ/đoạn đọc được tách khỏi bản trích từ PDF để tái tạo dữ liệu không làm mất nguồn gốc. Mã quyển/bài trong URL cũ được giữ để các hoạt động cùng dùng bộ điều hợp; tên danh mục và nhãn trong giao diện theo giáo trình được chọn. CSV từng giáo trình tải được trực tiếp từ trang chọn bài.

## Kiểm chứng bản thay đổi

- Hai script dựng dữ liệu và kiểm tra độ bao phủ: 534 câu, 89 đoạn đọc, 178 câu hỏi; 4.796 mục từ cộng đồng; 8.199 thẻ thuộc 277 bài/nhóm, không có lỗi kiểm tra cấu trúc.
- Ba bộ kiểm tra PDF giữ nguyên 812 / 1.076 / 1.515 thẻ; cao cấp đủ 240 bảng.
- Lint, TypeScript, build production và 25 kiểm thử Node đều đạt. Vite vẫn cảnh báo kích thước một số bundle lớn.
- 65 tình huống Chromium đạt ở cả chiều rộng 1440px và 320px, bao gồm chọn ba bộ mới, câu điền từ, ghép cụm từ và đọc hiểu. Các phản hồi backend trong kiểm thử được giả lập; chưa kiểm tra kết nối nhà cung cấp AI thực tế.

Kiểm tra tự động bảo đảm cấu trúc và độ bao phủ, không thay thế việc giáo viên hiệu đính mọi câu hoặc đối chiếu danh sách cộng đồng với sách gốc.
