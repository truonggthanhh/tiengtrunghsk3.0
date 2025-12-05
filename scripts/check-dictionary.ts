/**
 * Script kiểm tra và sửa lỗi từ điển Supabase
 *
 * Chạy: npx tsx scripts/check-dictionary.ts
 *
 * Chức năng:
 * 1. Tìm từ trùng lặp
 * 2. Tìm từ có pinyin rỗng
 * 3. Tìm từ có nghĩa rỗng
 * 4. Xóa từ trùng lặp (tùy chọn)
 */

import { createClient } from '@supabase/supabase-js';

// Supabase config - lấy từ environment hoặc hardcode
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Thiếu SUPABASE_URL hoặc SUPABASE_ANON_KEY');
  console.log('Hãy set environment variables:');
  console.log('  export SUPABASE_URL="your-supabase-url"');
  console.log('  export SUPABASE_ANON_KEY="your-anon-key"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface DictionaryEntry {
  id: number;
  simplified: string;
  traditional: string;
  pinyin_number: string;
  pinyin_tone: string;
  vietnamese: string;
}

async function findDuplicates(): Promise<void> {
  console.log('\n🔍 Tìm từ trùng lặp...');

  // Get all entries grouped by simplified + pinyin
  const { data, error } = await supabase
    .from('dictionary_entries')
    .select('simplified, pinyin_number')
    .order('simplified');

  if (error) {
    console.error('❌ Lỗi:', error.message);
    return;
  }

  // Count duplicates
  const counts = new Map<string, number>();
  for (const entry of data || []) {
    const key = `${entry.simplified}|${entry.pinyin_number}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const duplicates = Array.from(counts.entries())
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  if (duplicates.length === 0) {
    console.log('✅ Không có từ trùng lặp!');
  } else {
    console.log(`⚠️  Tìm thấy ${duplicates.length} cặp từ trùng lặp:`);
    duplicates.slice(0, 20).forEach(([key, count]) => {
      const [simplified, pinyin] = key.split('|');
      console.log(`   ${simplified} (${pinyin}): ${count} lần`);
    });
    if (duplicates.length > 20) {
      console.log(`   ... và ${duplicates.length - 20} cặp khác`);
    }
  }

  return;
}

async function findEmptyPinyin(): Promise<void> {
  console.log('\n🔍 Tìm từ có pinyin rỗng...');

  const { data, error } = await supabase
    .from('dictionary_entries')
    .select('id, simplified, pinyin_number, pinyin_tone')
    .or('pinyin_number.is.null,pinyin_number.eq.,pinyin_tone.is.null')
    .limit(100);

  if (error) {
    console.error('❌ Lỗi:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('✅ Không có từ nào thiếu pinyin!');
  } else {
    console.log(`⚠️  Tìm thấy ${data.length} từ thiếu pinyin:`);
    data.slice(0, 10).forEach(entry => {
      console.log(`   ID ${entry.id}: ${entry.simplified} - pinyin: "${entry.pinyin_number || ''}" / "${entry.pinyin_tone || ''}"`);
    });
  }
}

async function findEmptyMeaning(): Promise<void> {
  console.log('\n🔍 Tìm từ có nghĩa rỗng...');

  const { data, error } = await supabase
    .from('dictionary_entries')
    .select('id, simplified, pinyin_number, vietnamese')
    .or('vietnamese.is.null,vietnamese.eq.')
    .limit(100);

  if (error) {
    console.error('❌ Lỗi:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('✅ Không có từ nào thiếu nghĩa!');
  } else {
    console.log(`⚠️  Tìm thấy ${data.length} từ thiếu nghĩa:`);
    data.slice(0, 10).forEach(entry => {
      console.log(`   ID ${entry.id}: ${entry.simplified} (${entry.pinyin_number})`);
    });
  }
}

async function findInvalidCharacters(): Promise<void> {
  console.log('\n🔍 Tìm từ có ký tự lạ trong nghĩa...');

  const { data, error } = await supabase
    .from('dictionary_entries')
    .select('id, simplified, vietnamese')
    .or('vietnamese.ilike.%\\\\%,vietnamese.ilike.%\\/%')
    .limit(100);

  if (error) {
    console.error('❌ Lỗi:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('✅ Không có từ nào có ký tự lạ!');
  } else {
    console.log(`⚠️  Tìm thấy ${data.length} từ có ký tự lạ:`);
    data.slice(0, 10).forEach(entry => {
      console.log(`   ID ${entry.id}: ${entry.simplified} - "${entry.vietnamese?.substring(0, 50)}..."`);
    });
  }
}

async function deleteDuplicates(dryRun: boolean = true): Promise<void> {
  console.log(`\n🗑️  ${dryRun ? '[DRY RUN] ' : ''}Xóa từ trùng lặp...`);

  // First, find all duplicates
  const { data: allEntries, error: fetchError } = await supabase
    .from('dictionary_entries')
    .select('id, simplified, pinyin_number')
    .order('id');

  if (fetchError) {
    console.error('❌ Lỗi:', fetchError.message);
    return;
  }

  // Group by simplified + pinyin, keep first (lowest id)
  const seen = new Map<string, number>();
  const toDelete: number[] = [];

  for (const entry of allEntries || []) {
    const key = `${entry.simplified}|${entry.pinyin_number}`;
    if (seen.has(key)) {
      toDelete.push(entry.id);
    } else {
      seen.set(key, entry.id);
    }
  }

  if (toDelete.length === 0) {
    console.log('✅ Không có từ trùng lặp để xóa!');
    return;
  }

  console.log(`📊 Sẽ xóa ${toDelete.length} entries trùng lặp`);

  if (dryRun) {
    console.log('💡 Để thực sự xóa, chạy với tham số --delete');
    return;
  }

  // Delete in batches
  const batchSize = 100;
  let deleted = 0;

  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = toDelete.slice(i, i + batchSize);
    const { error: deleteError } = await supabase
      .from('dictionary_entries')
      .delete()
      .in('id', batch);

    if (deleteError) {
      console.error(`❌ Lỗi xóa batch ${i}:`, deleteError.message);
    } else {
      deleted += batch.length;
      console.log(`   Đã xóa ${deleted}/${toDelete.length} entries...`);
    }
  }

  console.log(`✅ Đã xóa ${deleted} entries trùng lặp!`);
}

async function getStats(): Promise<void> {
  console.log('\n📊 Thống kê từ điển...');

  const { count, error } = await supabase
    .from('dictionary_entries')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Lỗi:', error.message);
    return;
  }

  console.log(`   Tổng số entries: ${count?.toLocaleString()}`);
}

async function main(): Promise<void> {
  console.log('🔧 Kiểm tra từ điển Supabase');
  console.log('================================');

  const args = process.argv.slice(2);
  const shouldDelete = args.includes('--delete');

  await getStats();
  await findDuplicates();
  await findEmptyPinyin();
  await findEmptyMeaning();
  await findInvalidCharacters();

  if (args.includes('--fix') || shouldDelete) {
    await deleteDuplicates(!shouldDelete);
  }

  console.log('\n================================');
  console.log('✨ Hoàn thành kiểm tra!');

  if (!shouldDelete) {
    console.log('\n💡 Để xóa từ trùng lặp, chạy:');
    console.log('   npx tsx scripts/check-dictionary.ts --fix --delete');
  }
}

main().catch(console.error);
