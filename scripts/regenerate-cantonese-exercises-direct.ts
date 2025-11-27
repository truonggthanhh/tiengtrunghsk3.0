/**
 * Script để regenerate lại các bài tập Cantonese
 * Tập trung vào kiểm tra ngôn ngữ 100% thay vì hỏi về nội dung hội thoại
 * Version sử dụng native fetch API trực tiếp
 */

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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

// Prompt mới tập trung vào kiểm tra ngôn ngữ
const LANGUAGE_FOCUSED_SYSTEM_PROMPT = `Bạn là một chuyên gia giảng dạy tiếng Quảng Đông (Cantonese).

QUAN TRỌNG: Tất cả các bài tập phải tập trung 100% vào kiểm tra NGÔN NGỮ, KHÔNG được hỏi về nội dung hội thoại hay câu chuyện.

Các dạng bài tập cần tập trung vào:

1. **FLASHCARD**: Thẻ ghi nhớ từ vựng
   - Mặt trước: Chữ Hán
   - Mặt sau: Jyutping + Nghĩa tiếng Việt

2. **FILL_BLANK**: Điền từ vào chỗ trống
   - Đưa ra câu có chỗ trống (_____)
   - Yêu cầu điền từ phù hợp về mặt NGỮ PHÁP/TỪ VỰNG
   - VD: "我___去市場" (答案: 想/要/會)

3. **MULTICHOICE**: Trắc nghiệm ABCD
   - Câu hỏi về NGỮ PHÁP: Chọn từ đúng điền vào câu
   - Câu hỏi về TỪ VỰNG: Chọn nghĩa đúng của từ
   - Câu hỏi về PHIÊN ÂM: Chọn jyutping đúng của chữ
   - KHÔNG hỏi về nội dung "người trong hội thoại nói gì", "ai làm gì"

4. **TRUE_FALSE**: Đúng/Sai về ngôn ngữ
   - Câu về NGỮ PHÁP đúng/sai
   - Cách dùng từ đúng/sai
   - KHÔNG hỏi về nội dung câu chuyện

5. **REORDER**: Sắp xếp từ thành câu
   - Đưa ra các từ bị xáo trộn
   - Yêu cầu sắp xếp thành câu đúng NGỮ PHÁP

6. **HANZI_WRITE**: Luyện viết chữ Hán
   - Chọn các chữ Hán quan trọng trong bài
   - Yêu cầu luyện viết theo nét

VÍ DỤ CÂU HỎI TỐT (tập trung ngôn ngữ):
✅ "Chọn từ đúng: 我___去市場 (A. 想 B. 吃 C. 睡 D. 跑)"
✅ "Từ '早晨' có nghĩa là gì? (A. Buổi sáng B. Buổi tối C. Buổi trưa D. Buổi chiều)"
✅ "Jyutping của '你好' là gì? (A. nei5 hou2 B. lei5 hou2 C. nei5 ho2 D. lei5 ho2)"

VÍ DỤ CÂU HỎI TỒI (hỏi về nội dung):
❌ "Trong hội thoại, người phụ nữ đi đâu?"
❌ "Ai đã mua hoa quả?"
❌ "Câu chuyện nói về điều gì?"

Hãy tạo bài tập theo nguyên tắc trên, tập trung 100% vào kiểm tra ngôn ngữ.`;

