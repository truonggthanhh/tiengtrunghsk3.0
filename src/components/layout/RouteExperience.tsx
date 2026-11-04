import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { practiceModes } from '@/lib/learningNavigation';

export default function RouteExperience() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const initial = useRef(true);
  useEffect(() => {
    const first = initial.current;
    initial.current = false;
    const language = pathname.startsWith('/cantonese') ? 'Quảng Đông' : 'Tiếng Trung';
    const slug = pathname.split('/').at(-1) ?? '';
    const titles: Record<string, string> = { mandarin: 'Học tiếng Trung', cantonese: 'Học tiếng Quảng Đông', notebook: 'Sổ từ cá nhân', lessons: 'Thư viện bài học', songs: 'Học qua bài hát', dictionary: 'Từ điển Trung – Việt', blog: 'Góc đọc', login: 'Đăng nhập', profile: 'Hồ sơ của tôi', 'forgot-password': 'Quên mật khẩu', 'update-password': 'Đặt mật khẩu mới', 'learning-progress': 'Tiến độ học', admin: 'Quản trị', dashboard: 'Quản trị', msutong: 'Giáo trình Msutong' };
    const mode = practiceModes.find(item => item.slug === slug);
    document.title = pathname === '/' ? 'HaoHao · Mỗi ngày một ngôn ngữ mới' : `${titles[slug] ?? mode?.label ?? language} · HaoHao`;
    document.documentElement.lang = 'vi';
    if (first && !hash) return;
    let finished = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const move = () => {
      let anchor = '';
      try { anchor = decodeURIComponent(hash.slice(1)); } catch { /* Ignore malformed anchors. */ }
      const target = hash ? document.getElementById(anchor) : [...document.querySelectorAll<HTMLElement>('main, [role="main"]')].find(element => element.getClientRects().length > 0);
      if (!target || finished) return;
      finished = true;
      if (hash) target.scrollIntoView({ block: 'start', behavior: 'instant' });
      else if (navigationType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' });
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      observer?.disconnect();
      if (timeout) clearTimeout(timeout);
    };
    const observer = new MutationObserver(move);
    observer.observe(document.body, { childList: true, subtree: true });
    move();
    if (!finished) timeout = setTimeout(() => observer?.disconnect(), 5000);
    return () => { observer?.disconnect(); if (timeout) clearTimeout(timeout); };
  }, [pathname, hash, navigationType]);
  return null;
}
