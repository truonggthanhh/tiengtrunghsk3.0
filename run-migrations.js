#!/usr/bin/env node
/**
 * Script để chạy Supabase migrations cho gamification system
 * Cần có SUPABASE_SERVICE_ROLE_KEY trong environment variables
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase credentials
const supabaseUrl = "https://piwdypvvskuwbyvgyktn.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('   Please set it with: export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Migration files in order
const migrationFiles = [
  '20250114_gamification_system_clean.sql',
  '20250114_seed_badges.sql',
  '20250114_seed_missions.sql',
  '20250114_seed_wheel_rewards.sql',
  '20250114_seed_cards.sql',
  '20250114_seed_bosses_story.sql'
];

async function runMigration(filename) {
  const migrationPath = join(__dirname, 'supabase', 'migrations', filename);

  try {
    console.log(`\n🔄 Running migration: ${filename}`);

    // Read SQL file
    const sql = readFileSync(migrationPath, 'utf8');

    // Execute SQL using Supabase RPC
    // Note: Supabase JS client doesn't directly support raw SQL execution
    // We need to use the REST API endpoint directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // If RPC doesn't work, try using pg connection string approach
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`✅ Successfully ran: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to run ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Gamification Migrations...\n');
  console.log(`📦 Project: ${supabaseUrl}`);
  console.log(`📁 Migration files: ${migrationFiles.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of migrationFiles) {
    const success = await runMigration(file);
    if (success) {
      successCount++;
    } else {
      failCount++;
      console.error(`\n⚠️  Migration failed. Stopping here.`);
      break;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('='.repeat(50));

  if (failCount === 0) {
    console.log('\n🎉 All migrations completed successfully!');
  } else {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
