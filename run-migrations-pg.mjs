#!/usr/bin/env node
/**
 * Script để chạy Supabase migrations cho gamification system
 * Sử dụng pg library để kết nối trực tiếp với PostgreSQL database
 *
 * Cách sử dụng:
 *   SUPABASE_DB_PASSWORD="your_password" node run-migrations-pg.mjs
 */

import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Supabase project details
const PROJECT_REF = 'piwdypvvskuwbyvgyktn';
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!DB_PASSWORD) {
  console.error(`${colors.red}❌ Error: SUPABASE_DB_PASSWORD environment variable is required${colors.reset}`);
  console.error(`${colors.yellow}Please set it with:${colors.reset}`);
  console.error('   export SUPABASE_DB_PASSWORD="your_db_password"');
  console.error('\nOr run inline:');
  console.error('   SUPABASE_DB_PASSWORD="your_password" node run-migrations-pg.mjs');
  console.error('\n📖 Get your password from:');
  console.error(`   https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database`);
  process.exit(1);
}

// Database connection config
const connectionConfig = {
  host: `db.${PROJECT_REF}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
};

// Migration files in order
const migrationFiles = [
  '20250114_gamification_system_clean.sql',
  '20250114_seed_badges.sql',
  '20250114_seed_missions.sql',
  '20250114_seed_wheel_rewards.sql',
  '20250114_seed_cards.sql',
  '20250114_seed_bosses_story.sql'
];

async function runMigration(client, filename) {
  const migrationPath = join(__dirname, 'supabase', 'migrations', filename);

  try {
    console.log(`\n${colors.yellow}🔄 Running migration: ${filename}${colors.reset}`);

    // Read SQL file
    const sql = readFileSync(migrationPath, 'utf8');

    // Execute SQL
    await client.query(sql);

    console.log(`${colors.green}✅ Successfully completed: ${filename}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Failed to run ${filename}:${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    if (error.detail) {
      console.error(`${colors.yellow}Detail: ${error.detail}${colors.reset}`);
    }
    return false;
  }
}

async function main() {
  console.log(`${colors.blue}============================================${colors.reset}`);
  console.log(`${colors.blue}  Gamification Migrations Runner${colors.reset}`);
  console.log(`${colors.blue}============================================${colors.reset}\n`);
  console.log(`📦 Project: ${PROJECT_REF}`);
  console.log(`📁 Migration files: ${migrationFiles.length}\n`);

  const client = new Client(connectionConfig);

  try {
    // Connect to database
    console.log(`${colors.blue}🔍 Connecting to database...${colors.reset}`);
    await client.connect();
    console.log(`${colors.green}✅ Connection successful${colors.reset}\n`);

    let successCount = 0;
    let failCount = 0;

    // Run each migration
    for (const file of migrationFiles) {
      const success = await runMigration(client, file);
      if (success) {
        successCount++;
      } else {
        failCount++;
        console.error(`\n${colors.red}⚠️  Migration failed. Stopping here.${colors.reset}`);
        break;
      }
    }

    // Summary
    console.log(`\n${colors.blue}============================================${colors.reset}`);
    console.log(`${colors.green}✅ Successful: ${successCount}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failCount}${colors.reset}`);
    console.log(`${colors.blue}============================================${colors.reset}\n`);

    if (failCount === 0) {
      console.log(`${colors.green}🎉 All migrations completed successfully!${colors.reset}\n`);
      console.log(`${colors.blue}Next steps:${colors.reset}`);
      console.log('  • Gamification tables have been created');
      console.log('  • Seed data has been loaded (levels, badges, missions, etc.)');
      console.log('  • Your app is ready to use the gamification system!');
      process.exit(0);
    } else {
      console.log(`${colors.red}⚠️  Some migrations failed. Please check the errors above.${colors.reset}`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`${colors.red}❌ Fatal error:${colors.reset}`, error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
