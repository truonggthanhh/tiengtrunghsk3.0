import { toError } from '../src/lib/errors';
/**
 * Script regenerate exercises từ PDF
 * Parse PDF bằng Claude API, extract vocabulary, generate exercises
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
  console.log('⚠️  Could not load .env file');
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

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
      "question": "Câu hỏi về ngôn ngữ",
      "questionJyutping": "jyutping hoặc null",
      "choices": ["A", "B", "C", "D"],
      "choicesJyutping": ["jyutping hoặc null", ...],
      "correct": 0
    }
  ]
}`,
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

  console.log('   🤖 Extracting vocabulary with Claude...');

  // Use Claude to extract vocabulary from PDF
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
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64
            }
          },
          {
            type: 'text',
            text: `Hãy trích xuất TẤT CẢ từ vựng tiếng Quảng Đông từ PDF này.

Với mỗi từ, trả về format:
Chữ Hán (Jyutping) - Nghĩa tiếng Việt

Ví dụ:
你好 (nei5 hou2) - Xin chào
早晨 (zou2 san4) - Buổi sáng

Chỉ trả về danh sách từ vựng, KHÔNG thêm giải thích hay comment.`
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.content.find((c) => c.type === 'text');

  if (!textContent) {
    throw new Error('No text content in response');
  }

  return textContent.text;
}

async function generateExercise(vocabulary: string, type: string) {
  const userPrompt = `Dựa trên danh sách từ vựng sau, hãy tạo 10-15 bài tập dạng ${type}.

VOCABULARY:
${vocabulary}

YÊU CẦU:
- Tập trung 100% vào kiểm tra NGÔN NGỮ (từ vựng, ngữ pháp, phiên âm)
- KHÔNG hỏi về nội dung hội thoại
- Trả về JSON format

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
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.content.find((c) => c.type === 'text');

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

async function saveExercise(lessonId: string, userId: string, type: string, payload: unknown) {
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
  console.log('🚀 Starting Cantonese Exercise Generation from PDFs\n');
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
      console.log(`   ✅ Extracted vocabulary (${vocabulary.split('\n').length} lines)`);

      // Generate exercises
      for (const type of exerciseTypes) {
        try {
          console.log(`   ⏳ Generating ${type}...`);

          const payload = await generateExercise(vocabulary, type);
          await saveExercise(lesson.id, lesson.user_id, type, payload);

          console.log(`   ✅ ${type} saved`);
          totalSuccess++;

          // Delay 2s
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (caughtError: unknown) {
      const error = toError(caughtError);
          console.log(`   ❌ ${type} failed: ${error.message}`);
        }

        totalProcessed++;
      }

    } catch (caughtError: unknown) {
      const error = toError(caughtError);
      console.log(`   ❌ Failed to process lesson: ${error.message}`);
      continue;
    }
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
