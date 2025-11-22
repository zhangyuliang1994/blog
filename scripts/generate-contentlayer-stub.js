const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const GithubSlugger = require('github-slugger')
const readingTime = require('reading-time')

// 递归获取目录下所有文件
function getAllFilesRecursively(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles
  }
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFilesRecursively(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

// 计算 slug（与 contentlayer 保持一致）
function computeSlug(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  const flattenedPath = relativePath.replace(/\\/g, '/').replace(/\.mdx?$/, '')
  return flattenedPath.replace(/^.+?(\/)/, '')
}

// 计算 path（与 contentlayer 保持一致）
function computePath(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath)
  return relativePath.replace(/\\/g, '/').replace(/\.mdx?$/, '')
}

// 生成假的 MDX body（用于静态导出，实际内容会在构建时处理）
function generateFakeBody(content) {
  // 返回一个简单的占位符，实际在静态导出时不需要编译 MDX
  return {
    raw: content,
    code: `export default function Content() { return null; }`,
    compiled: `export default function Content() { return null; }`,
  }
}

// 生成 structuredData（与 contentlayer 保持一致）
function generateStructuredData(doc, siteMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: doc.title,
    datePublished: doc.date,
    dateModified: doc.lastmod || doc.date,
    description: doc.summary || doc.description,
    image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
    url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
    author: doc.authors || [siteMetadata.author],
  }
}

// 处理博客文章
function processBlogs(dataDir, siteMetadata) {
  const blogDir = path.join(dataDir, 'blog')
  if (!fs.existsSync(blogDir)) {
    return []
  }

  const files = getAllFilesRecursively(blogDir)
  const allBlogs = []

  files.forEach((file) => {
    if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
      const source = fs.readFileSync(file, 'utf8')
      const { data, content } = matter(source)

      const flattenedPath = computePath(file, dataDir)
      const slug = computeSlug(file, dataDir)
      const readingTimeData = readingTime(content)

      const blog = {
        type: 'Blog',
        title: data.title || '',
        date: data.date || new Date().toISOString(),
        tags: data.tags || [],
        lastmod: data.lastmod || null,
        draft: data.draft || false,
        summary: data.summary || '',
        description: data.description || '',
        preview: data.preview || '',
        categories: data.categories || [],
        images: data.images || [],
        authors: data.authors || ['default'],
        layout: data.layout || 'PostLayout',
        bibliography: data.bibliography || '',
        canonicalUrl: data.canonicalUrl || '',
        password: data.password || '',
        slug: slug,
        path: flattenedPath,
        filePath: file,
        readingTime: readingTimeData,
        toc: '', // 在静态导出时不需要 TOC
        _raw: {
          sourceFilePath: file,
          sourceFileName: path.basename(file),
          sourceFileDir: path.dirname(file),
          contentType: 'mdx',
          flattenedPath: flattenedPath,
        },
        body: generateFakeBody(content),
        structuredData: generateStructuredData(
          {
            title: data.title,
            date: data.date,
            lastmod: data.lastmod,
            summary: data.summary,
            images: data.images,
            authors: data.authors,
            _raw: { flattenedPath },
          },
          siteMetadata
        ),
      }

      allBlogs.push(blog)
    }
  })

  return allBlogs
}

// 处理作者
function processAuthors(dataDir) {
  const authorsDir = path.join(dataDir, 'authors')
  if (!fs.existsSync(authorsDir)) {
    return []
  }

  const files = getAllFilesRecursively(authorsDir)
  const allAuthors = []

  files.forEach((file) => {
    if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
      const source = fs.readFileSync(file, 'utf8')
      const { data, content } = matter(source)

      const flattenedPath = computePath(file, dataDir)
      const slug = path.basename(file, path.extname(file))
      const readingTimeData = readingTime(content)

      const author = {
        type: 'Authors',
        name: data.name || '',
        avatar: data.avatar || '',
        occupation: data.occupation || '',
        company: data.company || '',
        email: data.email || '',
        twitter: data.twitter || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        layout: data.layout || '',
        slug: slug,
        path: flattenedPath,
        filePath: file,
        readingTime: readingTimeData,
        toc: '',
        _raw: {
          sourceFilePath: file,
          sourceFileName: path.basename(file),
          sourceFileDir: path.dirname(file),
          contentType: 'mdx',
          flattenedPath: flattenedPath,
        },
        body: generateFakeBody(content),
      }

      allAuthors.push(author)
    }
  })

  return allAuthors
}

