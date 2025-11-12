# 🔐 HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG KHÓA/MỞ KHÓA KHÓA HỌC

## 📋 Tổng quan

Hệ thống này cho phép admin quản lý quyền truy cập của users vào các khóa học:
- **Mandarin**: HSK 1-6, Msutong 1-4
- **Cantonese**: Lesson 1-20

Mặc định: TẤT CẢ khóa học đều **BỊ KHÓA**. Admin phải mở khóa thủ công.

---

## 🚀 BƯỚC 1: Setup Database

### 1.1 Chạy SQL Schema

**File:** `COURSE_ACCESS_CONTROL_SCHEMA.sql`

**Trên Supabase Dashboard:**

1. Mở **Mandarin Project**: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
2. Click: SQL Editor → New Query
3. Copy toàn bộ nội dung `COURSE_ACCESS_CONTROL_SCHEMA.sql`
4. Paste vào editor
5. Click "Run" hoặc Ctrl+Enter

6. Lặp lại cho **Cantonese Project**: https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs

**Kết quả:**
- ✅ Table `user_course_access` được tạo
- ✅ 5 Functions được tạo:
  - `check_course_access()`
  - `unlock_course_for_user()`
  - `lock_course_for_user()`
  - `get_user_course_access()`
  - `bulk_unlock_courses()`
- ✅ RLS Policies được enable

---

## 🎨 BƯỚC 2: Integrate Admin UI

### 2.1 Add Tab vào Mandarin Admin Dashboard

**File:** `src/pages/AdminDashboardPage.tsx`

Tìm dòng có `<Tabs>` và thêm tab mới:

```tsx
import { CourseAccessManagement } from '@/components/admin/CourseAccessManagement';

// Trong component, thêm tab trigger:
<TabsList>
  <TabsTrigger value="users">Người dùng</TabsTrigger>
  <TabsTrigger value="api">API Key</TabsTrigger>
  <TabsTrigger value="ai">AI Content</TabsTrigger>
  <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
  <TabsTrigger value="courseaccess">🔐 Khóa học</TabsTrigger> {/* MỚI */}
</TabsList>

// Thêm tab content:
<TabsContent value="courseaccess">
  <CourseAccessManagement />
</TabsContent>
```

### 2.2 Add Tab vào Cantonese Dashboard

Tương tự, tạo file `/src/cantonese/components/admin/CourseAccessManagement.tsx` (copy từ Mandarin version nhưng đổi imports):

```tsx
// Đổi imports
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useCourseAccess } from '@/cantonese/hooks/useCourseAccess';

// Chỉ hiển thị Cantonese lessons
const ALL_COURSES = Array.from({ length: 20 }, (_, i) => `cantonese_lesson_${i + 1}`);
```

Sau đó integrate vào `src/cantonese/pages/Dashboard.tsx`.

---

## 🔒 BƯỚC 3: Add Access Control vào Routes

### 3.1 Mandarin Index Page

**File:** `src/pages/Index.tsx`

```tsx
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { Lock } from 'lucide-react';

const Index = () => {
  // ... existing code

  // Check access cho HSK levels
  const { data: hsk1Access } = useCourseAccess('hsk_1');
  const { data: hsk2Access } = useCourseAccess('hsk_2');
  // ... repeat for all levels

  return (
    <div>
      {/* HSK 1 Card */}
      <Card className={!hsk1Access?.hasAccess ? 'opacity-50 relative' : ''}>
        {!hsk1Access?.hasAccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
            <div className="text-center text-white">
              <Lock className="w-12 h-12 mx-auto mb-2" />
              <p className="font-bold">Khóa học bị khóa</p>
              <p className="text-sm">Liên hệ admin để mở khóa</p>
            </div>
          </div>
        )}

        {/* Existing card content */}
        <CardTitle>HSK 1</CardTitle>
        <Button
          disabled={!hsk1Access?.hasAccess}
          onClick={() => navigate('/mandarin/hsk/1/flashcard')}
        >
          Bắt đầu học
        </Button>
      </Card>
    </div>
  );
};
```

### 3.2 Mandarin Route Protection

**File:** `src/App.tsx`

Tạo ProtectedRoute component:

```tsx
// src/components/ProtectedRoute.tsx
import { useCourseAccess, CourseType } from '@/hooks/useCourseAccess';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  courseType: CourseType;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ courseType, children }) => {
  const { data: access, isLoading } = useCourseAccess(courseType);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Đang kiểm tra quyền truy cập...</div>;
  }

  if (!access?.hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Lock className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Khóa học bị khóa</h1>
        <p className="text-gray-600 mb-4">Bạn chưa có quyền truy cập vào khóa học này.</p>
        <p className="text-sm text-gray-500">Liên hệ admin để được mở khóa.</p>
      </div>
    );
  }

  return <>{children}</>;
};
```

