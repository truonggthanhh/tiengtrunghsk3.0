import { RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toError } from '@/lib/errors';

export default function ContentLoadNotice({ resource, error, retry, pending, cached = false }: { resource: 'bài hát' | 'bài viết'; error: unknown; retry: () => unknown; pending: boolean; cached?: boolean }) {
  const message = toError(error).message;
  const connection = /fetch|network|load failed|kết nối|quá thời gian/i.test(message);
  return <div role={cached ? 'status' : 'alert'} className={cached ? 'mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4' : 'library-empty'}>
    <div>{!cached && <WifiOff className="mx-auto mb-4 h-7 w-7 text-muted-foreground" />}<h2 className={cached ? 'text-sm font-semibold' : 'text-lg font-bold'}>{cached ? `Chưa cập nhật được ${resource}` : `Chưa tải được ${resource}`}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{cached ? 'Đang hiển thị nội dung đã tải trước đó. Bạn có thể tiếp tục xem hoặc thử tải lại.' : connection ? 'Không kết nối được nguồn dữ liệu. Hãy kiểm tra kết nối rồi thử lại.' : 'Máy chủ chưa trả về nội dung. Vui lòng thử lại sau.'}</p></div>
    <Button variant="outline" disabled={pending} className={cached ? 'shrink-0 rounded-full' : 'mt-5 rounded-full'} onClick={() => { void retry(); }}><RefreshCw className={pending ? 'animate-spin' : ''} />{pending ? 'Đang thử lại…' : 'Thử lại'}</Button>
  </div>;
}
