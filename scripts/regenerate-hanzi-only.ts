import { toError } from '../src/lib/errors';
/**
 * Script regenerate CHỈ HANZI_WRITE exercises cho Cantonese
 * Trích xuất TẤT CẢ chữ Hán từ phần từ vựng của mỗi bài
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file manually
try {
  const envPath = resolve(process.cwd(), '.env');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
  console.log('✅ Loaded .env file');
} catch (error) {
  console.log('⚠️  Could not load .env file, using environment variables');
}

// Khởi tạo clients
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    global: {
      fetch: fetch.bind(globalThis)
    }
  }
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

const SYSTEM_PROMPT = `Bạn là một chuyên gia giảng dạy tiếng Quảng Đông (Cantonese).

Nhiệm vụ của bạn là trích xuất TẤT CẢ các chữ Hán từ phần từ vựng của bài học.`;

function getHanziWritePrompt(content: string): string {
  return `Dựa trên nội dung bài học sau, hãy TRÍCH XUẤT TẤT CẢ các chữ Hán từ PHẦN TỪ VỰNG.

BÀI HỌC:
${content}

YÊU CẦU QUAN TRỌNG:
1. Tìm tất cả các bảng từ vựng trong bài (thường có 2 bảng từ vựng cho 2 đoạn hội thoại)
2. Với mỗi từ vựng (word/phrase), tách thành từng chữ Hán riêng biệt
3. Lấy TẤT CẢ các chữ Hán unique (không trùng lặp)
4. KHÔNG bỏ sót bất kỳ chữ nào trong danh sách từ vựng
5. Mỗi chữ Hán chỉ xuất hiện 1 lần

VÍ DỤ MINH HỌA:
- Từ vựng: "你好" → Tách thành 2 items: {"character":"你","jyutping":"nei5","meaning":"bạn"} và {"character":"好","jyutping":"hou2","meaning":"tốt"}
- Từ vựng: "早晨" → Tách thành 2 items: {"character":"早","jyutping":"zou2","meaning":"sớm"} và {"character":"晨","jyutping":"san4","meaning":"buổi sáng"}
- Nếu chữ "你" đã xuất hiện trong từ "你好", KHÔNG thêm lại khi gặp "你們"

Format JSON:
{
  "items": [
    {
      "character": "字",
      "jyutping": "zi6",
      "meaning": "chữ",
      "strokes": 6
    }
  ]
}`;
}

async function regenerateHanziForLesson(lessonId: string) {
  console.log(`\n🔄 Regenerating HANZI_WRITE for lesson: ${lessonId}`);

  try {
    // 1. Lấy thông tin bài học
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError) throw lessonError;
    if (!lesson) throw new Error('Lesson not found');

    console.log(`📚 Lesson: ${lesson.title}`);

    // 2. Lấy nội dung bài học
    const content = lesson.content || lesson.vocabulary_list || '';
    if (!content) {
      console.log('⚠️ No content found, skipping...');
      return;
    }

    // 3. Generate HANZI_WRITE exercise
    console.log(`  📝 Generating HANZI_WRITE...`);

    const contentPreview = content.substring(0, 3000);
    const userPrompt = getHanziWritePrompt(contentPreview);

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    });

    const textContent = response.content.find(c => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      console.log(`    ⚠️ No text response`);
      return;
    }

    // Parse JSON từ response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log(`    ⚠️ No valid JSON found`);
      return;
    }

    const payload = JSON.parse(jsonMatch[0]);
    const characterCount = payload.items?.length || 0;

    console.log(`    📊 Extracted ${characterCount} unique characters`);

    // Show sample
    if (payload.items && payload.items.length > 0) {
      const sample = payload.items.slice(0, 10).map((item) => item.character).join(', ');
      console.log(`    🔤 Sample: ${sample}${characterCount > 10 ? '...' : ''}`);
    }

    // 4. Lưu vào database (upsert)
    const { error: upsertError } = await supabase
      .from('exercises')
      .upsert({
        lesson_id: lessonId,
        user_id: lesson.user_id,
        type: 'HANZI_WRITE',
        payload: payload
      }, {
        onConflict: 'lesson_id,type,user_id'
      });

    if (upsertError) {
      console.log(`    ❌ Error saving:`, upsertError.message);
    } else {
      console.log(`    ✅ Saved successfully`);
    }

    console.log(`✅ Completed lesson: ${lessonId}`);

  } catch (caughtError: unknown) {
      const error = toError(caughtError);
    console.error(`❌ Error for lesson ${lessonId}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting HANZI_WRITE Regeneration for Cantonese\n');
  console.log('Focus: Extract ALL characters from vocabulary sections\n');

  // Lấy danh sách lessons
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, user_id')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('❌ Error fetching lessons:', error);
    process.exit(1);
  }

  if (!lessons || lessons.length === 0) {
    console.log('⚠️ No lessons found');
    process.exit(0);
  }

  console.log(`📊 Found ${lessons.length} lessons to regenerate\n`);

  for (const lesson of lessons) {
    await regenerateHanziForLesson(lesson.id);

    // Delay để tránh rate limit
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n✨ All done! HANZI_WRITE regeneration completed.\n');
}

// Run script
main().catch(console.error);
