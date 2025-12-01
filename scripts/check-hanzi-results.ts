/**
 * Script kiểm tra kết quả HANZI_WRITE exercises
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file
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
} catch (error) {
  console.log('⚠️  Could not load .env file');
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    global: {
      fetch: fetch.bind(globalThis)
    }
  }
);

async function checkHanziResults() {
  console.log('🔍 Checking HANZI_WRITE exercises...\n');

  // Lấy tất cả HANZI_WRITE exercises
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('lesson_id, payload, lessons(title)')
    .eq('type', 'HANZI_WRITE')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!exercises || exercises.length === 0) {
    console.log('⚠️ No HANZI_WRITE exercises found');
    return;
  }

  console.log(`✅ Found ${exercises.length} HANZI_WRITE exercises\n`);
  console.log('📊 Character count per lesson:\n');

  let totalCharacters = 0;
  const results: any[] = [];

  for (const exercise of exercises) {
    const characterCount = exercise.payload?.items?.length || 0;
    totalCharacters += characterCount;

    const lessonTitle = (exercise as any).lessons?.title || 'Unknown';

    results.push({
      title: lessonTitle,
      count: characterCount,
      sample: exercise.payload?.items?.slice(0, 5).map((item: any) => item.character).join(', ') || ''
    });
  }

  // Sort by count descending
  results.sort((a, b) => b.count - a.count);

  // Display results
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.title}`);
    console.log(`   📊 ${result.count} characters`);
    console.log(`   🔤 Sample: ${result.sample}...`);
    console.log('');
  });

  console.log('━'.repeat(60));
  console.log(`📈 Total: ${exercises.length} lessons`);
  console.log(`🔤 Total characters: ${totalCharacters}`);
  console.log(`📊 Average: ${Math.round(totalCharacters / exercises.length)} characters/lesson`);
  console.log('━'.repeat(60));
}

checkHanziResults().catch(console.error);
