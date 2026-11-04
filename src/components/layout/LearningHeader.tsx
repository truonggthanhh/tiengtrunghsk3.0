import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { ArrowRight, BookOpen, BookMarked, ChevronDown, Home, Languages, LogOut, Menu, Moon, Search, Settings2, ShieldCheck, Sun, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { learningClient, useLearningSession } from '@/hooks/useLearningSession';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { useSignOut } from '@/hooks/useSignOut';
import { useRecentLesson } from '@/hooks/useRecentLesson';
import { isLearningLinkActive, learningLinks } from '@/lib/learningNavigation';
import type { LearningLanguage } from '@/lib/auth/navigation';
import { cn } from '@/lib/utils';

interface Props { language: LearningLanguage; pronunciation: boolean; onTogglePronunciation: () => void; }
export default function LearningHeader({ language, pronunciation, onTogglePronunciation }: Props) {
  const base = `/${language}`;
  const isMandarin = language === 'mandarin';
  const { pathname, search: routeSearch, hash } = useLocation();
  const navigate = useNavigate();
  const { session, isLoading } = useLearningSession(language);
  const access = useAdminAccess(learningClient(language), language, session, isLoading);
  const { signOut, pending } = useSignOut(language);
  const { resolvedTheme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = learningLinks(language);
  useRecentLesson(language);
  useEffect(() => { setSearchOpen(false); setMenuOpen(false); }, [pathname, hash]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); setSearchOpen(value => !value); }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const login = `${base}/login?returnUrl=${encodeURIComponent(pathname + routeSearch + hash)}`;
  const rawName: unknown = session?.user.user_metadata?.first_name;
  const name = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : session?.user.email?.split('@')[0] || 'Bạn';
  const navLinks = [links[0], links.find(link => link.href.endsWith('/notebook'))!, links.find(link => link.href.endsWith('/songs'))!, links.find(link => link.href.endsWith('/blog'))!];
  const openLink = (href: string) => { setSearchOpen(false); setMenuOpen(false); navigate(href); };
  return <div className="learning-ui" data-language={language}>
    <a href="#main-content" className="skip-learning-nav" onClick={event => {
      const main = document.querySelector<HTMLElement>('main, [role="main"]');
      if (main) { event.preventDefault(); main.tabIndex = -1; main.focus(); main.scrollIntoView({ block: 'start' }); }
    }}>Đến nội dung chính</a>
    <header className="learning-header">
      <div className="learning-header-inner">
        <Link to={base} className="learning-brand" aria-label={`HaoHao · Trang chủ ${isMandarin ? 'tiếng Trung' : 'tiếng Quảng Đông'}`}>
          <span className="learning-brand-mark" aria-hidden="true">{isMandarin ? '中' : '粵'}</span>
          <span><span className="block text-lg font-extrabold leading-none tracking-tight">haohao<span className="text-primary">.</span></span><span className="mt-1 block text-[10px] font-semibold tracking-wide text-muted-foreground">{isMandarin ? 'TIẾNG TRUNG · HSK' : 'TIẾNG QUẢNG ĐÔNG'}</span></span>
        </Link>
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 xl:flex">
          {navLinks.map(link => <Link key={link.href} to={link.href} aria-current={isLearningLinkActive(link.href, pathname, hash) ? 'page' : undefined} className="learning-nav-link">{link.label === 'Sổ từ cá nhân' ? 'Sổ từ' : link.label}</Link>)}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button variant="outline" className="learning-search-trigger" aria-label="Tìm nhanh tính năng" onClick={() => setSearchOpen(true)}><Search /><span className="hidden lg:inline">Bạn muốn học gì?</span><kbd className="ml-5 hidden rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline">Ctrl K</kbd></Button>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Tùy chọn hiển thị" className="hidden rounded-full sm:inline-flex"><Settings2 /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="learning-ui w-60" data-language={language}>
            <DropdownMenuLabel>Góc học theo ý bạn</DropdownMenuLabel><DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={pronunciation} onCheckedChange={onTogglePronunciation}>Hiện {isMandarin ? 'Pinyin' : 'Jyutping (Việt Bính)'}</DropdownMenuCheckboxItem>
            <DropdownMenuItem onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>{resolvedTheme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}{resolvedTheme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>Theo cài đặt thiết bị</DropdownMenuItem>
            <DropdownMenuSeparator /><DropdownMenuItem asChild><Link to={isMandarin ? '/cantonese' : '/mandarin'}><Languages className="mr-2 h-4 w-4" />Học {isMandarin ? 'tiếng Quảng Đông' : 'tiếng Trung'}</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/">Chọn ngôn ngữ</Link></DropdownMenuItem>
          </DropdownMenuContent></DropdownMenu>
          {isLoading ? <span role="status" aria-label="Đang tải tài khoản" className="h-9 w-9 animate-pulse rounded-full bg-muted" /> : session ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" aria-label={`Tài khoản: ${name}`} className="h-10 rounded-full px-3"><UserRound /><span className="hidden max-w-24 truncate sm:inline">{name}</span><ChevronDown className="hidden sm:block" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="learning-ui w-60" data-language={language}><DropdownMenuLabel className="truncate">Chào {name}!</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link to={`${base}/profile`}><UserRound className="mr-2 h-4 w-4" />Hồ sơ của tôi</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to={`${base}/learning-progress`}><BookOpen className="mr-2 h-4 w-4" />Tiến độ học</Link></DropdownMenuItem>{access.data && <DropdownMenuItem asChild><Link to={`${base}/${isMandarin ? 'admin' : 'dashboard'}`}><ShieldCheck className="mr-2 h-4 w-4" />Quản trị website</Link></DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem disabled={pending} onSelect={event => { event.preventDefault(); void signOut(); }}><LogOut className="mr-2 h-4 w-4" />{pending ? 'Đang đăng xuất…' : 'Đăng xuất'}</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <Button asChild size="sm" className="rounded-full px-4"><Link to={login}>Đăng nhập<ArrowRight className="hidden sm:inline" /></Link></Button>}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger asChild><Button variant="ghost" size="icon" className="rounded-full xl:hidden" aria-label="Mở menu học tập"><Menu /></Button></SheetTrigger><SheetContent className="learning-ui flex w-[min(90vw,380px)] flex-col overflow-y-auto" data-language={language}><SheetHeader className="text-left"><SheetTitle>Không gian học tập</SheetTitle><SheetDescription>{isMandarin ? 'Tiếng Trung phổ thông · HSK' : 'Tiếng Quảng Đông · 粵語'}</SheetDescription></SheetHeader><nav aria-label="Menu học tập" className="mt-6 flex flex-col gap-1"><Link to={base} onClick={() => setMenuOpen(false)} className="learning-mobile-link"><Home className="h-5 w-5" />Trang chủ</Link>{links.map(link => <Link key={link.href} to={link.href} onClick={() => setMenuOpen(false)} aria-current={isLearningLinkActive(link.href, pathname, hash) ? 'page' : undefined} className="learning-mobile-link"><link.icon className="h-5 w-5" /><span><span className="block font-semibold">{link.label}</span><span className="mt-1 block text-xs text-muted-foreground">{link.description}</span></span></Link>)}</nav><div className="mt-4 space-y-2 border-t pt-4 sm:hidden"><Button variant="outline" className="w-full justify-start rounded-xl" aria-pressed={pronunciation} onClick={onTogglePronunciation}><Languages />{pronunciation ? 'Ẩn' : 'Hiện'} {isMandarin ? 'Pinyin' : 'Jyutping'}</Button><Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}><Moon />{resolvedTheme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}</Button></div><div className="mt-auto border-t pt-5"><Link to={isMandarin ? '/cantonese' : '/mandarin'} onClick={() => setMenuOpen(false)} className="learning-mobile-link"><Languages className="h-5 w-5" />Chuyển sang {isMandarin ? 'Quảng Đông' : 'tiếng Trung'}</Link></div></SheetContent></Sheet>
        </div>
      </div>
    </header>
    <nav aria-label="Điều hướng trên điện thoại" className="learning-bottom-nav md:hidden">
      {[{ label: 'Trang chủ', href: base, icon: Home }, { ...links[0], label: 'Học tập' }, { label: 'Sổ từ', href: `${base}/notebook`, icon: BookMarked }].map(link => {
        const active = link.href === base ? pathname === base && !hash : isLearningLinkActive(link.href, pathname, hash) || (link.href === links[0].href && (pathname.includes('/hsk/') || pathname.includes('/practice/') || pathname.includes('/review/')));
        return <Link key={link.href} to={link.href} className={cn('learning-bottom-item', active && 'is-active')} aria-current={active ? 'page' : undefined}><link.icon className="h-5 w-5" /><span>{link.label}</span></Link>;
      })}<button type="button" className="learning-bottom-item" onClick={() => setSearchOpen(true)}><Search className="h-5 w-5" /><span>Tìm nhanh</span></button>
    </nav>
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}><DialogContent className="learning-ui max-w-xl overflow-hidden rounded-2xl p-0" data-language={language}><DialogTitle className="sr-only">Tìm nhanh tính năng</DialogTitle><DialogDescription className="sr-only">Tìm bài học, công cụ và các trang trong website. Dùng phím mũi tên để chọn và Enter để mở.</DialogDescription><Command><CommandInput placeholder="Tìm bài học, sổ từ, bài hát…" aria-label="Tìm tính năng" /><CommandList className="max-h-[60vh]"><CommandEmpty>Chưa tìm thấy. Thử “flashcard”, “sổ từ” hoặc “bài hát”.</CommandEmpty><CommandGroup heading="Không gian học tập">{links.map(link => <CommandItem key={link.href} value={`${link.label} ${link.keywords ?? ''}`} onSelect={() => openLink(link.href)} className="gap-3 px-4 py-3"><link.icon className="h-5 w-5 text-primary" /><span><span className="block font-medium">{link.label}</span><span className="block text-xs text-muted-foreground">{link.description}</span></span><ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" /></CommandItem>)}</CommandGroup>{isMandarin && <CommandGroup heading="Bắt đầu luyện ngay">{[1, 2, 3, 4, 5, 6].map(level => <CommandItem key={level} value={`HSK ${level} flashcard tu vung từ vựng`} onSelect={() => openLink(`/mandarin/hsk/${level}/flashcard`)} className="gap-3 px-4 py-3"><BookOpen className="h-5 w-5 text-primary" />HSK {level} · Flashcard</CommandItem>)}</CommandGroup>}</CommandList><div className="border-t px-4 py-3 text-xs text-muted-foreground">↑↓ để chọn · Enter để mở · Esc để đóng</div></Command></DialogContent></Dialog>
    <div className="learning-mobile-spacer md:hidden" aria-hidden="true" />
  </div>;
}
