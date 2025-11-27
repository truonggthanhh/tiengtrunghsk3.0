/**
 * Script để regenerate lại các bài tập Cantonese
 * Tập trung vào kiểm tra ngôn ngữ 100% thay vì hỏi về nội dung hội thoại
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

// Khởi tạo clients
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

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

async function regenerateExercisesForLesson(lessonId: string) {
  console.log(`\n🔄 Regenerating exercises for lesson: ${lessonId}`);

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

    // 3. Tạo bài tập mới với prompt tập trung ngôn ngữ
    const exerciseTypes = ['FLASHCARD', 'FILL_BLANK', 'MULTICHOICE', 'TRUE_FALSE', 'REORDER', 'HANZI_WRITE'];

    for (const type of exerciseTypes) {
      console.log(`  📝 Generating ${type}...`);

      const contentPreview = content.substring(0, 3000);
      const userPrompt = `Dựa trên nội dung bài học sau, hãy tạo 10-15 bài tập dạng ${type}.

BÀI HỌC:
${contentPreview}

YÊU CẦU:
- Tập trung 100% vào kiểm tra NGÔN NGỮ (từ vựng, ngữ pháp, phiên âm)
- KHÔNG hỏi về nội dung hội thoại
- Trả về JSON format với cấu trúc phù hợp cho từng dạng bài

${getExerciseFormatInstructions(type)}`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: LANGUAGE_FOCUSED_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: userPrompt
        }]
      });

      const textContent = response.content.find(c => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        console.log(`    ⚠️ No text response for ${type}`);
        continue;
      }

      // Parse JSON từ response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log(`    ⚠️ No valid JSON found for ${type}`);
        continue;
      }

      const payload = JSON.parse(jsonMatch[0]);

      // 4. Lưu vào database (upsert)
      const { error: upsertError } = await supabase
        .from('exercises')
        .upsert({
          lesson_id: lessonId,
          user_id: lesson.user_id,
          type: type,
          payload: payload
        }, {
          onConflict: 'lesson_id,type,user_id'
        });

      if (upsertError) {
        console.log(`    ❌ Error saving ${type}:`, upsertError.message);
      } else {
        console.log(`    ✅ Saved ${type}`);
      }

      // Delay để tránh rate limit
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`✅ Completed lesson: ${lessonId}\n`);

  } catch (error: any) {
    console.error(`❌ Error for lesson ${lessonId}:`, error.message);
  }
}

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

async function main() {
  console.log('🚀 Starting Cantonese Exercise Regeneration\n');
  console.log('Focus: 100% Language Testing (No Content Questions)\n');

  // Lấy danh sách lessons cần regenerate
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, user_id')
    .order('created_at', { ascending: false })
    .limit(20);

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
    await regenerateExercisesForLesson(lesson.id);
  }

  console.log('\n✨ All done! Exercise regeneration completed.\n');
}

// Run script
main().catch(console.error);
