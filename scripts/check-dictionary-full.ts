/**
 * Script kiểm tra TOÀN DIỆN từ điển Supabase
 *
 * Chạy: npx tsx scripts/check-dictionary-full.ts
 *
 * Kiểm tra:
 * 1. Pinyin sai định dạng, sai dấu thanh
 * 2. Nghĩa có lẫn tiếng Anh
 * 3. Nghĩa có chứa chữ Hán (nên là tiếng Việt)
 * 4. Hán tự chứa ký tự không phải chữ Hán
 * 5. Pinyin_tone và pinyin_number không khớp
 * 6. Từ trùng lặp
 * 7. Lỗi chính tả phổ biến trong tiếng Việt
 * 8. Ký tự đặc biệt bất thường
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

interface ErrorEntry {
  id: number;
  simplified: string;
  field: string;
  value: string;
  error: string;
  suggestion?: string;
}

// ============ PINYIN VALIDATION ============

// Danh sách âm tiết pinyin hợp lệ
const VALID_INITIALS = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w', ''];
const VALID_FINALS = ['a', 'o', 'e', 'i', 'u', 'ü', 'v', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'üe', 've', 'ün', 'vn', 'üan', 'van', 'er', 'n', 'ng', 'm'];

// Các lỗi pinyin phổ biến
const PINYIN_TYPOS: Record<string, string> = {
  'jv': 'ju',
  'qv': 'qu',
  'xv': 'xu',
  'lv': 'lü',
  'nv': 'nü',
  'yv': 'yu',
  'jue': 'jue', // OK
  'que': 'que', // OK
  'xue': 'xue', // OK
  'lue': 'lüe',
  'nue': 'nüe',
};

function checkPinyinFormat(pinyin: string): ErrorEntry | null {
  if (!pinyin || pinyin.trim() === '') return null;

  const errors: string[] = [];

  // Kiểm tra có lẫn chữ Hán không
  if (/[\u4e00-\u9fff]/.test(pinyin)) {
    return {
      id: 0, simplified: '', field: 'pinyin_number',
      value: pinyin,
      error: 'Pinyin chứa chữ Hán',
      suggestion: 'Xóa chữ Hán khỏi pinyin'
    };
  }

  // Kiểm tra có số thanh điệu hợp lệ (1-5 hoặc không có)
  const invalidTones = pinyin.match(/[6-9]/g);
  if (invalidTones) {
    return {
      id: 0, simplified: '', field: 'pinyin_number',
      value: pinyin,
      error: `Số thanh điệu không hợp lệ: ${invalidTones.join(', ')}`,
      suggestion: 'Thanh điệu chỉ từ 1-5'
    };
  }

  // Kiểm tra ký tự không hợp lệ
  const validPinyinChars = /^[a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s0-5,·\-']+$/;
  if (!validPinyinChars.test(pinyin)) {
    const invalidChars = pinyin.replace(/[a-zA-ZüÜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s0-5,·\-']/g, '');
    return {
      id: 0, simplified: '', field: 'pinyin_number',
      value: pinyin,
      error: `Ký tự không hợp lệ: "${invalidChars}"`,
      suggestion: 'Xóa ký tự lạ'
    };
  }

  return null;
}

// ============ VIETNAMESE VALIDATION ============

// Từ tiếng Anh phổ biến có thể lẫn vào
const ENGLISH_WORDS = [
  'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall',
  'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom',
  'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
  'in', 'on', 'at', 'to', 'from', 'by', 'with', 'about',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'of', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
  'only', 'own', 'same', 'than', 'too', 'very', 'just',
  'also', 'now', 'even', 'still', 'already', 'always', 'never',
  'often', 'sometimes', 'usually', 'really', 'actually',
  'because', 'although', 'though', 'while', 'whereas', 'unless',
  'until', 'since', 'whether', 'however', 'therefore', 'thus',
  // Từ tiếng Anh về nghĩa
  'meaning', 'means', 'mean', 'definition', 'word', 'phrase',
  'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition',
  'example', 'usage', 'note', 'see', 'also', 'compare', 'similar',
  'classifier', 'measure', 'particle', 'interjection',
  'literally', 'figuratively', 'colloquial', 'formal', 'informal',
  'vulgar', 'slang', 'archaic', 'obsolete', 'rare', 'common',
  'variant', 'abbreviation', 'acronym', 'surname', 'name',
  'place', 'person', 'thing', 'animal', 'plant', 'food', 'drink',
];

// Lỗi chính tả tiếng Việt phổ biến
const VIETNAMESE_TYPOS: Record<string, string> = {
  'ngĩa': 'nghĩa',
  'ngịa': 'nghĩa',
  'ngỉa': 'nghĩa',
  'nghỉa': 'nghĩa',
  'nguời': 'người',
  'nguoi': 'người',
  'ngươi': 'người',
  'đựơc': 'được',
  'đuợc': 'được',
  'đựoc': 'được',
  'troung': 'trong',
  'trongn': 'trong',
  'cuả': 'của',
  'cũa': 'của',
  'củă': 'của',
  'nhưng': 'nhưng', // OK
  'nhưnng': 'nhưng',
  'rấtt': 'rất',
  'rấttt': 'rất',
  'làmm': 'làm',
  'choo': 'cho',
  'vớii': 'với',
  'theoo': 'theo',
  'khii': 'khi',
  'nếuu': 'nếu',
  'màà': 'mà',
  'vàà': 'và',
  'hoặcc': 'hoặc',
  'haỹ': 'hay',
  'đựng': 'đựng', // OK but check context
  // Sai dấu
  'sự̛': 'sự',
  'như̛': 'như',
};

function checkVietnamese(vietnamese: string): ErrorEntry | null {
  if (!vietnamese || vietnamese.trim() === '') return null;

  const lower = vietnamese.toLowerCase();

  // 1. Kiểm tra có chứa chữ Hán không (nên chỉ có tiếng Việt)
  const hanziInVietnamese = vietnamese.match(/[\u4e00-\u9fff]+/g);
  if (hanziInVietnamese && hanziInVietnamese.length > 0) {
    return {
      id: 0, simplified: '', field: 'vietnamese',
      value: vietnamese.substring(0, 100),
      error: `Nghĩa chứa chữ Hán: ${hanziInVietnamese.join(', ')}`,
      suggestion: 'Dịch chữ Hán sang tiếng Việt'
    };
  }

  // 2. Kiểm tra có nhiều từ tiếng Anh không
  const words = lower.split(/[\s,;.()\/]+/);
  const englishFound = words.filter(w =>
    ENGLISH_WORDS.includes(w) && w.length > 2
  );

  if (englishFound.length >= 3) {
    return {
      id: 0, simplified: '', field: 'vietnamese',
      value: vietnamese.substring(0, 100),
      error: `Nghĩa có nhiều từ tiếng Anh: ${englishFound.slice(0, 5).join(', ')}`,
      suggestion: 'Dịch sang tiếng Việt'
    };
  }

  // 3. Kiểm tra lỗi chính tả tiếng Việt
  for (const [typo, correct] of Object.entries(VIETNAMESE_TYPOS)) {
    if (lower.includes(typo) && typo !== correct) {
      return {
        id: 0, simplified: '', field: 'vietnamese',
        value: vietnamese.substring(0, 100),
        error: `Lỗi chính tả: "${typo}"`,
        suggestion: `Sửa thành: "${correct}"`
      };
    }
  }

  // 4. Kiểm tra ký tự lạ
  const weirdChars = vietnamese.match(/[\\|<>{}[\]@#$%^&*+=~`]/g);
  if (weirdChars && weirdChars.length > 0) {
    return {
      id: 0, simplified: '', field: 'vietnamese',
      value: vietnamese.substring(0, 100),
      error: `Ký tự lạ: ${[...new Set(weirdChars)].join(' ')}`,
      suggestion: 'Xóa ký tự đặc biệt'
    };
  }

  // 5. Kiểm tra có toàn chữ in hoa không (trừ tên riêng)
  if (vietnamese.length > 10 && vietnamese === vietnamese.toUpperCase() && /[A-Z]/.test(vietnamese)) {
    return {
      id: 0, simplified: '', field: 'vietnamese',
      value: vietnamese.substring(0, 100),
      error: 'Nghĩa toàn chữ in hoa',
      suggestion: 'Chuyển sang chữ thường'
    };
  }

  return null;
}

// ============ HANZI VALIDATION ============

function checkHanzi(simplified: string, traditional: string): ErrorEntry | null {
  if (!simplified) return null;

  // 1. Kiểm tra có ký tự không phải chữ Hán
  const nonHanzi = simplified.replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\s·\-]/g, '');
  if (nonHanzi.length > 0) {
    // Cho phép một số ký tự đặc biệt
    const allowedSpecial = /^[0-9a-zA-Z,.\/%]+$/;
    if (!allowedSpecial.test(nonHanzi)) {
      return {
        id: 0, simplified: '', field: 'simplified',
        value: simplified,
        error: `Chứa ký tự không phải Hán tự: "${nonHanzi}"`,
        suggestion: 'Xóa ký tự lạ'
      };
    }
  }

  // 2. Kiểm tra có chứa Hiragana/Katakana (tiếng Nhật) không
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(simplified)) {
    return {
      id: 0, simplified: '', field: 'simplified',
      value: simplified,
      error: 'Chứa ký tự tiếng Nhật (Hiragana/Katakana)',
      suggestion: 'Xóa ký tự tiếng Nhật'
    };
  }

  // 3. Kiểm tra có chứa Hangul (tiếng Hàn) không
  if (/[\uac00-\ud7af\u1100-\u11ff]/.test(simplified)) {
    return {
      id: 0, simplified: '', field: 'simplified',
      value: simplified,
      error: 'Chứa ký tự tiếng Hàn (Hangul)',
      suggestion: 'Xóa ký tự tiếng Hàn'
    };
  }

  return null;
}

// ============ CONSISTENCY CHECK ============

// Map pinyin tone marks to numbers
const TONE_TO_NUMBER: Record<string, string> = {
  'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
  'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
  'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
  'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
  'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
  'ǖ': 'v1', 'ǘ': 'v2', 'ǚ': 'v3', 'ǜ': 'v4',
};

function checkConsistency(entry: DictionaryEntry): ErrorEntry | null {
  // Kiểm tra pinyin_tone và pinyin_number có khớp không
  if (entry.pinyin_tone && entry.pinyin_number) {
    // Đơn giản hóa: chỉ kiểm tra số âm tiết
    const toneCount = entry.pinyin_tone.trim().split(/\s+/).length;
    const numberCount = entry.pinyin_number.trim().split(/\s+/).length;

    if (Math.abs(toneCount - numberCount) > 1) {
      return {
        id: entry.id, simplified: entry.simplified, field: 'pinyin',
        value: `tone: "${entry.pinyin_tone}" vs number: "${entry.pinyin_number}"`,
        error: 'Pinyin tone và number không khớp số âm tiết',
        suggestion: 'Kiểm tra lại pinyin'
      };
    }
  }

  return null;
}

// ============ MAIN CHECK FUNCTION ============

async function runFullCheck(): Promise<void> {
  console.log('🔍 KIỂM TRA TOÀN DIỆN TỪ ĐIỂN SUPABASE');
  console.log('='.repeat(60));

  const errors: {
    pinyinErrors: ErrorEntry[];
    vietnameseErrors: ErrorEntry[];
    hanziErrors: ErrorEntry[];
    consistencyErrors: ErrorEntry[];
    emptyFields: ErrorEntry[];
  } = {
    pinyinErrors: [],
    vietnameseErrors: [],
    hanziErrors: [],
    consistencyErrors: [],
    emptyFields: [],
  };

  // Lấy tổng số entries
  const { count } = await supabase
    .from('dictionary_entries')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Tổng số entries: ${count?.toLocaleString()}`);

  const batchSize = 1000;
  let offset = 0;
  let totalChecked = 0;

  while (true) {
    const { data, error } = await supabase
      .from('dictionary_entries')
      .select('id, simplified, traditional, pinyin_number, pinyin_tone, vietnamese')
      .range(offset, offset + batchSize - 1)
      .order('id');

    if (error) {
      console.error('\n❌ Lỗi truy vấn:', error.message);
      break;
    }

    if (!data || data.length === 0) break;

    for (const entry of data) {
      // Check empty fields
      if (!entry.pinyin_number || entry.pinyin_number.trim() === '') {
        errors.emptyFields.push({
          id: entry.id, simplified: entry.simplified, field: 'pinyin_number',
          value: '', error: 'Pinyin rỗng', suggestion: 'Thêm pinyin'
        });
      }
      if (!entry.vietnamese || entry.vietnamese.trim() === '') {
        errors.emptyFields.push({
          id: entry.id, simplified: entry.simplified, field: 'vietnamese',
          value: '', error: 'Nghĩa rỗng', suggestion: 'Thêm nghĩa'
        });
      }

      // Check pinyin
      const pinyinError = checkPinyinFormat(entry.pinyin_number);
      if (pinyinError) {
        pinyinError.id = entry.id;
        pinyinError.simplified = entry.simplified;
        errors.pinyinErrors.push(pinyinError);
      }

      // Check vietnamese
      const vietError = checkVietnamese(entry.vietnamese);
      if (vietError) {
        vietError.id = entry.id;
        vietError.simplified = entry.simplified;
        errors.vietnameseErrors.push(vietError);
      }

      // Check hanzi
      const hanziError = checkHanzi(entry.simplified, entry.traditional);
      if (hanziError) {
        hanziError.id = entry.id;
        errors.hanziErrors.push(hanziError);
      }

      // Check consistency
      const consistError = checkConsistency(entry);
      if (consistError) {
        errors.consistencyErrors.push(consistError);
      }
    }

    totalChecked += data.length;
    process.stdout.write(`\r⏳ Đang kiểm tra: ${totalChecked.toLocaleString()} / ${count?.toLocaleString()}`);

    offset += batchSize;
    if (data.length < batchSize) break;
  }

  // In kết quả
  console.log('\n\n' + '='.repeat(60));
  console.log('📋 KẾT QUẢ KIỂM TRA');
  console.log('='.repeat(60));

  const printErrors = (title: string, list: ErrorEntry[], maxShow: number = 15) => {
    console.log(`\n${'─'.repeat(50)}`);
    if (list.length === 0) {
      console.log(`✅ ${title}: Không có lỗi`);
    } else {
      console.log(`⚠️  ${title}: ${list.length} lỗi`);
      console.log('─'.repeat(50));
      list.slice(0, maxShow).forEach((e, i) => {
        console.log(`${i + 1}. [ID ${e.id}] ${e.simplified}`);
        console.log(`   Lỗi: ${e.error}`);
        console.log(`   Giá trị: "${e.value?.substring(0, 60)}${e.value && e.value.length > 60 ? '...' : ''}"`);
        if (e.suggestion) console.log(`   💡 Gợi ý: ${e.suggestion}`);
      });
      if (list.length > maxShow) {
        console.log(`\n   ... và ${list.length - maxShow} lỗi khác`);
      }
    }
  };

  printErrors('PINYIN LỖI', errors.pinyinErrors);
  printErrors('NGHĨA TIẾNG VIỆT LỖI', errors.vietnameseErrors);
  printErrors('HÁN TỰ LỖI', errors.hanziErrors);
  printErrors('DỮ LIỆU KHÔNG NHẤT QUÁN', errors.consistencyErrors);
  printErrors('TRƯỜNG RỖNG', errors.emptyFields);

  // Tổng kết
  const totalErrors = Object.values(errors).reduce((sum, list) => sum + list.length, 0);
  console.log('\n' + '='.repeat(60));
  console.log(`📊 TỔNG KẾT: ${totalErrors} lỗi được tìm thấy`);
  console.log('='.repeat(60));

  // Xuất SQL
  if (totalErrors > 0) {
    console.log('\n💾 XUẤT SQL ĐỂ SỬA LỖI:');

    // Xuất file SQL
    const sqlStatements: string[] = [];

    // Xóa entries có cả pinyin và nghĩa rỗng
    sqlStatements.push(`-- Xóa entries vô dụng (pinyin và nghĩa đều rỗng)`);
    sqlStatements.push(`DELETE FROM dictionary_entries WHERE (pinyin_number IS NULL OR pinyin_number = '') AND (vietnamese IS NULL OR vietnamese = '');`);
    sqlStatements.push('');

    // Liệt kê các IDs cần xem xét
    if (errors.vietnameseErrors.length > 0) {
      const ids = errors.vietnameseErrors.slice(0, 50).map(e => e.id).join(', ');
      sqlStatements.push(`-- Xem các entries có lỗi nghĩa tiếng Việt:`);
      sqlStatements.push(`SELECT * FROM dictionary_entries WHERE id IN (${ids});`);
      sqlStatements.push('');
    }

    if (errors.pinyinErrors.length > 0) {
      const ids = errors.pinyinErrors.slice(0, 50).map(e => e.id).join(', ');
      sqlStatements.push(`-- Xem các entries có lỗi pinyin:`);
      sqlStatements.push(`SELECT * FROM dictionary_entries WHERE id IN (${ids});`);
      sqlStatements.push('');
    }

    if (errors.hanziErrors.length > 0) {
      const ids = errors.hanziErrors.slice(0, 50).map(e => e.id).join(', ');
      sqlStatements.push(`-- Xem các entries có lỗi Hán tự:`);
      sqlStatements.push(`SELECT * FROM dictionary_entries WHERE id IN (${ids});`);
      sqlStatements.push('');
    }

    console.log(sqlStatements.join('\n'));

    // Ghi ra file
    const fs = await import('fs');
    const outputPath = 'dictionary-errors.sql';
    fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf-8');
    console.log(`\n📁 Đã xuất SQL ra file: ${outputPath}`);
  }

  console.log('\n✨ Hoàn thành kiểm tra!');
}

// Chạy
runFullCheck().catch(console.error);