// 处理文档
function processDocs(dataDir) {
  const docsDir = path.join(dataDir, 'docs')
  if (!fs.existsSync(docsDir)) {
    return []
  }

  const files = getAllFilesRecursively(docsDir)
  const allDocs = []

  files.forEach((file) => {
    if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
      const source = fs.readFileSync(file, 'utf8')
      const { data, content } = matter(source)

      const flattenedPath = computePath(file, dataDir)
      const slug = flattenedPath.replace('docs/', '')
      const url = `/${flattenedPath}`

      const doc = {
        type: 'Doc',
        title: data.title || '',
        description: data.description || '',
        order: data.order || 0,
        slug: slug,
        url: url,
        filePath: file,
        toc: [], // 在静态导出时不需要 TOC
        _raw: {
          sourceFilePath: file,
          sourceFileName: path.basename(file),
          sourceFileDir: path.dirname(file),
          contentType: 'mdx',
          flattenedPath: flattenedPath,
        },
        body: generateFakeBody(content),
      }

      allDocs.push(doc)
    }
  })

  return allDocs
}

// 生成假的 contentlayer/generated 模块
function generateContentlayerStub() {
  const root = process.cwd()
  const dataDir = path.join(root, 'data')
  const siteMetadata = require(path.join(root, 'data', 'siteMetadata.js'))

  // 处理所有内容
  const allBlogs = processBlogs(dataDir, siteMetadata)
  const allAuthors = processAuthors(dataDir)
  const allDocs = processDocs(dataDir)

  // 创建输出目录
  const outputDir = path.join(root, '.contentlayer-stub', 'generated')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 生成 TypeScript 类型定义
  const typeDefinitions = `
export type Blog = {
  type: 'Blog'
  title: string
  date: string
  tags: string[]
  lastmod?: string | null
  draft?: boolean
  summary?: string
  description?: string
  preview?: string
  categories?: string[]
  images?: string[]
  authors?: string[]
  layout?: string
  bibliography?: string
  canonicalUrl?: string
  password?: string
  slug: string
  path: string
  filePath: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  toc: string
  _raw: {
    sourceFilePath: string
    sourceFileName: string
    sourceFileDir: string
    contentType: string
    flattenedPath: string
  }
  body: {
    raw: string
    code: string
    compiled: string
  }
  structuredData: any
}

export type Authors = {
  type: 'Authors'
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  layout?: string
  slug: string
  path: string
  filePath: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  toc: string
  _raw: {
    sourceFilePath: string
    sourceFileName: string
    sourceFileDir: string
    contentType: string
    flattenedPath: string
  }
  body: {
    raw: string
    code: string
    compiled: string
  }
}

export type Doc = {
  type: 'Doc'
  title: string
  description: string
  order: number
  slug: string
  url: string
  filePath: string
  toc: any[]
  _raw: {
    sourceFilePath: string
    sourceFileName: string
    sourceFileDir: string
    contentType: string
    flattenedPath: string
  }
  body: {
    raw: string
    code: string
    compiled: string
  }
}
`

  // 生成数据导出
  const dataExports = `
${typeDefinitions}

export const allBlogs: Blog[] = ${JSON.stringify(allBlogs, null, 2)}

export const allAuthors: Authors[] = ${JSON.stringify(allAuthors, null, 2)}

export const allDocs: Doc[] = ${JSON.stringify(allDocs, null, 2)}
`

  // 写入文件
  const outputFile = path.join(outputDir, 'index.ts')
  fs.writeFileSync(outputFile, dataExports, 'utf8')

  console.log(`Contentlayer stub generated successfully!`)
  console.log(`  - Blogs: ${allBlogs.length}`)
  console.log(`  - Authors: ${allAuthors.length}`)
  console.log(`  - Docs: ${allDocs.length}`)
  console.log(`  - Output: ${outputFile}`)
}

generateContentlayerStub()

