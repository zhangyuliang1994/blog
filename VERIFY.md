# 本地验证指南

在提交代码前，可以使用以下方法验证 TypeScript 类型错误和构建问题：

## 1. TypeScript 类型检查（最快）

只检查类型，不生成文件：

```bash
# 检查所有文件
npx tsc --noEmit

# 只检查特定文件（更快）
npx tsc --noEmit app/blog/\[...slug\]/page.tsx

# 忽略 node_modules 中的错误（推荐）
npx tsc --noEmit --skipLibCheck
```

## 2. Next.js 构建检查（最全面）

这会执行完整的构建流程，包括类型检查：

```bash
# 标准构建（跳过 lint）
npm run build

# 或者使用 yarn
yarn build
```

## 3. 只检查类型（忽略依赖库错误）

如果依赖库有很多类型错误，可以使用这个命令只检查你的代码：

```bash
npx tsc --noEmit --skipLibCheck --pretty 2>&1 | grep -E "(error TS|app/|components/|layouts/)" | head -50
```

## 4. 检查特定目录

只检查你修改的文件：

```bash
# 检查 app 目录
npx tsc --noEmit app/**/*.tsx app/**/*.ts

# 检查特定文件
npx tsc --noEmit app/blog/\[...slug\]/page.tsx
```

## 5. 在 VS Code / Cursor 中实时检查

- 确保安装了 TypeScript 扩展
- 打开文件时，错误会实时显示在编辑器中
- 查看 "Problems" 面板（Cmd+Shift+M / Ctrl+Shift+M）

## 6. 使用 Next.js 开发模式

开发模式也会进行类型检查：

```bash
npm run dev
```

## 推荐工作流

在提交前，按顺序执行：

```bash
# 1. 快速类型检查（最快，30秒内）
npx tsc --noEmit --skipLibCheck

# 2. 如果通过，运行完整构建（更全面，2-5分钟）
npm run build
```

## 常见问题

### 如果看到很多 node_modules 的错误

这些是依赖库的类型错误，不影响你的代码。使用 `--skipLibCheck` 跳过：

```bash
npx tsc --noEmit --skipLibCheck
```

### 如果构建很慢

可以只检查你修改的文件：

```bash
npx tsc --noEmit app/blog/\[...slug\]/page.tsx
```

### 如果想知道具体错误位置

使用 `--pretty` 参数获得更友好的输出：

```bash
npx tsc --noEmit --skipLibCheck --pretty
```

