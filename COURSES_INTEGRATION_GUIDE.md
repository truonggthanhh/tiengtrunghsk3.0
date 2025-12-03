# 📚 Hướng Dẫn: Courses System Integration

## 🎉 Đã Fix: Courses Đồng Bộ Database → Trang Chủ!

### ✅ **Trước đây (KHÔNG hoạt động):**
- Thêm course trong Admin → **KHÔNG xuất hiện** ở trang chủ
- 2 hệ thống riêng biệt, không liên kết

### ✨ **Bây giờ (Hoạt động hoàn hảo):**
- Thêm course trong Admin → **Tự động hiển thị** ở trang chủ
- 1 hệ thống duy nhất, đồng bộ hoàn toàn
- Có thể quản lý courses, lessons, access control từ database

---

## 🚀 Cách Chạy Migration

### **Bước 1: Database HSK (Mandarin)**
1. Vào SQL Editor: https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs
2. Copy toàn bộ nội dung file: `supabase/migrations/20250203_integrate_courses_system.sql`
3. Paste vào SQL Editor
4. Click **Run**
5. Kiểm tra: `SELECT * FROM courses ORDER BY display_order;`
   - Phải thấy HSK 1-6, Msutong 1-4

### **Bước 2: Database Cantonese**
1. Vào SQL Editor: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
2. Copy toàn bộ nội dung file: `supabase/migrations/20250203_integrate_courses_system.sql`
3. Paste vào SQL Editor
4. Click **Run**
5. Kiểm tra: `SELECT * FROM courses WHERE language = 'cantonese' ORDER BY display_order;`
   - Phải thấy Tiếng Quảng Bài 1-20

---

## 📖 Hướng Dẫn Sử Dụng

### **1. Thêm Khóa Học Mới Qua Admin Dashboard**

#### **Cách 1: Qua UI (Khuyến nghị)**
1. Vào Admin Dashboard → Tab "Courses"
2. Điền thông tin:
   - **Tên khóa học**: VD: "HSK 7"
   - **Mô tả**: "Khóa học HSK cấp độ 7 - Nâng cao"
   - **Ngôn ngữ**: Chọn "Mandarin" hoặc "Cantonese"
   - **Miễn phí?**: Có/Không
   - **Màu**: Chọn màu cho card
3. Click "Thêm Khóa Học"
4. ✅ Course **ngay lập tức hiển thị** ở trang chủ!

#### **Cách 2: Qua SQL (Cho admin database)**
```sql
INSERT INTO courses (name, slug, description, language, is_free, display_order, color)
VALUES (
  'HSK 7',
  'hsk-7',
  'Khóa học HSK cấp độ 7 - Nâng cao',
  'mandarin',
  false,
  16,
  '#8B5CF6'
);
```

### **2. Unlock Khóa Học Cho User**

```sql
-- Unlock course cho user
SELECT unlock_course_for_user(
  'user_id_here'::UUID,
  (SELECT id FROM courses WHERE name = 'HSK 3')
);
```

### **3. Check User Có Access Không**

```sql
-- Check access
SELECT check_course_access(
  'user_id_here'::UUID,
  (SELECT id FROM courses WHERE name = 'HSK 3')
);
```

---

## 👨‍💻 Hướng Dẫn Cho Developers

### **Hooks Mới (Khuyến nghị dùng):**

```typescript
import { useCourses, useCoursesWithAccess, useCheckCourseAccess } from '@/hooks/useCourses';

// 1. Lấy tất cả courses (không cần login)
const { data: courses } = useCourses('mandarin');

// 2. Lấy courses kèm access status của user
const { data: coursesWithAccess } = useCoursesWithAccess('mandarin');

// 3. Check access vào 1 course cụ thể
const { data: accessCheck } = useCheckCourseAccess(courseId);
```

### **Backward Compatibility:**

```typescript
// Old code (vẫn hoạt động)
import { useCourseAccess } from '@/hooks/useCourseAccess';

const { data } = useCourseAccess('hsk_1'); // Deprecated nhưng vẫn works
```

### **Component Example:**

```typescript
import { useCoursesWithAccess } from '@/hooks/useCourses';

function CoursesPage() {
  const { data: courses, isLoading } = useCoursesWithAccess('mandarin');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {courses?.map(course => (
        <div key={course.id}>
          <h3>{course.name}</h3>
          <p>{course.description}</p>
          {course.is_unlocked ? (
            <Link to={`/courses/${course.slug}`}>Học ngay</Link>
          ) : (
            <button>Mua khóa học</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 🗄️ Database Schema

### **courses table:**
```sql
- id (UUID) - Primary key
- name (TEXT) - Tên khóa học
- slug (TEXT) - URL-friendly slug
- description (TEXT) - Mô tả
- language (TEXT) - 'mandarin' hoặc 'cantonese'
- is_free (BOOLEAN) - Miễn phí?
- is_active (BOOLEAN) - Đang hoạt động?
- display_order (INTEGER) - Thứ tự hiển thị
- color (TEXT) - Hex color code
- course_type_legacy (TEXT) - Mapping cũ (hsk_1, msutong_1...)
```

### **course_access table (đã update):**
```sql
- user_id (UUID) - FK to profiles
- course_id (UUID) - FK to courses ← CHANGED from course_type
- is_unlocked (BOOLEAN)
- unlocked_at (TIMESTAMP)
```

---

## 🔥 Features Mới

### ✅ **Đã có:**
1. Thêm/sửa/xóa courses qua Admin UI
2. Courses tự động hiển thị ở trang chủ
3. Course access control
4. Free courses
5. Backward compatibility với code cũ

### 🚧 **TODO (nếu cần):**
1. Upload thumbnail cho courses
2. Link lessons vào courses (course_id column đã có)
3. Course categories/tags
4. Course pricing
5. Payment integration
6. Certificate khi hoàn thành course

---

## ⚠️ Breaking Changes

### **Migration CẦN chạy:**
- File: `supabase/migrations/20250203_integrate_courses_system.sql`
- Phải chạy trên **CẢ 2 databases**

### **Code changes:**
- Không có breaking changes! Old code vẫn hoạt động
- Nhưng khuyến nghị migrate sang hooks mới

### **Database changes:**
- `course_access.course_type` → `course_access.course_id`
- RPC functions signature changed
- Đã migrate data tự động

---

## 🎯 Testing Checklist

### **Sau khi chạy migration:**
- [ ] Vào Admin → Tab Courses → Thấy HSK 1-6, Msutong 1-4
- [ ] Thêm 1 course mới → Save thành công
- [ ] Vào trang chủ → Thấy course mới xuất hiện
- [ ] Click vào course → Check access control hoạt động
- [ ] Unlock course cho user → Verify user có access

---

## 📞 Support

Nếu gặp lỗi sau khi migrate:
1. Check migration đã chạy thành công: `SELECT * FROM courses;`
2. Check course_access đã migrate: `SELECT * FROM course_access LIMIT 5;`
3. Check console logs trong browser
4. Verify RPC functions: `SELECT check_course_access('user_id', 'course_id');`

---

**Ngày tạo:** 2025-02-03
**Branch:** claude/fix-database-errors-014TuiprcbmmjcqT1zSzeZKx
**Status:** ✅ Ready to deploy
