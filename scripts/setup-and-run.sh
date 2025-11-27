#!/bin/bash

echo "🚀 Cantonese Exercise Regeneration Setup"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  File .env không tồn tại!"
  echo ""
  echo "📝 Đang tạo file .env mẫu..."
  cat > .env << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Anthropic API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here
EOF
  echo "✅ Đã tạo file .env"
  echo ""
  echo "⚠️  VUI LÒNG CẬP NHẬT CÁC BIẾN MÔI TRƯỜNG TRONG FILE .env TRƯỚC KHI CHẠY!"
  echo ""
  echo "Bạn cần:"
  echo "  1. VITE_SUPABASE_URL - URL của Supabase project"
  echo "  2. SUPABASE_SERVICE_ROLE_KEY - Service role key từ Supabase Dashboard > Settings > API"
  echo "  3. ANTHROPIC_API_KEY - API key từ console.anthropic.com"
  echo ""
  echo "Sau khi cập nhật, chạy lại script này."
  exit 1
fi

echo "✅ File .env đã tồn tại"
echo ""

# Check if keys are set
source .env

if [[ "$VITE_SUPABASE_URL" == *"your"* ]] || [[ "$SUPABASE_SERVICE_ROLE_KEY" == *"your"* ]] || [[ "$ANTHROPIC_API_KEY" == *"your"* ]]; then
  echo "⚠️  API keys chưa được cập nhật trong file .env!"
  echo ""
  echo "Vui lòng mở file .env và cập nhật các giá trị sau:"
  echo "  - VITE_SUPABASE_URL"
  echo "  - SUPABASE_SERVICE_ROLE_KEY"
  echo "  - ANTHROPIC_API_KEY"
  echo ""
  exit 1
fi

echo "✅ API keys đã được thiết lập"
echo ""
echo "🔄 Đang chạy script regenerate..."
echo ""

# Run the script
npx tsx scripts/regenerate-cantonese-exercises.ts

echo ""
echo "✨ Hoàn thành!"
