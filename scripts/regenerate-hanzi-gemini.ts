/**
 * Script regenerate CHỈ HANZI_WRITE exercises cho Cantonese
 * Sử dụng Gemini API (FREE)
 */

import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

const SYSTEM_PROMPT = `Bạn là một chuyên gia giảng dạy tiếng Quảng Đông (Cantonese).

Nhiệm vụ của bạn là trích xuất TẤT CẢ các chữ Hán từ phần từ vựng của bài học.`;

function getHanziWritePrompt(content: string): string {
  return `${SYSTEM_PROMPT}

Dựa trên nội dung bài học sau, hãy TRÍCH XUẤT TẤT CẢ các chữ Hán từ PHẦN TỪ VỰNG.

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
}

QUAN TRỌNG: Chỉ trả về JSON, KHÔNG thêm text nào khác.`;
}

async function extractVocabularyFromPDF(pdfUrl: string): Promise<string> {
  console.log('   📄 Downloading PDF...');

  // Download PDF
  const pdfResponse = await fetch(pdfUrl);
  if (!pdfResponse.ok) {
    throw new Error(`Failed to download PDF: ${pdfResponse.status}`);
  }

  const pdfBuffer = await pdfResponse.arrayBuffer();
  const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

  console.log('   🤖 Extracting vocabulary with Gemini...');

  // Use Gemini to extract vocabulary from PDF
  const result = await model.generateContent([
    {
      inlineData: {
        data: pdfBase64,
        mimeType: 'application/pdf'
      }
    },
    {
      text: `Hãy trích xuất TẤT CẢ từ vựng tiếng Quảng Đông từ PDF này.

Với mỗi từ, trả về format:
Chữ Hán (Jyutping) - Nghĩa tiếng Việt

Ví dụ:
你好 (nei5 hou2) - Xin chào
早晨 (zou2 san4) - Buổi sáng

Chỉ trả về danh sách từ vựng, KHÔNG thêm giải thích hay comment.`
    }
  ]);

  const response = result.response;
  return response.text();
}

async function regenerateHanziForLesson(lessonId: string, pdfUrl: string, userId: string, title: string) {
  console.log(`\n🔄 Regenerating HANZI_WRITE for lesson: ${title}`);

  try {
    // 1. Extract vocabulary từ PDF
    const vocabulary = await extractVocabularyFromPDF(pdfUrl);
    console.log(`   ✅ Extracted vocabulary (${vocabulary.split('\n').length} lines)`);

    // 2. Generate HANZI_WRITE exercise với Gemini
    console.log(`   📝 Generating HANZI_WRITE with Gemini...`);

    const prompt = `${SYSTEM_PROMPT}

Dựa trên danh sách từ vựng sau, hãy TRÍCH XUẤT TẤT CẢ các chữ Hán.

VOCABULARY:
${vocabulary}

YÊU CẦU QUAN TRỌNG:
1. Với mỗi từ vựng (word/phrase), tách thành từng chữ Hán riêng biệt
2. Lấy TẤT CẢ các chữ Hán unique (không trùng lặp)
3. Mỗi chữ Hán chỉ xuất hiện 1 lần

VÍ DỤ:
- "你好 (nei5 hou2)" → Tách thành 2 items: {"character":"你","jyutping":"nei5","meaning":"bạn"} và {"character":"好","jyutping":"hou2","meaning":"tốt"}
- "早晨 (zou2 san4)" → Tách thành 2 items: {"character":"早","jyutping":"zou2","meaning":"sớm"} và {"character":"晨","jyutping":"san4","meaning":"buổi sáng"}

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
}

QUAN TRỌNG: Chỉ trả về JSON, KHÔNG thêm text nào khác.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON từ response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log(`    ⚠️ No valid JSON found`);
      console.log(`    Response: ${text.substring(0, 200)}...`);
      return;
    }

    const payload = JSON.parse(jsonMatch[0]);
    const characterCount = payload.items?.length || 0;

    console.log(`    📊 Extracted ${characterCount} unique characters`);

    // Show sample
    if (payload.items && payload.items.length > 0) {
      const sample = payload.items.slice(0, 10).map((item: any) => item.character).join(', ');
      console.log(`    🔤 Sample: ${sample}${characterCount > 10 ? '...' : ''}`);
    }

    // 3. Lưu vào database (upsert)
    const { error: upsertError } = await supabase
      .from('exercises')
      .upsert({
        lesson_id: lessonId,
        user_id: userId,
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

    console.log(`✅ Completed lesson: ${title}`);

  } catch (error: any) {
    console.error(`❌ Error for lesson ${title}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting HANZI_WRITE Regeneration for Cantonese');
  console.log('🤖 Using: Gemini 1.5 Flash (Stable, Higher Quota)\n');
  console.log('Focus: Extract ALL characters from PDF vocabulary\n');

  // Lấy danh sách lessons có PDF
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, user_id, pdf_url')
    .not('pdf_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('❌ Error fetching lessons:', error);
    process.exit(1);
  }

  if (!lessons || lessons.length === 0) {
    console.log('⚠️ No lessons with PDF found');
    process.exit(0);
  }

  console.log(`📊 Found ${lessons.length} lessons with PDF to regenerate\n`);

  for (const lesson of lessons) {
    await regenerateHanziForLesson(lesson.id, lesson.pdf_url, lesson.user_id, lesson.title);

    // Delay để tránh rate limit (tăng lên 10s cho an toàn)
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  console.log('\n✨ All done! HANZI_WRITE regeneration completed.\n');
}

// Run script
main().catch(console.error);
