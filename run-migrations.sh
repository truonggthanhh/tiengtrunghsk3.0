#!/bin/bash
###############################################################################
# Script để chạy Gamification Migrations cho Supabase
#
# Cách sử dụng:
# 1. Set environment variable với database password:
#    export SUPABASE_DB_PASSWORD="your_db_password"
#
# 2. Chạy script:
#    ./run-migrations.sh
#
# Hoặc inline:
#    SUPABASE_DB_PASSWORD="your_password" ./run-migrations.sh
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Supabase project details
PROJECT_REF="piwdypvvskuwbyvgyktn"
DB_HOST="db.${PROJECT_REF}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  Gamification Migrations Runner${NC}"
echo -e "${BLUE}============================================${NC}\n"

# Check if password is provided
if [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo -e "${RED}❌ Error: SUPABASE_DB_PASSWORD environment variable is required${NC}"
    echo -e "${YELLOW}Please set it with:${NC}"
    echo -e "   export SUPABASE_DB_PASSWORD=\"your_db_password\""
    echo -e "\nOr run inline:"
    echo -e "   SUPABASE_DB_PASSWORD=\"your_password\" ./run-migrations.sh"
    exit 1
fi

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  psql not found. Installing PostgreSQL client...${NC}\n"
    apt-get update -qq && apt-get install -y -qq postgresql-client > /dev/null 2>&1
    echo -e "${GREEN}✅ PostgreSQL client installed${NC}\n"
fi

# Connection string
export PGPASSWORD="$SUPABASE_DB_PASSWORD"
DB_URL="postgresql://${DB_USER}:${SUPABASE_DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Test connection
echo -e "${BLUE}🔍 Testing database connection...${NC}"
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connection successful${NC}\n"
else
    echo -e "${RED}❌ Failed to connect to database${NC}"
    echo -e "${YELLOW}Please check your SUPABASE_DB_PASSWORD${NC}"
    exit 1
fi

# Migration files in order
MIGRATIONS=(
    "20250114_gamification_system_clean.sql"
    "20250114_seed_badges.sql"
    "20250114_seed_missions.sql"
    "20250114_seed_wheel_rewards.sql"
    "20250114_seed_cards.sql"
    "20250114_seed_bosses_story.sql"
)

SUCCESS_COUNT=0
FAIL_COUNT=0

echo -e "${BLUE}📦 Running ${#MIGRATIONS[@]} migrations...${NC}\n"

# Run each migration
for migration in "${MIGRATIONS[@]}"; do
    MIGRATION_PATH="supabase/migrations/$migration"

    if [ ! -f "$MIGRATION_PATH" ]; then
        echo -e "${RED}❌ Migration file not found: $migration${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        continue
    fi

    echo -e "${YELLOW}🔄 Running: $migration${NC}"

    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$MIGRATION_PATH" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Success: $migration${NC}\n"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}❌ Failed: $migration${NC}"
        echo -e "${YELLOW}Running with verbose output:${NC}"
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$MIGRATION_PATH"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        echo -e "\n${RED}⚠️  Migration failed. Stopping here.${NC}\n"
        break
    fi
done

# Summary
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✅ Successful: $SUCCESS_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo -e "${BLUE}============================================${NC}\n"

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 All migrations completed successfully!${NC}\n"
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  • Gamification tables have been created"
    echo -e "  • Seed data has been loaded (levels, badges, missions, etc.)"
    echo -e "  • Your app is ready to use the gamification system!"
    exit 0
else
    echo -e "${RED}⚠️  Some migrations failed. Please check the errors above.${NC}\n"
    exit 1
fi
