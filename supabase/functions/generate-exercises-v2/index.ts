/**
 * Supabase Edge Function: Generate Exercises V2
 * Version 2 với focus 100% vào kiểm tra ngôn ngữ
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.20.0"

// System prompt tập trung vào ngôn ngữ 100%
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

serve(async (req) => {
  try {
    const { lessonId } = await req.json()

    if (!lessonId) {
      return new Response(
        JSON.stringify({ error: 'lessonId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Initialize clients
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '',
    })

    // Fetch lesson
    const { data: lesson, error: lessonError } = await supabaseClient
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson) {
      return new Response(
        JSON.stringify({ error: 'Lesson not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const content = lesson.content || lesson.vocabulary_list || ''
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No content in lesson' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate exercises
    const exerciseTypes = ['FLASHCARD', 'FILL_BLANK', 'MULTICHOICE', 'TRUE_FALSE', 'REORDER', 'HANZI_WRITE']
    const results = []

    for (const type of exerciseTypes) {
      const contentPreview = content.substring(0, 3000)

      // For HANZI_WRITE, give special instructions
      let userPrompt = '';
      if (type === 'HANZI_WRITE') {
        userPrompt = `Dựa trên nội dung bài học sau, hãy TRÍCH XUẤT TẤT CẢ các chữ Hán từ PHẦN TỪ VỰNG.

BÀI HỌC:
${contentPreview}

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

${getExerciseFormatInstructions(type)}`;
      } else {
        const quantity = '10-15 bài tập';
        userPrompt = `Dựa trên nội dung bài học sau, hãy tạo ${quantity} dạng ${type}.

BÀI HỌC:
${contentPreview}

YÊU CẦU:
- Tập trung 100% vào kiểm tra NGÔN NGỮ (từ vựng, ngữ pháp, phiên âm)
- KHÔNG hỏi về nội dung hội thoại
- Trả về JSON format với cấu trúc phù hợp cho từng dạng bài

${getExerciseFormatInstructions(type)}`;
      }

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: LANGUAGE_FOCUSED_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: userPrompt
        }]
      })

      const textContent = response.content.find(c => c.type === 'text')
      if (!textContent || textContent.type !== 'text') continue

      // Parse JSON
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) continue

      const payload = JSON.parse(jsonMatch[0])

      // Save to database
      const { error: upsertError } = await supabaseClient
        .from('exercises')
        .upsert({
          lesson_id: lessonId,
          user_id: lesson.user_id,
          type: type,
          payload: payload
        }, {
          onConflict: 'lesson_id,type,user_id'
        })

      if (!upsertError) {
        results.push(type)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${results.length} exercise types`,
        types: results
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
