import { toError } from '@/lib/errors';
export function authErrorMessage(error: unknown): string {
  const message = toError(error).message;
  if (/invalid login credentials/i.test(message)) return 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.';
  if (/email not confirmed/i.test(message)) return 'Bạn cần xác nhận email trước khi đăng nhập. Có thể gửi lại email xác nhận bên dưới.';
  if (/already registered/i.test(message)) return 'Email này đã được đăng ký. Hãy chuyển sang đăng nhập.';
  if (/rate limit|too many requests|security purposes/i.test(message)) return 'Bạn thao tác hơi nhanh. Vui lòng chờ một lát rồi thử lại.';
  if (/fetch|network|load failed/i.test(message)) return 'Kết nối bị gián đoạn. Vui lòng kiểm tra mạng rồi thử lại.';
  if (/permission denied|row-level|42501/i.test(message)) return 'Máy chủ chưa cho phép thao tác này. Vui lòng kiểm tra quyền tài khoản hoặc liên hệ quản trị viên.';
  return message;
}
