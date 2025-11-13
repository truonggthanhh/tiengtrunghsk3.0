#!/usr/bin/env node

/**
 * CVDICT Data Converter
 * Converts CVDICT.u8 file to JSON and SQL format for Supabase import
 *
 * Usage:
 *   node scripts/convert-cvdict.js <input-file> [output-dir]
 *
 * Example:
 *   node scripts/convert-cvdict.js CVDICT.u8 ./dictionary-data
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Pinyin tone conversion map
const PINYIN_TONE_MAP = {
  'a1': 'ā', 'a2': 'á', 'a3': 'ǎ', 'a4': 'à',
  'e1': 'ē', 'e2': 'é', 'e3': 'ě', 'e4': 'è',
  'i1': 'ī', 'i2': 'í', 'i3': 'ǐ', 'i4': 'ì',
  'o1': 'ō', 'o2': 'ó', 'o3': 'ǒ', 'o4': 'ò',
  'u1': 'ū', 'u2': 'ú', 'u3': 'ǔ', 'u4': 'ù',
  'v1': 'ǖ', 'v2': 'ǘ', 'v3': 'ǚ', 'v4': 'ǜ',
  'ü1': 'ǖ', 'ü2': 'ǘ', 'ü3': 'ǚ', 'ü4': 'ǜ',
};

/**
 * Convert pinyin with numbers to pinyin with tone marks
 * Example: "ni3 hao3" -> "nǐ hǎo"
 */
function convertPinyinToTone(pinyinNumber) {
  if (!pinyinNumber) return null;

  let result = pinyinNumber.toLowerCase();

  // Replace each vowel+number combination with the toned vowel
  for (const [key, value] of Object.entries(PINYIN_TONE_MAP)) {
    const regex = new RegExp(key, 'g');
    result = result.replace(regex, value);
  }

  // Remove any remaining numbers
  result = result.replace(/[0-9]/g, '');

  return result;
}

/**
 * Parse a single line from CVDICT.u8
 * Format can be one of:
 * 1. Traditional Simplified [pinyin] /definition1/definition2/
 * 2. Simplified [pinyin] /definition/
 * 3. Tab-separated: Simplified\tTraditional\tPinyin\tDefinition
 */
function parseCVDICTLine(line, lineNumber) {
  try {
    line = line.trim();
    if (!line || line.startsWith('#')) return null;

    // Try tab-separated format first
    if (line.includes('\t')) {
      const parts = line.split('\t');
      if (parts.length >= 3) {
        return {
          simplified: parts[0].trim(),
          traditional: parts[1].trim() || parts[0].trim(),
          pinyin_number: parts[2].trim(),
          pinyin_tone: convertPinyinToTone(parts[2].trim()),
          vietnamese: parts.slice(3).join('; ').trim(),
          raw_source: line
        };
      }
    }

    // Try CC-CEDICT format: Traditional Simplified [pinyin] /def1/def2/
    const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/);
    if (match) {
      const [, traditional, simplified, pinyin, definitions] = match;
      return {
        simplified: simplified.trim(),
        traditional: traditional.trim(),
        pinyin_number: pinyin.trim(),
        pinyin_tone: convertPinyinToTone(pinyin.trim()),
        vietnamese: definitions.split('/').filter(d => d.trim()).join('; '),
        raw_source: line
      };
    }

    // Try simple format: Simplified [pinyin] /definition/
    const simpleMatch = line.match(/^(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/);
    if (simpleMatch) {
      const [, simplified, pinyin, definitions] = simpleMatch;
      return {
        simplified: simplified.trim(),
        traditional: simplified.trim(),
        pinyin_number: pinyin.trim(),
        pinyin_tone: convertPinyinToTone(pinyin.trim()),
        vietnamese: definitions.split('/').filter(d => d.trim()).join('; '),
        raw_source: line
      };
    }

    console.warn(`[Line ${lineNumber}] Could not parse: ${line.substring(0, 100)}`);
    return null;
  } catch (error) {
    console.error(`[Line ${lineNumber}] Error parsing:`, error.message);
    return null;
  }
}

/**
 * Escape string for SQL
 */
