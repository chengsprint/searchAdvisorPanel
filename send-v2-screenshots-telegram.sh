#!/bin/bash

# Script to send V2 screenshots via Telegram
# Usage: TELEGRAM_BOT_TOKEN="your_token" TELEGRAM_CHAT_ID="your_chat_id" ./send-v2-screenshots-telegram.sh

SCREENSHOTS_DIR="/home/seung/.cokacdir/workspace/yif7zotu/screenshots"
TELEGRAM_API_URL="https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto"

# Check if credentials are set
if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
    echo "❌ Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables must be set"
    echo "Usage: TELEGRAM_BOT_TOKEN='your_token' TELEGRAM_CHAT_ID='your_chat_id' $0"
    exit 1
fi

echo "📸 Sending V2 screenshots via Telegram..."
echo ""

# Array of screenshots with descriptions
declare -A SCREENSHOTS=(
    ["v2-single-all-overview.png"]="V2 단일 계정 - 전체 현황 탭 (Overview)"
    ["v2-single-all-daily.png"]="V2 단일 계정 - 일간 탭 (Daily)"
    ["v2-single-all-queries.png"]="V2 단일 계정 - 쿼리 탭 (Queries)"
    ["v2-single-all-urls.png"]="V2 단일 계정 - URL 탭 (URLs)"
    ["v2-single-all-indexed.png"]="V2 단일 계정 - 색인 탭 (Indexed)"
    ["v2-single-all-crawl.png"]="V2 단일 계정 - 크롤 탭 (Crawl)"
    ["v2-single-all-backlink.png"]="V2 단일 계정 - 백링크 탭 (Backlink)"
    ["v2-single-all-pattern.png"]="V2 단일 계정 - 패턴 탭 (Pattern)"
    ["v2-single-all-insight.png"]="V2 단일 계정 - 인사이트 탭 (Insight)"
    ["v2-single-site-mode.png"]="V2 단일 계정 - 사이트별 모드"
    ["v2-merged-overview.png"]="V2 복합 계정 - 전체 현황 (Merged Accounts)"
    ["v2-demo-overview.png"]="V2 데모 모드 - 전체 현황 (Demo Mode)"
)

# Counter for successful sends
SUCCESS_COUNT=0
FAIL_COUNT=0

# Send each screenshot
for file in "${!SCREENSHOTS[@]}"; do
    FILEPATH="${SCREENSHOTS_DIR}/${file}"
    CAPTION="${SCREENSHOTS[$file]}"

    if [ ! -f "$FILEPATH" ]; then
        echo "⚠️  File not found: $file"
        ((FAIL_COUNT++))
        continue
    fi

    echo "📤 Sending: $file"
    echo "   Caption: $CAPTION"

    RESPONSE=$(curl -s -X POST "$TELEGRAM_API_URL" \
        -F "chat_id=${TELEGRAM_CHAT_ID}" \
        -F "photo=@${FILEPATH}" \
        -F "caption=${CAPTION}" \
        -F "parse_mode=HTML")

    # Check if request was successful
    if echo "$RESPONSE" | grep -q '"ok":true'; then
        echo "   ✅ Sent successfully"
        ((SUCCESS_COUNT++))
    else
        echo "   ❌ Failed to send"
        echo "   Response: $RESPONSE"
        ((FAIL_COUNT++))
    fi
    echo ""

    # Small delay between sends to avoid rate limiting
    sleep 1
done

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary:"
echo "   ✅ Successfully sent: $SUCCESS_COUNT"
echo "   ❌ Failed: $FAIL_COUNT"
echo "   📁 Total screenshots: ${#SCREENSHOTS[@]}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $SUCCESS_COUNT -eq ${#SCREENSHOTS[@]} ]; then
    echo "🎉 All screenshots sent successfully!"
    exit 0
else
    echo "⚠️  Some screenshots failed to send"
    exit 1
fi
