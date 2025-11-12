#!/bin/bash

# 修复 contentlayer 生成文件中的 import assertions 语法
# 将 assert { type: 'json' } 替换为 with { type: 'json' }

CONTENTLAYER_DIR=".contentlayer/generated"

if [ -d "$CONTENTLAYER_DIR" ]; then
  echo "Fixing import assertions in $CONTENTLAYER_DIR..."
  
  # 使用 find 和 sed 批量替换所有 .mjs 文件
  find "$CONTENTLAYER_DIR" -name "*.mjs" -type f -exec sed -i '' "s/assert { type: 'json' }/with { type: 'json' }/g" {} \;
  
  echo "Import assertions fixed!"
else
  echo "Directory $CONTENTLAYER_DIR not found, skipping fix."
fi

