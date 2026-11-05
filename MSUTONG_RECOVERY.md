# Msutong: khôi phục truy cập và rà soát dữ liệu

## Đã sửa

- Trang chủ tiếng Trung có khu Msutong riêng, với liên kết chọn sẵn từng quyển. Menu máy tính có mục Msutong; menu điện thoại và tìm nhanh vẫn truy cập được giáo trình.
- Trang giáo trình hiển thị đúng các quyển/bài thực sự có dữ liệu, hỗ trợ chọn nhiều quyển/nhiều bài và chọn tất cả. Các cấp độ chưa có dữ liệu không còn dẫn người học vào bộ bài trống.
- Giữ tương thích với liên kết cũ `level=so-cap&lessonIds=quyen-X-lesson-Y&step=exercise`. Đăng nhập giữ lại quyển đã chọn. Bỏ chọn quyển đồng thời bỏ các bài thuộc quyển đó.
- Liên kết “Tiếp tục học” giữ cả quyển và bài. Trước đây liên kết chỉ lưu đường dẫn, làm rơi `lessonIds` và có thể mở flashcard trống.
- Thay lựa chọn bài trong flashcard sẽ khởi tạo lại đợt hợp lệ. Phím mũi tên không đổi thẻ khi đang nhập tìm kiếm; lưu tiến độ không làm hỏng trang khi trình duyệt chặn localStorage. Thanh điều khiển vừa màn hình nhỏ.
- Trắc nghiệm không dùng một bản dịch/phiên âm khác của cùng chữ Hán làm đáp án sai. Không tự xóa các mục trùng khi chưa đối chiếu nguồn.

## Dữ liệu hiện có — chưa phải bản trích xuất từ PDF vừa gửi

| Quyển | Tệp từ vựng cũ | Tệp mở rộng cũ | Tổng số mục | Bài có dữ liệu |
| --- | ---: | ---: | ---: | ---: |
| 1 | 179 | 150 | 329 | 10 |
| 2 | 191 | 150 | 341 | 10 |
| 3 | 183 | 150 | 333 | 10 |
| 4 | 156 | 150 | 306 | 10 |
| Tổng | 709 | 600 | 1.309 | 40 |

Có 1.309 ID khác nhau và không có lỗi cấu trúc bắt buộc trong dữ liệu hiện có. Có 4 nhóm trùng chữ Hán + pinyin trong cùng bài cần rà soát: `早`, `风景`, `旅行` (quyển 2), `努力` (quyển 3). Số lượng trên không chứng minh đủ từ vựng trong giáo trình; chính tả, nghĩa, phiên âm và vị trí bài vẫn cần đối chiếu PDF.

[Báo cáo theo từng bài và nhóm trùng](docs/msutong-data-audit.json).

## Phần còn chờ tệp có thể đọc được

Cả 4 PDF người dùng gửi đều bị công cụ tải tệp từ chối với thông báo `file exceeds the executor transfer limit of 32 MiB`. Không PDF nào được tải hoặc đọc thành công. Vì vậy chưa thể xác nhận danh sách từ mới, từ mở rộng, tên riêng, số bài hay độ bao phủ của từng PDF. Không thêm từ dựa trên phỏng đoán.

Cần gửi lại PDF được nén hoặc tách theo thứ tự trang thành các phần **dưới 32 MiB mỗi tệp**, giữ chữ đủ rõ. Sau khi đọc được nguồn, cần đối chiếu từng quyển/bài, lưu số trang và thứ tự mục, kiểm tra pinyin/nghĩa, phân biệt từ mới và tên riêng/từ bổ sung, rồi cập nhật dữ liệu dùng chung cho các hoạt động.

## Tái tạo báo cáo và xuất dữ liệu hiện có

```bash
npm run audit:msutong
npm run audit:msutong -- --export /tmp/msutong-existing-vocabulary.csv
```

Script rà cấu trúc/ID, thống kê từng bài và ghi nhóm trùng để đối chiếu. CSV giữ chữ Hán, pinyin, nghĩa, ví dụ, quyển/bài và tệp nguồn. Mọi dòng đều ghi `pdf_verification=pending_pdf_comparison`; đây là bản xuất dữ liệu cũ, không phải kết quả OCR/PDF mới.

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm test
HSK_TEST_WIDTH=320 npm run test:browser
HSK_TEST_WIDTH=1280 npm run test:browser
npm run test:browser
npm run build
```

20 kiểm thử Node; 57 tình huống trình duyệt, gồm chọn đủ 4 quyển/40 bài, khôi phục URL cũ, giữ quyển khi đăng nhập, thay bộ flashcard và tiếp tục học không mất tham số. Kiểm thử đối chiếu khả năng truy xuất với dữ liệu source, không khẳng định độ đầy đủ so với PDF chưa đọc được. Supabase trong bộ kiểm thử trình duyệt được giả lập.