Sử dụng trong App.tsx:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Wrap routes cần protect
<Route
  path="hsk/:level/flashcard"
  element={
    <ProtectedRoute courseType={`hsk_${level}` as CourseType}>
      <SessionContextProvider>
        <PinyinProvider>
          <FlashcardPage />
        </PinyinProvider>
      </SessionContextProvider>
    </ProtectedRoute>
  }
/>
```

**LƯU Ý:** Cần dynamic courseType dựa trên `:level` param. Có thể tạo wrapper component:

```tsx
const ProtectedHSKRoute = ({ level }: { level: string }) => {
  return (
    <ProtectedRoute courseType={`hsk_${level}` as CourseType}>
      <FlashcardPage />
    </ProtectedRoute>
  );
};
```

### 3.3 Cantonese Lessons Protection

**File:** `src/cantonese/pages/Lessons.tsx`

```tsx
import { useAllLessonsWithAccess } from '@/cantonese/hooks/useCourseAccess';
import { Lock, Unlock } from 'lucide-react';

const Lessons = () => {
  const lessonsWithAccess = useAllLessonsWithAccess();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessonsWithAccess.map(lesson => (
        <Card key={lesson.lessonNumber} className={!lesson.isUnlocked ? 'opacity-60' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Bài {lesson.lessonNumber}</span>
              {lesson.isUnlocked ? (
                <Unlock className="w-5 h-5 text-green-600" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              disabled={!lesson.isUnlocked}
              onClick={() => navigate(`/cantonese/lessons/${lesson.lessonNumber}`)}
            >
              {lesson.isUnlocked ? 'Học ngay' : 'Bị khóa'}
            </Button>
            {!lesson.isUnlocked && (
              <p className="text-sm text-gray-500 mt-2">
                Liên hệ admin để mở khóa
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

**File:** `src/cantonese/pages/LessonDetail.tsx`

Protect chi tiết lesson:

```tsx
import { useCourseAccess } from '@/cantonese/hooks/useCourseAccess';
import { useParams, Navigate } from 'react-router-dom';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const { data: access, isLoading } = useCourseAccess(`cantonese_lesson_${lessonId}` as any);

  if (isLoading) return <div>Đang kiểm tra...</div>;

  if (!access?.hasAccess) {
    return <Navigate to="/cantonese/lessons" replace />;
  }

  // Render lesson detail
  return <div>...</div>;
};
```

---

## 🧪 BƯỚC 4: Testing

### 4.1 Test Admin Functions

1. **Login as Admin**
2. **Go to Admin Dashboard** → Tab "🔐 Khóa học"
3. **Search user** bằng email
4. **Click user** → Xem danh sách courses
5. **Test unlock/lock**:
   - Click "Mở khóa" cho HSK 1
   - Verify badge chuyển từ "Bị khóa" → "Đã mở"
   - Click "Khóa lại"
   - Verify chuyển về "Bị khóa"

6. **Test bulk unlock**:
   - Click "Tất cả HSK 1-6"
   - Verify tất cả HSK đều được unlock
   - Check notes được lưu

### 4.2 Test User Access

1. **Logout admin**
2. **Login as regular user**
3. **Go to Mandarin Index**
   - Verify: Tất cả HSK cards có icon Lock
   - Verify: Buttons bị disabled
   - Verify: Hiển thị message "Khóa học bị khóa"

4. **Admin unlock HSK 1 cho user này**
5. **Refresh page**
   - Verify: HSK 1 card không còn locked
   - Verify: Button "Bắt đầu học" hoạt động
   - Verify: Có thể vào `/mandarin/hsk/1/flashcard`

6. **Try truy cập HSK 2** (chưa unlock):
   - Type URL: `/mandarin/hsk/2/flashcard`
   - Verify: Redirect hoặc hiển thị "Access Denied"

7. **Test Cantonese**:
   - Go to `/cantonese/lessons`
   - Verify: Tất cả 20 bài đều locked
   - Admin unlock Lesson 1
   - Refresh
   - Verify: Lesson 1 có thể truy cập
   - Verify: Lesson 2-20 vẫn locked

---

## 📊 BƯỚC 5: Verify Database

### 5.1 Check Table

```sql
-- View tất cả access records
SELECT
  p.email,
  uca.course_type,
  uca.is_unlocked,
  uca.unlocked_at,
  uca.notes
FROM user_course_access uca
JOIN profiles p ON p.id = uca.user_id
ORDER BY p.email, uca.course_type;
```

### 5.2 Test Functions

```sql
-- Test check access
SELECT check_course_access(
  'user-uuid-here'::uuid,
  'hsk_1'
);
-- Should return: false (nếu chưa unlock)

-- Test unlock
SELECT unlock_course_for_user(
  'user-uuid-here'::uuid,
  'hsk_1',
  'admin-uuid-here'::uuid,
  'Test unlock'
);

-- Check lại
SELECT check_course_access(
  'user-uuid-here'::uuid,
  'hsk_1'
);
-- Should return: true
```

---

## 🎯 BƯỚC 6: User Experience Flow

### Flow 1: User mới đăng ký

```
1. User đăng ký account
2. User login thành công
3. User vào Mandarin Index
   → Thấy tất cả HSK bị khóa
4. User thử click "Bắt đầu học HSK 1"
   → Button disabled
   → Message: "Liên hệ admin để mở khóa"
5. User liên hệ admin (email, chat, etc.)
6. Admin login → Dashboard → Tab "Khóa học"
7. Admin search user bằng email
8. Admin click "Mở khóa" cho HSK 1
9. User refresh page
   → HSK 1 đã mở khóa!
   → Có thể học bình thường
```

### Flow 2: Admin mở khóa hàng loạt

```
1. Admin login → Dashboard → "Khóa học"
2. Search user: "student@example.com"
3. Click "Tất cả HSK 1-6"
4. Nhập notes: "Học viên VIP - Gói 6 tháng"
5. Click button
   → Toast: "Đã mở khóa nhiều khóa học"
6. Verify: Tất cả HSK 1-6 đều có badge "Đã mở"
7. User có thể truy cập tất cả HSK ngay lập tức
```

---

## 📝 COURSE TYPE DEFINITIONS

### Mandarin

```typescript
// HSK Levels
'hsk_1'  // HSK 1
'hsk_2'  // HSK 2
'hsk_3'  // HSK 3
'hsk_4'  // HSK 4
'hsk_5'  // HSK 5
'hsk_6'  // HSK 6

// Msutong
'msutong_1'  // Msutong Sơ Cấp 1
'msutong_2'  // Msutong Sơ Cấp 2
'msutong_3'  // Msutong Sơ Cấp 3
'msutong_4'  // Msutong Sơ Cấp 4
```

### Cantonese

```typescript
'cantonese_lesson_1'   // Bài 1
'cantonese_lesson_2'   // Bài 2
...
'cantonese_lesson_20'  // Bài 20
```

---

## 🐛 Troubleshooting

### Lỗi: "Only admins can unlock courses"

**Nguyên nhân:** User hiện tại không phải admin

**Fix:**
```sql
-- Check role
SELECT id, email, role FROM profiles WHERE email = 'your-email';

-- Set admin
UPDATE profiles SET role = 'admin' WHERE email = 'your-email';
```

### Lỗi: "Function check_course_access does not exist"

**Nguyên nhân:** Chưa chạy SQL schema

**Fix:** Chạy lại `COURSE_ACCESS_CONTROL_SCHEMA.sql`

### Lỗi: "Admin luôn thấy mở khóa dù chưa unlock"

**Đây KHÔNG PHẢI lỗi!** Admin luôn có quyền truy cập tất cả courses.

**Verify:** Test với regular user (không phải admin).

### Course vẫn accessible dù đã lock

**Nguyên nhân:** Cache

**Fix:**
1. Clear cache: `queryClient.invalidateQueries()`
2. Hoặc hard refresh: Ctrl+Shift+R

---

## 🚀 NEXT STEPS: UI Redesign

Sau khi access control hoạt động, có thể làm Phase 2:

### 1. Redesign Language Selection Page
- Hong Kong retro style
- Neon glow effects
- Pattern chữ Hán
- Framer Motion animations

### 2. Redesign Cantonese Index
- HK + Chợ Lớn fusion
- Vintage signage
- Colorful cards

**Estimated time:** 2-3 hours
**Files to modify:**
- `src/pages/LanguageSelection.tsx`
- `src/cantonese/pages/Index.tsx`

---

## ✅ Checklist Hoàn Thành

### Database
- [ ] Chạy SQL trong Mandarin project
- [ ] Chạy SQL trong Cantonese project
- [ ] Test functions qua SQL Editor

### Admin UI
- [ ] Integrate CourseAccessManagement vào Mandarin Dashboard
- [ ] Integrate CourseAccessManagement vào Cantonese Dashboard
- [ ] Test unlock/lock functions
- [ ] Test bulk unlock

### Route Protection
- [ ] Protect Mandarin HSK routes
- [ ] Protect Mandarin Msutong routes
- [ ] Protect Cantonese lesson routes
- [ ] Test với admin user
- [ ] Test với regular user

### User Experience
- [ ] Lock overlays hiển thị đúng
- [ ] Buttons disabled khi locked
- [ ] Messages rõ ràng
- [ ] Toast notifications hoạt động

---

**Created:** 2025-01-11
**Status:** ⏳ Pending Implementation
**Estimated Time:** 3-4 hours