function escapeSQLString(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

/**
 * Generate SQL INSERT statement
 */
function generateSQLInsert(entry, batchSize = 100) {
  const values = `(${escapeSQLString(entry.simplified)}, ${escapeSQLString(entry.traditional)}, ${escapeSQLString(entry.pinyin_number)}, ${escapeSQLString(entry.pinyin_tone)}, ${escapeSQLString(entry.vietnamese)}, 'CVDICT')`;
  return values;
}

/**
 * Main conversion function
 */
async function convertCVDICT(inputFile, outputDir) {
  console.log('🚀 Starting CVDICT conversion...');
  console.log(`📁 Input file: ${inputFile}`);
  console.log(`📁 Output directory: ${outputDir}`);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jsonOutputPath = path.join(outputDir, 'dictionary.json');
  const sqlOutputPath = path.join(outputDir, 'dictionary-import.sql');
  const csvOutputPath = path.join(outputDir, 'dictionary.csv');
  const statsPath = path.join(outputDir, 'conversion-stats.json');

  // Statistics
  const stats = {
    totalLines: 0,
    parsedEntries: 0,
    failedLines: 0,
    startTime: new Date().toISOString()
  };

  // Storage for entries
  const entries = [];
  const sqlInsertValues = [];

  // Create read stream
  const fileStream = fs.createReadStream(inputFile, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // Process each line
  for await (const line of rl) {
    stats.totalLines++;

    const entry = parseCVDICTLine(line, stats.totalLines);

    if (entry) {
      entries.push(entry);
      sqlInsertValues.push(generateSQLInsert(entry));
      stats.parsedEntries++;
    } else {
      stats.failedLines++;
    }

    // Progress indicator
    if (stats.totalLines % 10000 === 0) {
      console.log(`📊 Processed ${stats.totalLines} lines, ${stats.parsedEntries} entries parsed...`);
    }
  }

  console.log(`\n✅ Finished processing ${stats.totalLines} lines`);
  console.log(`✅ Successfully parsed ${stats.parsedEntries} entries`);
  console.log(`❌ Failed to parse ${stats.failedLines} lines`);

  // Write JSON output
  console.log(`\n💾 Writing JSON to ${jsonOutputPath}...`);
  fs.writeFileSync(jsonOutputPath, JSON.stringify(entries, null, 2), 'utf8');

  // Write SQL output in batches
  console.log(`💾 Writing SQL to ${sqlOutputPath}...`);
  const sqlStream = fs.createWriteStream(sqlOutputPath, { encoding: 'utf8' });

  sqlStream.write('-- Auto-generated SQL import for CVDICT\n');
  sqlStream.write('-- Generated at: ' + new Date().toISOString() + '\n\n');
  sqlStream.write('-- Disable triggers for faster import\n');
  sqlStream.write('ALTER TABLE dictionary_entries DISABLE TRIGGER ALL;\n\n');

  const batchSize = 100;
  for (let i = 0; i < sqlInsertValues.length; i += batchSize) {
    const batch = sqlInsertValues.slice(i, i + batchSize);
    sqlStream.write(
      `INSERT INTO dictionary_entries (simplified, traditional, pinyin_number, pinyin_tone, vietnamese, source) VALUES\n` +
      batch.join(',\n') +
      ';\n\n'
    );
  }

  sqlStream.write('-- Re-enable triggers\n');
  sqlStream.write('ALTER TABLE dictionary_entries ENABLE TRIGGER ALL;\n\n');
  sqlStream.write('-- Analyze table for better query performance\n');
  sqlStream.write('ANALYZE dictionary_entries;\n');
  sqlStream.end();

  // Write CSV output
  console.log(`💾 Writing CSV to ${csvOutputPath}...`);
  const csvStream = fs.createWriteStream(csvOutputPath, { encoding: 'utf8' });
  csvStream.write('simplified,traditional,pinyin_number,pinyin_tone,vietnamese,source\n');

  for (const entry of entries) {
    const row = [
      `"${entry.simplified.replace(/"/g, '""')}"`,
      `"${entry.traditional.replace(/"/g, '""')}"`,
      `"${entry.pinyin_number.replace(/"/g, '""')}"`,
      `"${entry.pinyin_tone ? entry.pinyin_tone.replace(/"/g, '""') : ''}"`,
      `"${entry.vietnamese.replace(/"/g, '""')}"`,
      '"CVDICT"'
    ];
    csvStream.write(row.join(',') + '\n');
  }
  csvStream.end();

  // Write statistics
  stats.endTime = new Date().toISOString();
  stats.outputFiles = {
    json: jsonOutputPath,
    sql: sqlOutputPath,
    csv: csvOutputPath
  };

  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');

  console.log(`\n✨ Conversion complete!`);
  console.log(`\n📊 Statistics:`);
  console.log(`   Total lines: ${stats.totalLines}`);
  console.log(`   Parsed entries: ${stats.parsedEntries}`);
  console.log(`   Failed lines: ${stats.failedLines}`);
  console.log(`   Success rate: ${((stats.parsedEntries / stats.totalLines) * 100).toFixed(2)}%`);
  console.log(`\n📁 Output files:`);
  console.log(`   JSON: ${jsonOutputPath}`);
  console.log(`   SQL:  ${sqlOutputPath}`);
  console.log(`   CSV:  ${csvOutputPath}`);
  console.log(`   Stats: ${statsPath}`);
  console.log(`\n🎉 Done!`);
}

// CLI Entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('❌ Usage: node convert-cvdict.js <input-file> [output-dir]');
    console.error('   Example: node convert-cvdict.js CVDICT.u8 ./dictionary-data');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputDir = args[1] || './dictionary-data';

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    process.exit(1);
  }

  convertCVDICT(inputFile, outputDir)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Conversion failed:', error);
      process.exit(1);
    });
}

module.exports = { convertCVDICT, parseCVDICTLine, convertPinyinToTone };
