/**
 * Script kiểm tra lỗi từ điển Supabase - Phiên bản đầy đủ
 *
 * Chạy: npx tsx scripts/check-dictionary-errors.ts
 *
 * Kiểm tra:
 * 1. Từ trùng lặp
 * 2. Pinyin rỗng hoặc sai định dạng
 * 3. Nghĩa rỗng hoặc quá ngắn
 * 4. Ký tự lạ trong nghĩa
 * 5. Pinyin không khớp với số âm tiết của Hán tự
 * 6. Hán tự có ký tự không hợp lệ
 */

import { createClient } from '@supabase/supabase-js';

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL || "https://piwdypvvskuwbyvgyktn.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpd2R5cHZ2c2t1d2J5dmd5a3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjczMjIsImV4cCI6MjA2NzA0MzMyMn0.uspMCRgaRq1HVtUXMQuW6RuLuXDqaMq-76gTpYJ5iRQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface DictionaryEntry {
  id: number;
  simplified: string;
  traditional: string;
  pinyin_number: string;
  pinyin_tone: string;
  vietnamese: string;
}

// Kiểm tra pinyin có hợp lệ không
function isValidPinyin(pinyin: string): { valid: boolean; reason?: string } {
  if (!pinyin || pinyin.trim() === '') {
    return { valid: false, reason: 'Pinyin rỗng' };
  }

  // Pinyin hợp lệ chỉ chứa chữ cái, số 1-5, dấu cách và một số ký tự đặc biệt
  const validPinyinRegex = /^[a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s0-5,·\-]+$/;
  if (!validPinyinRegex.test(pinyin)) {
    return { valid: false, reason: 'Chứa ký tự không hợp lệ' };
  }

  return { valid: true };
}

// Đếm số âm tiết trong pinyin
function countPinyinSyllables(pinyin: string): number {
  if (!pinyin) return 0;
  // Tách theo dấu cách hoặc số thanh điệu
  const syllables = pinyin.trim().split(/[\s]+/).filter(s => s.length > 0);
  return syllables.length;
}

// Đếm số chữ Hán
function countHanzi(text: string): number {
  if (!text) return 0;
  const hanziRegex = /[\u4e00-\u9fff]/g;
  const matches = text.match(hanziRegex);
  return matches ? matches.length : 0;
}

// Kiểm tra có phải chữ Hán hợp lệ không
function isValidHanzi(text: string): { valid: boolean; reason?: string } {
  if (!text || text.trim() === '') {
    return { valid: false, reason: 'Hán tự rỗng' };
  }

  // Chỉ cho phép chữ Hán và một số ký tự đặc biệt
  const validChars = /^[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff·\-\s]+$/;
  if (!validChars.test(text)) {
    // Tìm ký tự không hợp lệ
    const invalidChars = text.replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff·\-\s]/g, '');
    return { valid: false, reason: `Chứa ký tự lạ: "${invalidChars}"` };
  }

  return { valid: true };
}

// Kiểm tra nghĩa
function isValidMeaning(meaning: string): { valid: boolean; reason?: string } {
  if (!meaning || meaning.trim() === '') {
    return { valid: false, reason: 'Nghĩa rỗng' };
  }

  if (meaning.trim().length < 2) {
    return { valid: false, reason: 'Nghĩa quá ngắn' };
  }

  // Kiểm tra ký tự lạ
  if (/[\\]{2,}/.test(meaning)) {
    return { valid: false, reason: 'Chứa backslash' };
  }

  // Kiểm tra có toàn số không
  if (/^\d+$/.test(meaning.trim())) {
    return { valid: false, reason: 'Nghĩa chỉ có số' };
  }

  return { valid: true };
}

