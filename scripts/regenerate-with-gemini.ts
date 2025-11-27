/**
 * Script regenerate exercises từ PDF sử dụng Gemini API (MIỄN PHÍ!)
 * Parse PDF bằng Gemini, extract vocabulary, generate exercises
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  console.log('⚠️  Could not load .env file');
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const LANGUAGE_FOCUSED_SYSTEM_PROMPT = `Bạn là một chuyên gia giảng dạy tiếng Quảng Đông (Cantonese).

QUAN TRỌNG: Tất cả các bài tập phải tập trung 100% vào kiểm tra NGÔN NGỮ, KHÔNG được hỏi về nội dung hội thoại hay câu chuyện.

VÍ DỤ CÂU HỎI TỐT (tập trung ngôn ngữ):
✅ "Chọn từ đúng: 我___去市場 (A. 想 B. 吃 C. 睡 D. 跑)"
✅ "Từ '早晨' có nghĩa là gì? (A. Buổi sáng B. Buổi tối C. Buổi trưa D. Buổi chiều)"
✅ "Jyutping của '你好' là gì?"

VÍ DỤ CÂU HỎI TỒI (hỏi về nội dung):
❌ "Trong hội thoại, người phụ nữ đi đâu?"
❌ "Ai đã mua hoa quả?"

Hãy tạo bài tập tập trung 100% vào kiểm tra ngôn ngữ.`;

function getExerciseFormatInstructions(type: string): string {
  const formats: Record<string, string> = {
    FLASHCARD: `Trả về JSON format SAU (KHÔNG thêm markdown):
{
  "items": [
    {
      "front": "chữ Hán",
      "frontJyutping": "jyutping",
      "back": "nghĩa tiếng Việt"
    }
  ]
}`,
    FILL_BLANK: `Trả về JSON format SAU (KHÔNG thêm markdown):
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
    MULTICHOICE: `Trả về JSON format SAU (KHÔNG thêm markdown):
{
  "items": [
    {
      "question": "Câu hỏi về ngôn ngữ",
      "questionJyutping": "jyutping hoặc null",
      "choices": ["A", "B", "C", "D"],
      "choicesJyutping": ["jyutping hoặc null", "jyutping hoặc null", "jyutping hoặc null", "jyutping hoặc null"],
      "correct": 0
    }
  ]
}`,
    TRUE_FALSE: `Trả về JSON format SAU (KHÔNG thêm markdown):
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
    REORDER: `Trả về JSON format SAU (KHÔNG thêm markdown):
{
  "items": [
    {
      "shuffled": ["từ", "bị", "xáo", "trộn"],
      "shuffledJyutping": ["jyutping1", "jyutping2", "jyutping3", "jyutping4"],
      "correct": ["từ", "đúng", "thứ", "tự"],
      "correctJyutping": ["jyutping1", "jyutping2", "jyutping3", "jyutping4"],
      "translation": "dịch nghĩa"
    }
  ]
}`,
    HANZI_WRITE: `Trả về JSON format SAU (KHÔNG thêm markdown):
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

async function fetchLessonsWithPDF() {
  const url = `${SUPABASE_URL}/rest/v1/lessons?select=id,title,user_id,pdf_url&pdf_url=not.is.null&order=created_at.desc&limit=20`;

  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lessons: ${response.status}`);
  }

  return await response.json();
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

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: pdfBase64
      }
    },
    `Hãy trích xuất TẤT CẢ từ vựng tiếng Quảng Đông từ PDF này.

Với mỗi từ, trả về format:
Chữ Hán (Jyutping) - Nghĩa tiếng Việt

Ví dụ:
你好 (nei5 hou2) - Xin chào
早晨 (zou2 san4) - Buổi sáng

Chỉ trả về danh sách từ vựng, KHÔNG thêm giải thích hay comment.`
  ]);

  const response = await result.response;
  const text = response.text();

  if (!text || text.trim().length === 0) {
    throw new Error('No vocabulary extracted from PDF');
  }

  return text;
}

async function generateExercise(vocabulary: string, type: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    }
  });

  const userPrompt = `${LANGUAGE_FOCUSED_SYSTEM_PROMPT}

Dựa trên danh sách từ vựng sau, hãy tạo 10-15 bài tập dạng ${type}.

VOCABULARY:
${vocabulary}

YÊU CẦU:
- Tập trung 100% vào kiểm tra NGÔN NGỮ (từ vựng, ngữ pháp, phiên âm)
- KHÔNG hỏi về nội dung hội thoại
- Trả về ĐÚNG format JSON bên dưới
- KHÔNG bọc trong markdown code blocks
- CHỈ trả về JSON thuần, không có text nào khác

${getExerciseFormatInstructions(type)}`;

  const result = await model.generateContent(userPrompt);
  const response = await result.response;
  let text = response.text();

  // Remove markdown code blocks if present
  text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // Parse JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
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
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      lesson_id: lessonId,
      user_id: userId,
      type: type,
      payload: payload
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save exercise: ${response.status} - ${errorText}`);
  }

  return true;
}

async function main() {
  console.log('🚀 Starting Cantonese Exercise Generation with Gemini (FREE!)\n');
  console.log('Focus: 100% Language Testing (No Content Questions)\n');

  // Fetch lessons with PDFs
  console.log('📚 Fetching lessons with PDFs...');
  const lessons = await fetchLessonsWithPDF();
  console.log(`✅ Found ${lessons.length} lessons with PDFs\n`);

  const exerciseTypes = ['FLASHCARD', 'FILL_BLANK', 'MULTICHOICE', 'TRUE_FALSE', 'REORDER', 'HANZI_WRITE'];

  let totalProcessed = 0;
  let totalSuccess = 0;

  for (const lesson of lessons) {
    console.log(`\n📝 Processing: ${lesson.title}`);

    try {
      // Extract vocabulary from PDF
      const vocabulary = await extractVocabularyFromPDF(lesson.pdf_url);
      const vocabLines = vocabulary.trim().split('\n').filter(line => line.trim());
      console.log(`   ✅ Extracted vocabulary (${vocabLines.length} items)`);

      // Generate exercises
      for (const type of exerciseTypes) {
        try {
          console.log(`   ⏳ Generating ${type}...`);

          const payload = await generateExercise(vocabulary, type);
          await saveExercise(lesson.id, lesson.user_id, type, payload);

          console.log(`   ✅ ${type} saved`);
          totalSuccess++;

          // Delay 1s (Gemini free tier có rate limit thấp hơn)
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error: any) {
          console.log(`   ❌ ${type} failed: ${error.message}`);
        }

        totalProcessed++;
      }

    } catch (error: any) {
      console.log(`   ❌ Failed to process lesson: ${error.message}`);
      continue;
    }

    // Delay 2s between lessons
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n\n🎉 Generation Complete!');
  console.log(`   Total processed: ${totalProcessed}`);
  console.log(`   Successful: ${totalSuccess}`);
  console.log(`   Failed: ${totalProcessed - totalSuccess}`);
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
