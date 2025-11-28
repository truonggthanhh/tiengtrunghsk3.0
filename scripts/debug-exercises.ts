/**
 * Script kiểm tra exercises của Bài 1 để debug
 */

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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkExercises() {
  console.log('🔍 Checking exercises for Bài 1...\n');

  // Get Bài 1 lesson
  const lessonsUrl = `${SUPABASE_URL}/rest/v1/lessons?select=id,title&title=ilike.*Bài 1*&order=created_at.desc&limit=1`;
  const lessonsRes = await fetch(lessonsUrl, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
    }
  });

  const lessons = await lessonsRes.json();

  if (!lessons || lessons.length === 0) {
    console.log('❌ No Bài 1 found');
    return;
  }

  const lesson = lessons[0];
  console.log(`✅ Found lesson: ${lesson.title} (ID: ${lesson.id})\n`);

  // Get all exercises for this lesson
  const exercisesUrl = `${SUPABASE_URL}/rest/v1/exercises?select=type,payload&lesson_id=eq.${lesson.id}`;
  const exercisesRes = await fetch(exercisesUrl, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
    }
  });

  const exercises = await exercisesRes.json();

  console.log(`📊 Found ${exercises.length} exercises:\n`);

  exercises.forEach((ex: any) => {
    console.log(`\n📝 ${ex.type}:`);
    console.log(`   Payload structure: ${typeof ex.payload}`);

    if (ex.payload && ex.payload.items) {
      console.log(`   ✅ Has items array: ${ex.payload.items.length} items`);

      // Check first item structure
      const firstItem = ex.payload.items[0];
      if (firstItem) {
        console.log(`   First item keys: ${Object.keys(firstItem).join(', ')}`);
        console.log(`   First item sample:`, JSON.stringify(firstItem, null, 2).substring(0, 200) + '...');
      }
    } else {
      console.log(`   ❌ NO items array! Payload:`, JSON.stringify(ex.payload, null, 2).substring(0, 200));
    }
  });
}

checkExercises().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
