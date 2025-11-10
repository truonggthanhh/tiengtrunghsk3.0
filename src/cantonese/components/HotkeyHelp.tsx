"use client"
export default function HotkeyHelp(){
  return (
    <div className="text-xs text-ink/70 dark:text-ink/80">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <kbd className="px-1.5 py-0.5 border rounded bg-cream dark:bg-black/10">←</kbd>
            <kbd className="px-1.5 py-0.5 border rounded bg-cream dark:bg-black/10">→</kbd>
          </span>
          <span>đổi thẻ / di chuyển</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 border rounded bg-cream dark:bg-black/10">Space</kbd>
          <span>lật thẻ</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 border rounded bg-cream dark:bg-black/10">1..4</kbd>
          <span>chọn đáp án</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 border rounded bg-cream dark:bg-black/10">H</kbd>
          <span>bật/tắt Việt bính</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 border rounded bg-cream dark:bg-black/10">D</kbd>
          <span>Dark/Light</span>
        </div>
      </div>
    </div>
  )
}