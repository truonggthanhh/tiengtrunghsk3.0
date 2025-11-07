# 🇨🇳 TIẾNG TRUNG HAOHAO - Nền Tảng Học Tiếng Trung & Luyện Thi HSK

Một nền tảng học tiếng Trung hiện đại với giao diện colorful, tích hợp AI và progress tracking.

![Version](https://img.shields.io/badge/version-3.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e)

---

## ✨ Features

### 🎨 Colorful Modern UI
- 7 beautiful gradient themes (tropical, sunset, ocean, fire, spring, vivid, colorful)
- Smooth animations: float, pulse-glow, gradient-shift
- Colorful shadows and hover effects
- Glass morphism design
- Responsive mobile-friendly layout

### 🔤 Pinyin Toggle
- Global toggle button trong header
- Persistent settings với localStorage
- Hiển thị/ẩn pinyin trong tất cả exercises
- Colorful gradient button

### 👤 User Authentication
- Email/Password authentication
- Google OAuth integration
- Protected routes
- Session management
- Automatic profile creation

### 📊 Progress Tracking
- Tự động lưu progress mỗi vocabulary item
- Aggregated statistics per exercise type
- Accuracy tracking và word mastery
- Profile page với detailed stats
- Visual progress bars

### 👥 Admin Panel
- User management dashboard
- Toggle admin status
- View all user progress
- Colorful gradient design

### 🎓 Learning Features
- **6 HSK Levels** (1-6)
- **9 Exercise Types**:
  - Flashcard
  - Chọn Pinyin
  - Chọn Nghĩa
  - Điền Từ
  - Điền Từ Vào Câu
  - Sắp Xếp Câu
  - Luyện Phát Âm
  - Luyện Viết Chữ Hán
  - AI Tutor
- **Msutong Textbook Support** (4 books)
- **5000+ Vocabulary Words**

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18
npm or yarn
Supabase account
```

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/tiengtrunghsk3.0.git

# Install dependencies
cd tiengtrunghsk3.0
npm install

# Start development server
npm run dev
```

### Setup (5 phút)

**📖 Xem hướng dẫn chi tiết:** [QUICK_START.md](./QUICK_START.md)

**Quick summary:**
1. Enable Google OAuth (optional) trong Supabase
2. Configure Site URLs
3. Đăng ký account đầu tiên
4. Set admin quyền bằng SQL
5. Test features ✅

---

## 📚 Documentation

### Setup Guides
- **[QUICK_START.md](./QUICK_START.md)** - ⚡ Hướng dẫn nhanh 5 phút
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - 📚 Hướng dẫn đầy đủ từ A-Z
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - 🗄️ Database schema và SQL
- **[SET_ADMIN.sql](./SET_ADMIN.sql)** - 👑 SQL scripts set admin
- **[SITE_URLS.md](./SITE_URLS.md)** - 🌐 URLs configuration

### Key Features Docs
- Authentication: Email/Password + Google OAuth
- Progress Tracking: Auto-save và stats
- Admin Panel: User management
- Pinyin Toggle: Global state với Context API

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **React Router** - Routing

### Backend & Database
- **Supabase** - Backend as a Service
  - Authentication (Email + Google OAuth)
  - PostgreSQL Database
  - Row Level Security
  - Realtime subscriptions

### State Management
- **React Context** - Global state (Pinyin toggle)
- **Custom Hooks** - Progress tracking

### Key Libraries
- `@supabase/supabase-js` - Supabase client
- `@supabase/auth-ui-react` - Auth UI components
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `@tanstack/react-query` - Data fetching

---

## 📁 Project Structure

```
tiengtrunghsk3.0/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.tsx       # Header với Pinyin toggle
│   │   ├── Flashcard.tsx    # Flashcard component
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Homepage
│   │   ├── Login.tsx        # Login/Register
│   │   ├── ProfilePage.tsx  # User profile & progress
│   │   ├── AdminDashboardPage.tsx  # Admin panel
│   │   └── ...
│   ├── contexts/            # React Contexts
│   │   └── PinyinContext.tsx  # Pinyin toggle state
│   ├── hooks/               # Custom hooks
│   │   └── useProgressTracking.ts  # Progress tracking
│   ├── data/                # Vocabulary data
│   │   ├── hsk1.ts - hsk6.ts
│   │   └── msutong/
│   ├── integrations/
│   │   └── supabase/
│   │       └── client.ts    # Supabase config
│   └── globals.css          # Global styles + gradients
├── QUICK_START.md           # Quick setup guide
├── SETUP_GUIDE.md           # Detailed setup
├── DATABASE_SETUP.md        # Database schemas
├── SET_ADMIN.sql            # Admin SQL scripts
├── SITE_URLS.md             # URLs config
└── README.md                # This file
```

---

## 🎨 Color Palette

### Gradients
```css
bg-gradient-tropical    /* Pink → Cyan → Green */
bg-gradient-sunset      /* Pink → Yellow */
bg-gradient-ocean       /* Deep Blue → Cyan */
bg-gradient-fire        /* Pink → Red */
bg-gradient-spring      /* Blue → Cyan */
bg-gradient-vivid       /* Pink → Red → Orange */
bg-gradient-colorful    /* Purple → Violet */
```

### Animations
```css
animate-gradient        /* Background shift */
animate-float          /* Float up/down */
animate-pulse-glow     /* Glow pulse */
hover-scale            /* Scale on hover */
```

---

## 🔐 Security

### Authentication
- Supabase Auth với email verification
- Google OAuth integration
- Secure session management
- Protected routes

### Database
- Row Level Security (RLS) policies
- Users can only access their own data
- Admins have elevated permissions
- Secure password hashing

### Best Practices
- Environment variables for secrets
- HTTPS only in production
- CSRF protection
- XSS prevention

---

## 📊 Database Schema

### Tables
1. **profiles** - User profiles
   - id, first_name, last_name, is_admin

2. **user_progress** - Individual vocabulary progress
   - user_id, vocabulary_id, exercise_type, level
   - is_correct, attempts, last_practiced_at

3. **user_exercise_stats** - Aggregated statistics
   - user_id, exercise_type, level
   - total_attempts, correct_answers, words_mastered

📖 **Full schema:** [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Post-Deployment
1. Update Site URLs trong Supabase
2. Add production redirect URLs
3. Enable email confirmation
4. Test authentication flow

📖 **Full guide:** [SITE_URLS.md](./SITE_URLS.md)

---

## 🧪 Testing

### Manual Testing
```bash
# Start dev server
npm run dev

# Test checklist:
- Login với Email/Password ✅
- Login với Google ✅
- Pinyin toggle ✅
- Profile page & progress ✅
- Admin panel ✅
- All exercise types ✅
```

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 Changelog

### v3.0 (Latest)
- ✨ Colorful UI redesign với 7 gradients
- 🔤 Pinyin toggle feature
- 👤 User authentication system
- 📊 Progress tracking với database
- 👥 Admin panel
- 📈 Profile page với stats

### v2.0
- 9 exercise types
- Msutong textbook support
- AI Tutor integration
- Handwriting practice

### v1.0
- Initial release
- Basic flashcard functionality
- HSK 1-6 vocabulary

---

## 📄 License

MIT License - feel free to use for your own projects!

---

## 👨‍💻 Author

**TIẾNG TRUNG HAOHAO Team**

---

## 🙏 Acknowledgments

- HSK 3.0 vocabulary data
- Msutong textbook series
- Supabase for awesome BaaS
- Shadcn/ui for beautiful components
- Tailwind CSS for styling

---

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/tiengtrunghsk3.0/issues)
- 📚 Docs: See documentation files above

---

**🎉 Happy Learning Chinese! 学中文快乐！**

---

## 🔗 Quick Links

- [Quick Start Guide](./QUICK_START.md) - Start in 5 minutes
- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Database Setup](./DATABASE_SETUP.md) - Database schemas
- [Set Admin](./SET_ADMIN.sql) - Admin SQL scripts
- [Site URLs](./SITE_URLS.md) - URLs configuration

---

**Built with ❤️ and lots of ☕**
