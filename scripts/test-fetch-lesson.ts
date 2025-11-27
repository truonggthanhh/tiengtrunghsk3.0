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
  console.log('✅ Loaded .env file\n');
} catch (error) {
  console.log('⚠️  Could not load .env file\n');
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function testFetch() {
  console.log('🔍 Fetching one lesson to inspect data structure...\n');

  const url = `${SUPABASE_URL}/rest/v1/lessons?select=*&limit=1&order=created_at.desc`;

  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Error: ${response.status} ${response.statusText}`);
    console.error(errorText);
    return;
  }

  const lessons = await response.json();

  if (lessons.length === 0) {
    console.log('⚠️  No lessons found');
    return;
  }

  const lesson = lessons[0];

  console.log('📚 Lesson structure:');
  console.log('==================\n');
  console.log('ID:', lesson.id);
  console.log('Title:', lesson.title);
  console.log('User ID:', lesson.user_id);
  console.log('\n📋 Available fields:');
  console.log(Object.keys(lesson).join(', '));

  console.log('\n📝 dialogues:', typeof lesson.dialogues);
  if (lesson.dialogues) {
    console.log('dialogues value:', JSON.stringify(lesson.dialogues).substring(0, 200) + '...');
  } else {
    console.log('dialogues is NULL/empty');
  }

  console.log('\n📖 vocabulary:', typeof lesson.vocabulary);
  if (lesson.vocabulary) {
    console.log('vocabulary value:', JSON.stringify(lesson.vocabulary).substring(0, 200) + '...');
  } else {
    console.log('vocabulary is NULL/empty');
  }

  console.log('\n📄 description:', typeof lesson.description);
  if (lesson.description) {
    console.log('description value:', lesson.description.substring(0, 200) + '...');
  } else {
    console.log('description is NULL/empty');
  }

  console.log('\n📎 pdf_url:', lesson.pdf_url || 'NULL');

  console.log('\n\n💡 FULL LESSON DATA:');
  console.log('====================');
  console.log(JSON.stringify(lesson, null, 2));
}

testFetch().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