async function checkAllErrors(): Promise<void> {
  console.log('🔧 KIỂM TRA LỖI TỪ ĐIỂN SUPABASE');
  console.log('='.repeat(50));

  const errors: { type: string; entries: any[] }[] = [];
  const batchSize = 1000;
  let offset = 0;
  let totalChecked = 0;

  // Lấy tổng số entries
  const { count } = await supabase
    .from('dictionary_entries')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Tổng số entries: ${count?.toLocaleString()}`);
  console.log('\n⏳ Đang kiểm tra...\n');

  const errorLists = {
    emptyPinyin: [] as any[],
    invalidPinyin: [] as any[],
    emptyMeaning: [] as any[],
    shortMeaning: [] as any[],
    invalidMeaning: [] as any[],
    invalidHanzi: [] as any[],
    mismatchSyllables: [] as any[],
    duplicates: [] as any[],
  };

  // Kiểm tra từng batch
  while (true) {
    const { data, error } = await supabase
      .from('dictionary_entries')
      .select('id, simplified, traditional, pinyin_number, pinyin_tone, vietnamese')
      .range(offset, offset + batchSize - 1)
      .order('id');

    if (error) {
      console.error('❌ Lỗi truy vấn:', error.message);
      break;
    }

    if (!data || data.length === 0) break;

    for (const entry of data) {
      // 1. Kiểm tra pinyin rỗng
      if (!entry.pinyin_number || entry.pinyin_number.trim() === '') {
        errorLists.emptyPinyin.push({
          id: entry.id,
          hanzi: entry.simplified,
          pinyin: entry.pinyin_number,
          meaning: entry.vietnamese?.substring(0, 30)
        });
      } else {
        // 2. Kiểm tra pinyin hợp lệ
        const pinyinCheck = isValidPinyin(entry.pinyin_number);
        if (!pinyinCheck.valid) {
          errorLists.invalidPinyin.push({
            id: entry.id,
            hanzi: entry.simplified,
            pinyin: entry.pinyin_number,
            reason: pinyinCheck.reason
          });
        }

        // 3. Kiểm tra số âm tiết khớp với số chữ Hán
        const hanziCount = countHanzi(entry.simplified);
        const syllableCount = countPinyinSyllables(entry.pinyin_number);
        if (hanziCount > 1 && syllableCount > 0 && hanziCount !== syllableCount) {
          errorLists.mismatchSyllables.push({
            id: entry.id,
            hanzi: entry.simplified,
            pinyin: entry.pinyin_number,
            hanziCount,
            syllableCount
          });
        }
      }

      // 4. Kiểm tra nghĩa
      const meaningCheck = isValidMeaning(entry.vietnamese);
      if (!meaningCheck.valid) {
        if (meaningCheck.reason === 'Nghĩa rỗng') {
          errorLists.emptyMeaning.push({
            id: entry.id,
            hanzi: entry.simplified,
            pinyin: entry.pinyin_number
          });
        } else if (meaningCheck.reason === 'Nghĩa quá ngắn') {
          errorLists.shortMeaning.push({
            id: entry.id,
            hanzi: entry.simplified,
            meaning: entry.vietnamese
          });
        } else {
          errorLists.invalidMeaning.push({
            id: entry.id,
            hanzi: entry.simplified,
            meaning: entry.vietnamese?.substring(0, 50),
            reason: meaningCheck.reason
          });
        }
      }

      // 5. Kiểm tra Hán tự hợp lệ
      const hanziCheck = isValidHanzi(entry.simplified);
      if (!hanziCheck.valid) {
        errorLists.invalidHanzi.push({
          id: entry.id,
          hanzi: entry.simplified,
          reason: hanziCheck.reason
        });
      }
    }

    totalChecked += data.length;
    process.stdout.write(`\r   Đã kiểm tra: ${totalChecked.toLocaleString()} / ${count?.toLocaleString()}`);

    offset += batchSize;
    if (data.length < batchSize) break;
  }

  console.log('\n');

  // In kết quả
  console.log('='.repeat(50));
  console.log('📋 KẾT QUẢ KIỂM TRA');
  console.log('='.repeat(50));

  const printErrors = (title: string, list: any[], maxShow: number = 10) => {
    if (list.length === 0) {
      console.log(`\n✅ ${title}: Không có lỗi`);
    } else {
      console.log(`\n⚠️  ${title}: ${list.length} lỗi`);
      list.slice(0, maxShow).forEach((e, i) => {
        console.log(`   ${i + 1}. ID ${e.id}: ${e.hanzi} - ${e.pinyin || ''} ${e.reason || ''} ${e.meaning || ''}`);
      });
      if (list.length > maxShow) {
        console.log(`   ... và ${list.length - maxShow} lỗi khác`);
      }
    }
  };

  printErrors('Pinyin rỗng', errorLists.emptyPinyin);
  printErrors('Pinyin không hợp lệ', errorLists.invalidPinyin);
  printErrors('Số âm tiết không khớp', errorLists.mismatchSyllables);
  printErrors('Nghĩa rỗng', errorLists.emptyMeaning);
  printErrors('Nghĩa quá ngắn (< 2 ký tự)', errorLists.shortMeaning);
  printErrors('Nghĩa có ký tự lạ', errorLists.invalidMeaning);
  printErrors('Hán tự không hợp lệ', errorLists.invalidHanzi);

  // Tổng kết
  const totalErrors = Object.values(errorLists).reduce((sum, list) => sum + list.length, 0);
  console.log('\n' + '='.repeat(50));
  console.log(`📊 TỔNG KẾT: ${totalErrors} lỗi được tìm thấy`);
  console.log('='.repeat(50));

  // Xuất SQL để sửa lỗi
  if (totalErrors > 0) {
    console.log('\n💡 SQL ĐỂ XEM CHI TIẾT:');

    if (errorLists.emptyPinyin.length > 0) {
      console.log('\n-- Xem từ có pinyin rỗng:');
      console.log(`SELECT * FROM dictionary_entries WHERE pinyin_number IS NULL OR pinyin_number = '' LIMIT 100;`);
    }

    if (errorLists.emptyMeaning.length > 0) {
      console.log('\n-- Xem từ có nghĩa rỗng:');
      console.log(`SELECT * FROM dictionary_entries WHERE vietnamese IS NULL OR vietnamese = '' LIMIT 100;`);
    }

    if (errorLists.shortMeaning.length > 0) {
      console.log('\n-- Xem từ có nghĩa quá ngắn:');
      console.log(`SELECT * FROM dictionary_entries WHERE LENGTH(vietnamese) < 2 LIMIT 100;`);
    }

    console.log('\n-- Xóa từ có pinyin VÀ nghĩa đều rỗng (vô dụng):');
    console.log(`DELETE FROM dictionary_entries WHERE (pinyin_number IS NULL OR pinyin_number = '') AND (vietnamese IS NULL OR vietnamese = '');`);
  }
}

// Kiểm tra từ trùng lặp riêng
async function checkDuplicates(): Promise<void> {
  console.log('\n🔍 Kiểm tra từ trùng lặp...');

  const { data, error } = await supabase.rpc('get_duplicate_entries');

  if (error) {
    // Nếu function không tồn tại, dùng query thay thế
    console.log('   (Đang dùng phương pháp thay thế...)');

    const { data: allData, error: allError } = await supabase
      .from('dictionary_entries')
      .select('simplified, pinyin_number')
      .order('simplified');

    if (allError) {
      console.error('❌ Lỗi:', allError.message);
      return;
    }

    const counts = new Map<string, number>();
    for (const entry of allData || []) {
      const key = `${entry.simplified}|${entry.pinyin_number}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const duplicates = Array.from(counts.entries())
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1]);

    if (duplicates.length === 0) {
      console.log('✅ Không có từ trùng lặp!');
    } else {
      console.log(`⚠️  Tìm thấy ${duplicates.length} cặp từ trùng lặp`);
      duplicates.slice(0, 10).forEach(([key, count]) => {
        const [simplified, pinyin] = key.split('|');
        console.log(`   ${simplified} (${pinyin}): ${count} lần`);
      });

      console.log('\n-- SQL để xóa từ trùng lặp:');
      console.log(`DELETE FROM dictionary_entries a USING dictionary_entries b WHERE a.id > b.id AND a.simplified = b.simplified AND a.pinyin_number = b.pinyin_number;`);
    }
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--duplicates-only')) {
    await checkDuplicates();
  } else {
    await checkAllErrors();
    await checkDuplicates();
  }

  console.log('\n✨ Hoàn thành kiểm tra!');
}

main().catch(console.error);
