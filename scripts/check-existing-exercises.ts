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
  console.log('✅ Loaded .env file\n');
} catch (error) {
  console.log('⚠️  Could not load .env file\n');
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkExercises() {
  console.log('🔍 Checking exercises table...\n');

  // Fetch exercises for the first lesson
  const lessonId = '4aaa7f38-af4c-4e85-9460-5190c462723d'; // Bài 20

  const url = `${SUPABASE_URL}/rest/v1/exercises?select=*&lesson_id=eq.${lessonId}`;

  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.error(`❌ Error: ${response.status} ${response.statusText}`);
    return;
  }

  const exercises = await response.json();

  console.log(`📚 Found ${exercises.length} exercises for lesson "${lessonId}"\n`);

  if (exercises.length > 0) {
    console.log('📋 Exercise types found:');
    const types = [...new Set(exercises.map((e: any) => e.type))];
    types.forEach(type => {
      const count = exercises.filter((e: any) => e.type === type).length;
      console.log(`   - ${type}: ${count} exercise(s)`);
    });

    console.log('\n📝 Sample exercise (first one):');
    console.log('   Type:', exercises[0].type);
    console.log('   ID:', exercises[0].id);
    console.log('   Lesson ID:', exercises[0].lesson_id);
    console.log('   Payload preview:', JSON.stringify(exercises[0].payload).substring(0, 200) + '...');

    console.log('\n💡 FULL FIRST EXERCISE:');
    console.log(JSON.stringify(exercises[0], null, 2));
  } else {
    console.log('⚠️  No exercises found for this lesson');
  }

  // Also check if there are any exercises at all
  console.log('\n\n🔍 Checking total exercises in database...\n');

  const allUrl = `${SUPABASE_URL}/rest/v1/exercises?select=lesson_id,type&limit=100`;
  const allResponse = await fetch(allUrl, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (allResponse.ok) {
    const allExercises = await allResponse.json();
    console.log(`📊 Total exercises in database: ${allExercises.length}`);

    // Group by lesson_id
    const byLesson = allExercises.reduce((acc: any, ex: any) => {
      if (!acc[ex.lesson_id]) acc[ex.lesson_id] = [];
      acc[ex.lesson_id].push(ex.type);
      return acc;
    }, {});

    console.log(`📚 Exercises spread across ${Object.keys(byLesson).length} lessons\n`);

    console.log('Sample breakdown by lesson:');
    Object.entries(byLesson).slice(0, 5).forEach(([lessonId, types]: [string, any]) => {
      console.log(`   Lesson ${lessonId.substring(0, 8)}...: ${types.length} exercises (${[...new Set(types)].join(', ')})`);
    });
  }
}

checkExercises().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
