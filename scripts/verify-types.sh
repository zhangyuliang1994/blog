#!/bin/bash

# 类型检查脚本
# 用法: ./scripts/verify-types.sh [文件路径]

echo "🔍 开始类型检查..."

if [ -z "$1" ]; then
  # 没有参数，检查所有文件
  echo "检查所有 TypeScript 文件..."
  npx tsc --noEmit --skipLibCheck --pretty
  EXIT_CODE=$?
else
  # 有参数，只检查指定文件
  echo "检查文件: $1"
  npx tsc --noEmit --skipLibCheck --pretty "$1"
  EXIT_CODE=$?
fi

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ 类型检查通过！"
  exit 0
else
  echo "❌ 发现类型错误，请修复后再提交"
  exit 1
fi

