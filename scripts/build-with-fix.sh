#!/bin/bash

echo "开始构建..."

# 第一次尝试构建（预期会失败）
next build --no-lint 2>&1 | tee /tmp/build-output.log &
BUILD_PID=$!

# 等待 contentlayer 生成文件
sleep 3

# 修复所有生成的 .mjs 文件
echo "修复 import assertions..."
find .contentlayer/generated -name "*.mjs" -type f 2>/dev/null | while read file; do
  if [ -f "$file" ]; then
    sed -i '' "s/assert { type: 'json' }/with { type: 'json' }/g" "$file" 2>/dev/null
  fi
done

# 等待第一次构建进程结束
wait $BUILD_PID
FIRST_BUILD_EXIT=$?

if [ $FIRST_BUILD_EXIT -eq 0 ]; then
  echo "构建成功!"
  exit 0
fi

# 如果第一次失败，再次修复并重试
echo "第一次构建失败，修复后重试..."
find .contentlayer/generated -name "*.mjs" -type f 2>/dev/null | while read file; do
  if [ -f "$file" ]; then
    sed -i '' "s/assert { type: 'json' }/with { type: 'json' }/g" "$file" 2>/dev/null
  fi
done

# 第二次构建
echo "重新构建..."
next build --no-lint

