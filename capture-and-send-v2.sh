#!/bin/bash

# Quick script to capture V2 screenshots and optionally send to Telegram
# Usage: ./capture-and-send-v2.sh [send]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🎬 V2 Screenshot Capture Script"
echo "================================"
echo ""

# Step 1: Capture screenshots
echo "📸 Step 1: Capturing screenshots..."
node capture-v2-screenshots-v2.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Screenshots captured successfully!"
    echo ""

    # Step 2: Send to Telegram (optional)
    if [ "$1" = "send" ]; then
        echo "📤 Step 2: Sending to Telegram..."
        if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
            ./send-v2-screenshots-telegram.sh
        else
            echo "⚠️  TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set"
            echo "   Run with: TELEGRAM_BOT_TOKEN='xxx' TELEGRAM_CHAT_ID='yyy' ./capture-and-send-v2.sh send"
            exit 1
        fi
    else
        echo "📋 To send screenshots to Telegram, run:"
        echo "   TELEGRAM_BOT_TOKEN='your_token' TELEGRAM_CHAT_ID='your_chat_id' $0 send"
    fi

    echo ""
    echo "📁 Screenshots location: $SCRIPT_DIR/screenshots/"
    echo "📊 Total screenshots: $(ls -1 "$SCRIPT_DIR/screenshots/v2-"*.png 2>/dev/null | wc -l)"
else
    echo ""
    echo "❌ Screenshot capture failed!"
    exit 1
fi
