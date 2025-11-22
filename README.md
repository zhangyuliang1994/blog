# Blog

这是一个使用 Next.js 构建的个人博客项目。

## 环境要求

- Node.js 16.x 或更高版本
- Yarn 3.x

## 安装依赖

```bash
# 安装依赖
yarn install
```

## 开发环境

```bash
# 启动开发服务器
yarn dev
```

启动后，访问 http://localhost:3000 即可看到网站。

## 生产环境

### 构建

```bash
# 构建生产版本
yarn build
```

构建完成后，生成的文件将位于 `.next` 目录中。

### 启动生产服务器

```bash
# 启动生产服务器
yarn start
```

启动后，访问 http://localhost:3000 查看生产版本的网站。

### 导出静态文件

如果需要将网站导出为静态文件（用于静态托管），可以使用以下命令：

```bash
# 导出静态文件
yarn export
```

导出的静态文件将位于 `out` 目录中。你可以将这些文件部署到任何静态文件托管服务上。

## GitHub Pages 自动部署

项目已配置 GitHub Actions 工作流，可以自动部署到 GitHub Pages。

### 首次设置

1. **启用 GitHub Pages**：
   - 前往 GitHub 仓库的 Settings > Pages
   - 在 Source 部分，选择 `gh-pages` 分支
   - 点击 Save

2. **配置自定义域名（可选）**：
   - 如果使用自定义域名，编辑 `.github/workflows/deploy.yml`
   - 取消注释并设置 `cname` 选项：
     ```yaml
     cname: your-domain.com
     ```

3. **配置环境变量（可选）**：
   - 如果使用 Umami 分析，前往 Settings > Secrets and variables > Actions
   - 添加 `NEXT_UMAMI_ID` secret

### 自动部署

- 推送到 `main` 或 `master` 分支时，GitHub Actions 会自动：
  1. 安装依赖
  2. 构建静态站点（使用 `yarn export`）
  3. 部署到 `gh-pages` 分支

- 部署完成后，网站会在几分钟内更新
- 查看部署状态：前往仓库的 Actions 标签页

## 其他命令

```bash
# 代码格式检查
yarn lint

# 代码格式修复
yarn lint --fix

# 分析构建包大小
yarn analyze
```

## 项目结构

- `app/` - 页面和路由
- `components/` - React 组件
- `public/` - 静态资源
- `data/` - 博客文章和配置数据
- `layouts/` - 页面布局组件
- `css/` - 样式文件
- `scripts/` - 构建脚本

## 技术栈

- Next.js 13
- React 18
- TailwindCSS
- ContentLayer
- TypeScript

## Personal Blog


I recently ported this to sveltekit. here is the react and nextjs version : [https://v1-prabhukirankonda.vercel.app](https://v1-prabhukirankonda.vercel.app/)


for sveltekit version : [https://prabhukirankonda.vercel.app](https://prabhukirankonda.vercel.app/) -- [Repo](https://github.com/PrabhuKiran8790/prabhukirankonda.vercel.app/tree/main)
