#!/bin/sh

# Logo 获取脚本
# 用法: ./logo.sh <homepage_url>
# 功能: 从项目官网获取 Logo URL

set -e

if [ -z "$1" ]; then
    echo "错误: 请提供 homepage URL" >&2
    echo "用法: $0 <homepage_url>" >&2
    exit 1
fi

HOMEPAGE_URL="$1"
BASE_URL=$(echo "$HOMEPAGE_URL" | sed -E 's|(https?://[^/]+).*|\1|')

# 临时文件存储 HTML 内容
TMP_HTML=$(mktemp)
trap "rm -f $TMP_HTML" EXIT

# 1. 访问 homepage URL，获取 HTML 内容
echo "正在访问: $HOMEPAGE_URL" >&2
if ! curl -sL -f "$HOMEPAGE_URL" > "$TMP_HTML" 2>/dev/null; then
    echo "错误: 无法访问 $HOMEPAGE_URL" >&2
    exit 1
fi

# 2. 解析 HTML，从 DOM 中查找以下元素（按优先级）

# 2.1 查找 <link rel="apple-touch-icon"> 获取高清图标（通常是 180x180 或更大，优先使用）
APPLE_TOUCH_ICON=$(grep -i 'rel="apple-touch-icon"' "$TMP_HTML" | head -1 | sed -E 's/.*href=["'\'']([^"'\'']+)["'\''].*/\1/i')
if [ -n "$APPLE_TOUCH_ICON" ]; then
    # 处理相对路径
    if [[ ! "$APPLE_TOUCH_ICON" =~ ^https?:// ]]; then
        APPLE_TOUCH_ICON="${BASE_URL}${APPLE_TOUCH_ICON}"
    fi
    echo "$APPLE_TOUCH_ICON"
    exit 0
fi

# 2.2 查找 <link rel="icon"> 或 <link rel="shortcut icon"> 元素获取 favicon
FAVICON=$(grep -iE 'rel=["'\''](icon|shortcut icon)["'\'']' "$TMP_HTML" | head -1 | sed -E 's/.*href=["'\'']([^"'\'']+)["'\''].*/\1/i')
if [ -n "$FAVICON" ]; then
    # 处理相对路径
    if [[ ! "$FAVICON" =~ ^https?:// ]]; then
        FAVICON="${BASE_URL}${FAVICON}"
    fi
    echo "$FAVICON"
    exit 0
fi

# 2.3 查找页面 header/nav 区域的 <img> 或 <svg> logo 元素（通常是高清的）
# 尝试查找 header 或 nav 标签内的 logo
HEADER_LOGO=$(grep -iE '<(header|nav)[^>]*>.*<(img|svg)' "$TMP_HTML" | grep -iE '(logo|brand)' | head -1 | sed -E 's/.*(src|href)=["'\'']([^"'\'']+)["'\''].*/\2/i')
if [ -n "$HEADER_LOGO" ] && [[ "$HEADER_LOGO" =~ ^https?:// ]]; then
    echo "$HEADER_LOGO"
    exit 0
fi

# 如果上述方法未找到，尝试直接访问常见路径
COMMON_PATHS=(
    "/favicon.ico"
    "/logo.svg"
    "/logo.png"
    "/assets/logo.svg"
    "/assets/logo.png"
    "/images/logo.svg"
    "/images/logo.png"
)

for path in "${COMMON_PATHS[@]}"; do
    TEST_URL="${BASE_URL}${path}"
    if curl -sL -f -o /dev/null -w "%{http_code}" "$TEST_URL" 2>/dev/null | grep -q "^200$"; then
        echo "$TEST_URL"
        exit 0
    fi
done

# 如果所有方法都失败
echo "错误: 未找到 Logo" >&2
exit 1
