# Rà soát pháp lý và dữ liệu — 06/11/2026

## Phạm vi đã xác nhận

Chủ website cung cấp tên hiển thị **HaoHao**, email **disneychanelmovie@gmail.com**, hiện chưa bán khóa học và chưa phục vụ người dưới 16 tuổi. Đây chưa phải thông tin xác minh pháp nhân, địa chỉ hoặc tư cách kinh doanh. Không tạo thông tin đăng ký kinh doanh, địa chỉ, chứng nhận hay thời hạn giải quyết giả định.

Chính sách công khai: `/legal/terms`, `/legal/privacy`, `/legal/data-processing`, `/legal/storage`, `/legal/contact`. Dùng chung nội dung thực tế cho hai giao diện; giữ đường quay lại đúng ngôn ngữ. Footer và trang đăng nhập liên kết đến chính sách, không yêu cầu đăng nhập để đọc.

## Giới hạn nghiên cứu văn bản

Truy cập trực tiếp `https://vanban.chinhphu.vn/` bị proxy môi trường từ chối **403 CONNECT**. Không có công cụ duyệt/tìm kiếm web hoạt động khác trong phiên này. Vì vậy không tuyên bố đã đọc, kiểm chứng hiệu lực hoặc trích dẫn điều khoản từ văn bản gốc mới nhất. Các số văn bản dưới đây là **danh mục tra cứu sơ bộ theo kiến thức pháp lý**, cần đối chiếu nguồn chính thức trước khi dùng làm kết luận tư vấn pháp lý. Ngày rà soát là 06/11/2026; không chỉ dựa vào Nghị định 13/2023 để kết luận tuân thủ cho năm 2026.

| Chủ đề | Văn bản cần đối chiếu | Phần việc liên quan |
| --- | --- | --- |
| Dữ liệu cá nhân | Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và văn bản hướng dẫn đang có hiệu lực | Thông báo, đồng ý, quyền chủ thể, căn cứ xử lý, dữ liệu trẻ em, lưu giữ, bên xử lý, đánh giá tác động, chuyển dữ liệu ra nước ngoài, sự cố |
| Giao dịch điện tử | Luật Giao dịch điện tử số 20/2023/QH15 và hướng dẫn | Giá trị và chứng cứ của lựa chọn điện tử, hồ sơ phiên bản chính sách |
| Người tiêu dùng | Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15 và hướng dẫn, tùy mô hình thực tế | Minh bạch bên vận hành, khiếu nại, điều kiện giao dịch, điều khoản không được loại trừ quyền bắt buộc |
| Trẻ em và năng lực giao dịch | Luật Trẻ em số 102/2016/QH13; Bộ luật Dân sự số 91/2015/QH13 và quy định dữ liệu hiện hành | Không nhận người dưới 16 theo phạm vi hiện tại; quy trình xác minh/xử lý nếu phát hiện trẻ em; người đại diện khi cần |
| Quyền tác giả | Luật Sở hữu trí tuệ và các sửa đổi, gồm Luật số 07/2022/QH15; văn bản đang có hiệu lực | Quyền khai thác PDF, hình, âm thanh, nội dung luyện tập và dữ liệu dẫn xuất; gỡ nội dung theo yêu cầu hợp lệ |
| Website kinh doanh/giáo dục và an toàn hệ thống | Xác định văn bản thương mại điện tử, giáo dục, an ninh mạng và an toàn thông tin đang có hiệu lực tại ngày vận hành | Phân loại hoạt động, thông báo/đăng ký/giấy phép nếu thuộc diện; nghĩa vụ vận hành và sự cố, không tự mặc định website học miễn phí được miễn mọi nghĩa vụ |