function getExerciseFormatInstructions(type: string): string {
  const formats: Record<string, string> = {
    FLASHCARD: `Format JSON:
{
  "items": [
    {
      "front": "chữ Hán",
      "frontJyutping": "jyutping",
      "back": "nghĩa tiếng Việt"
    }
  ]
}`,
    FILL_BLANK: `Format JSON:
{
  "items": [
    {
      "sentence": "Câu có chỗ trống _____",
      "sentenceJyutping": "jyutping của câu",
      "answer": "đáp án",
      "answerJyutping": "jyutping đáp án",
      "translation": "dịch nghĩa"
    }
  ]
}`,
    MULTICHOICE: `Format JSON:
{
  "items": [
    {
      "question": "Câu hỏi về ngôn ngữ (tiếng Việt hoặc có chữ Hán)",
      "questionJyutping": "jyutping nếu câu hỏi có chữ Hán, null nếu câu hỏi là tiếng Việt",
      "choices": ["A", "B", "C", "D"],
      "choicesJyutping": ["jyutping_A hoặc null", "jyutping_B hoặc null", "jyutping_C hoặc null", "jyutping_D hoặc null"],
      "correct": 0
    }
  ]
}
LƯU Ý: Chỉ thêm jyutping cho các đáp án có chữ Hán, đáp án tiếng Việt để null`,
    TRUE_FALSE: `Format JSON:
{
  "items": [
    {
      "statement": "Câu phát biểu về ngữ pháp/từ vựng",
      "statementJyutping": "jyutping",
      "correct": true,
      "explanation": "giải thích"
    }
  ]
}`,
    REORDER: `Format JSON:
{
  "items": [
    {
      "shuffled": ["từ", "bị", "xáo", "trộn"],
      "shuffledJyutping": ["jyutping1", "jyutping2", "..."],
      "correct": ["từ", "đúng", "thứ", "tự"],
      "correctJyutping": ["jyutping1", "jyutping2", "..."],
      "translation": "dịch nghĩa"
    }
  ]
}`,
    HANZI_WRITE: `Format JSON:
{
  "items": [
    {
      "character": "字",
      "jyutping": "zi6",
      "meaning": "chữ",
      "strokes": 6
    }
  ]
}`
  };

  return formats[type] || '';
}

async function fetchLessons() {
  const url = `${SUPABASE_URL}/rest/v1/lessons?select=id,title,user_id,content,vocabulary_list&order=created_at.desc&limit=20`;

  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lessons: ${response.statusText}`);
  }

  return await response.json();
}

async function generateExercise(lessonContent: string, type: string) {
  const contentPreview = lessonContent.substring(0, 3000);
  const userPrompt = `Dựa trên nội dung bài học sau, hãy tạo 10-15 bài tập dạng ${type}.

BÀI HỌC:
${contentPreview}

YÊU CẦU:
- Tập trung 100% vào kiểm tra NGÔN NGỮ (từ vựng, ngữ pháp, phiên âm)
- KHÔNG hỏi về nội dung hội thoại
- Trả về JSON format với cấu trúc phù hợp cho từng dạng bài

${getExerciseFormatInstructions(type)}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: LANGUAGE_FOCUSED_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  const textContent = data.content.find((c: any) => c.type === 'text');

  if (!textContent) {
    throw new Error('No text content in response');
  }

  // Parse JSON
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function saveExercise(lessonId: string, userId: string, type: string, payload: any) {
  const url = `${SUPABASE_URL}/rest/v1/exercises`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      lesson_id: lessonId,
      user_id: userId,
      type: type,
      payload: payload
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to save exercise: ${response.statusText}`);
  }

  return true;
}

async function main() {
  console.log('🚀 Starting Cantonese Exercise Regeneration\n');
  console.log('Focus: 100% Language Testing (No Content Questions)\n');

  // Lấy danh sách lessons
  console.log('📚 Fetching lessons...');
  const lessons = await fetchLessons();
  console.log(`✅ Found ${lessons.length} lessons\n`);

  const exerciseTypes = ['FLASHCARD', 'FILL_BLANK', 'MULTICHOICE', 'TRUE_FALSE', 'REORDER', 'HANZI_WRITE'];

  let totalProcessed = 0;
  let totalSuccess = 0;

  for (const lesson of lessons) {
    console.log(`\n📝 Processing: ${lesson.title}`);

    const content = lesson.content || lesson.vocabulary_list || '';
    if (!content) {
      console.log('   ⚠️  No content, skipping');
      continue;
    }

    for (const type of exerciseTypes) {
      try {
        console.log(`   ⏳ Generating ${type}...`);

        const payload = await generateExercise(content, type);
        await saveExercise(lesson.id, lesson.user_id, type, payload);

        console.log(`   ✅ ${type} saved`);
        totalSuccess++;

        // Delay 2s để tránh rate limit
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error: any) {
        console.log(`   ❌ ${type} failed: ${error.message}`);
      }

      totalProcessed++;
    }
  }

  console.log('\n\n🎉 Regeneration Complete!');
  console.log(`   Total processed: ${totalProcessed}`);
  console.log(`   Successful: ${totalSuccess}`);
  console.log(`   Failed: ${totalProcessed - totalSuccess}`);
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
