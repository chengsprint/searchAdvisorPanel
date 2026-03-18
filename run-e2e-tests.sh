#!/bin/bash

# E2E Test Execution Script
# Run all E2E tests with various options

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/tmp/worktree-final"
cd "$PROJECT_DIR"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  SearchAdvisor E2E Test Runner${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Function to print section headers
print_header() {
    echo ""
    echo -e "${BLUE}>>> $1${NC}"
    echo ""
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Parse command line arguments
TEST_TYPE="all"
BROWSER="all"
REPORTER="list"
HEADED=false
DEBUG=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --smoke)
            TEST_TYPE="smoke"
            shift
            ;;
        --comprehensive)
            TEST_TYPE="comprehensive"
            shift
            ;;
        --chromium)
            BROWSER="chromium"
            shift
            ;;
        --firefox)
            BROWSER="firefox"
            shift
            ;;
        --webkit)
            BROWSER="webkit"
            shift
            ;;
        --html)
            REPORTER="html"
            shift
            ;;
        --headed)
            HEADED=true
            shift
            ;;
        --debug)
            DEBUG=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --smoke          Run smoke tests only"
            echo "  --comprehensive  Run comprehensive tests"
            echo "  --chromium       Run on Chromium only"
            echo "  --firefox        Run on Firefox only"
            echo "  --webkit         Run on WebKit only"
            echo "  --html           Generate HTML report"
            echo "  --headed         Run in headed mode"
            echo "  --debug          Run in debug mode"
            echo "  --help           Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 --smoke                    # Quick smoke test"
            echo "  $0 --chromium --html          # Chromium with HTML report"
            echo "  $0 --comprehensive --firefox  # Full suite on Firefox"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Build project
print_header "Building Project"
if npm run build > /dev/null 2>&1; then
    print_success "Build completed"
else
    print_error "Build failed"
    exit 1
fi

# Check if server is running
print_header "Checking Test Server"
if pgrep -f "serve dist" > /dev/null; then
    print_success "Test server already running"
else
    print_info "Starting test server..."
    npx serve dist -l 8080 > /dev/null 2>&1 &
    sleep 2
    print_success "Test server started"
fi

# Run tests based on type
print_header "Running Tests"

PLAYWRIGHT_CMD="npx playwright test"

if [ "$TEST_TYPE" = "smoke" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD simple-test.spec.js"
    print_info "Running smoke tests..."
elif [ "$TEST_TYPE" = "comprehensive" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD comprehensive.spec.js"
    print_info "Running comprehensive tests..."
fi

if [ "$BROWSER" != "all" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --project=$BROWSER"
    print_info "Browser: $BROWSER"
fi

if [ "$REPORTER" = "html" ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --reporter=html"
    print_info "Reporter: HTML"
fi

if [ "$HEADED" = true ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --headed"
    print_info "Mode: Headed"
fi

if [ "$DEBUG" = true ]; then
    PLAYWRIGHT_CMD="$PLAYWRIGHT_CMD --debug"
    print_info "Mode: Debug"
fi

echo ""
echo -e "${YELLOW}Executing: $PLAYWRIGHT_CMD${NC}"
echo ""

# Run tests
if eval $PLAYWRIGHT_CMD; then
    print_header "Test Results"
    print_success "All tests passed!"
    echo ""

    # Show report location
    if [ "$REPORTER" = "html" ]; then
        print_info "HTML Report: file://$PROJECT_DIR/playwright-report/index.html"
        print_info "View report: npx playwright show-report playwright-report"
    fi

    # Show artifacts
    if [ -d "test-results/artifacts" ]; then
        ARTIFACT_COUNT=$(find test-results/artifacts -type f 2>/dev/null | wc -l)
        print_info "Test artifacts: $ARTIFACT_COUNT files"
    fi

    echo ""
    print_success "E2E test execution completed successfully!"
    exit 0
else
    print_header "Test Results"
    print_error "Some tests failed!"
    echo ""

    # Show failure details
    print_info "Check test results in:"
    print_info "  - test-results/ directory"
    print_info "  - playwright-report/ directory"

    if [ -d "test-results/artifacts" ]; then
        print_info "  - Screenshots, videos, and traces available"
    fi

    echo ""
    print_info "To debug failures:"
    print_info "  1. Run with --debug flag"
    print_info "  2. Check screenshots in test-results/artifacts/"
    print_info "  3. View traces: npx playwright show-trace <trace-file>"

    exit 1
fi