Nguồn cần tra cứu trực tiếp: [Cổng văn bản Chính phủ](https://vanban.chinhphu.vn/), [Cơ sở dữ liệu quốc gia về văn bản pháp luật](https://vbpl.vn/), [Công báo](https://congbao.chinhphu.vn/). Chưa kiểm chứng văn bản hướng dẫn hoặc các sửa đổi mới nhất do giới hạn mạng trên. Không gán số điều, mức phạt, mốc thời hạn hay cơ chế miễn trừ khi chưa kiểm chứng.

## Đối chiếu với mã thực tế

- Mandarin: `src/integrations/supabase/client.ts`; Cantonese: `src/cantonese/integrations/supabase/client.ts` là hai project riêng. Dùng auth, profiles, phân quyền, bảng tiến độ, sổ từ và thành tích. Chính sách không hứa xóa một nơi là xóa cả hai.
- `src/components/auth/EmailPasswordForm.tsx`: email/mật khẩu, tên tự cung cấp; xác nhận điều khoản, xử lý cần thiết và tuổi được tách ô, không chọn sẵn. Metadata tài khoản đăng ký email lưu phiên bản và thời điểm chấp thuận. Metadata này có thể bị người dùng thay đổi, **không phải nhật ký pháp lý bất biến**.
- `src/components/auth/LoginScreen.tsx`: thông báo dữ liệu Google; xác nhận rõ trước khi gọi OAuth. Chưa có bản ghi chấp thuận bền vững gắn tài khoản OAuth ở máy chủ. Không xem việc nhấn đăng nhập tự động là sự đồng ý cho tiếp thị/micro/AI.
- `src/pages/AiTutorPage.tsx` và `src/pages/msutong/AiTutorPage.tsx`: tin nhắn và ngữ cảnh gửi Google Gemini; khóa người dùng nhập có thể lưu `localStorage`. Không tuyên bố khóa chỉ ở bộ nhớ tạm hoặc hội thoại không rời thiết bị.
- Các trang phát âm dùng `SpeechRecognition`, có thể do trình duyệt xử lý từ xa; cần quyền micro do người dùng bật. Không tuyên bố âm thanh luôn xử lý ngoại tuyến.
- `supabase/functions/generate-exercises-v2/index.ts`: tích hợp Anthropic Claude, có gửi phần nội dung bài để tạo bài tập nếu được triển khai/sử dụng. Chưa xác minh cấu hình triển khai thực tế của các edge function.
- Nội dung YouTube nhúng có thể kết nối nhà cung cấp khi tải trình phát. Không tuyên bố mọi bên thứ ba đều bị chặn trước khi người dùng bấm xem.
- localStorage/sessionStorage: phiên, tùy chọn, vị trí học, sổ từ cục bộ, khóa AI ở một số trang. Đăng xuất không đồng nghĩa xóa dữ liệu máy chủ hoặc toàn bộ bộ nhớ cục bộ.
- Không tìm thấy mã pixel quảng cáo riêng trong đợt rà mã; thống kê học tập vẫn là dữ liệu cá nhân, không nhầm với việc không thu thập dữ liệu.
- Chưa có tác vụ xóa toàn bộ dữ liệu theo lịch. Chính sách nêu trạng thái này, không hứa TTL hoặc thời hạn xóa mà hệ thống chưa làm được.

## Việc chủ website cần hoàn tất về vận hành

1. Xác minh và bổ sung thông tin pháp lý thật của bên kiểm soát/vận hành (tên pháp lý, địa chỉ và thông tin theo mô hình áp dụng). Tên thương hiệu và email tạm chưa đủ để kết luận mọi nghĩa vụ công bố đã được đáp ứng.
2. Mở quyền đọc các nguồn pháp luật chính thức, đối chiếu luật và văn bản hướng dẫn hiện hành; nhờ người có chuyên môn rà điều kiện cụ thể. Các trang chính sách không phải chứng nhận tuân thủ.
3. Xác nhận vùng Supabase, log/backup Vercel và Supabase, nhà thầu phụ, hợp đồng xử lý, dữ liệu chuyển ra nước ngoài; đánh giá và lập/nộp các hồ sơ theo nghĩa vụ thực tế. Không thể xác nhận các mục này từ repository.
4. Chốt lịch lưu theo từng loại dữ liệu và thực hiện xóa/ẩn danh tương ứng. Xây quy trình xác minh, xuất và xóa dữ liệu cả hai project, theo dõi email yêu cầu thực tế; không để địa chỉ liên hệ chỉ tồn tại trên trang.
5. Hoàn thiện hồ sơ đồng ý bền vững, có phiên bản và căn cứ cho tất cả cách tạo tài khoản (đặc biệt OAuth), cơ chế rút lại và ghi nhận xử lý yêu cầu. Không dùng metadata tự sửa hoặc ô checkbox phía client làm bằng chứng tuân thủ duy nhất.
6. Có quy trình ứng phó sự cố và thông báo theo luật áp dụng; rà phân quyền, khóa API, bản sao lưu, tài khoản quản trị và việc dùng thiết bị chung.
7. Rà quyền sử dụng giáo trình, nhất là PDF và tài liệu nhà xuất bản. Người dùng tải PDF lên không tự chứng minh bên vận hành có quyền phổ biến công khai. Giữ nguồn và giấy phép dữ liệu cộng đồng; xử lý yêu cầu gỡ hợp lệ.
8. Nếu sau này mở bán, thu phí, quảng cáo theo dõi hoặc phục vụ trẻ em: rà lại mô hình, quy trình, hợp đồng, chính sách và các nghĩa vụ đăng ký/thông báo/xác minh trước khi triển khai. Tự khai đủ 16 tuổi chỉ là xác nhận của người dùng, không phải xác minh tuổi đáng tin cậy.

Không thực hiện thay đổi dữ liệu sản xuất, hợp đồng nhà cung cấp, hồ sơ pháp lý hoặc thủ tục với cơ quan nhà nước trong đợt sửa này.

## Kiểm chứng phần mềm

Lint, TypeScript, build production và 25 kiểm thử Node đạt. Vite còn cảnh báo một số bundle lớn. 70 tình huống Chromium đạt ở chiều rộng 1440px và 320px: danh mục công khai, mở đúng giáo trình, giữ URL cũ, năm trang chính sách, đăng ký không tự chọn đồng ý, Google không được gọi trước xác nhận. Các phản hồi backend được giả lập; không phải thử nghiệm đăng ký/đăng nhập thật hoặc xác nhận cấu hình nhà cung cấp.
