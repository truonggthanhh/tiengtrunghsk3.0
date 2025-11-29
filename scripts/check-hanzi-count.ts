/**
 * Script kiểm tra số lượng chữ Hán trong HANZI_WRITE exercises
 */

const SUPABASE_URL = 'https://jhjpgdldjunkhdbtopbs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBnZGxkanVua2hkYnRvcGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Mzk5OTMsImV4cCI6MjA3MTUxNTk5M30.TyNmKmM4rwgDIjngaIPkJKCKne781bcmzT6xF22kMg8';

async function checkHanziCount() {
  console.log('🔍 Checking HANZI_WRITE character counts...\n');

  // Get first 5 lessons
  const lessonsRes = await fetch(`${SUPABASE_URL}/rest/v1/lessons?select=id,title&limit=5`, {
    headers: { 'apikey': SUPABASE_KEY }
  });
  const lessons = await lessonsRes.json();

  for (const lesson of lessons) {
    const exerciseRes = await fetch(
      `${SUPABASE_URL}/rest/v1/exercises?select=payload&lesson_id=eq.${lesson.id}&type=eq.HANZI_WRITE`,
      { headers: { 'apikey': SUPABASE_KEY } }
    );
    const exercises = await exerciseRes.json();

    if (exercises.length > 0 && exercises[0].payload?.items) {
      const count = exercises[0].payload.items.length;
      console.log(`${lesson.title}: ${count} chữ Hán`);

      // Show sample characters
      const chars = exercises[0].payload.items.slice(0, 10).map((item: any) => item.character || item.char).join(', ');
      console.log(`  Mẫu: ${chars}${count > 10 ? '...' : ''}\n`);
    } else {
      console.log(`${lesson.title}: Không có HANZI_WRITE exercise\n`);
    }
  }
}

checkHanziCount().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
