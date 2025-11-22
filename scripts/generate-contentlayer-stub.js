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
  // 注意：code 必须返回一个包含 default 的对象，而不是使用 export default
  // 因为 getMDXComponent 使用 new Function() 执行代码并期望返回 fn().default
  return {
    raw: content,
    code: `return { default: function Content() { return null; } }`,
    compiled: `return { default: function Content() { return null; } }`,
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
      try {
        const source = fs.readFileSync(file, 'utf8')
        const { data, content } = matter(source)

        const flattenedPath = computePath(file, dataDir)
        const slug = computeSlug(file, dataDir)
        const readingTimeData = readingTime(content)

        const blog = {
        type: 'Blog',
        _id: flattenedPath,
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
      } catch (error) {
        console.error(`Error processing blog file ${file}:`, error.message)
        // 继续处理其他文件，不中断整个流程
      }
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
      try {
        const source = fs.readFileSync(file, 'utf8')
        const { data, content } = matter(source)

        const flattenedPath = computePath(file, dataDir)
        const slug = path.basename(file, path.extname(file))
        const readingTimeData = readingTime(content)

        const author = {
        type: 'Authors',
        _id: flattenedPath,
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
      } catch (error) {
        console.error(`Error processing author file ${file}:`, error.message)
        // 继续处理其他文件，不中断整个流程
      }
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
      try {
        const source = fs.readFileSync(file, 'utf8')
        const { data, content } = matter(source)

        const flattenedPath = computePath(file, dataDir)
        const slug = flattenedPath.replace('docs/', '')
        const url = `/${flattenedPath}`

        const doc = {
        type: 'Doc',
        _id: flattenedPath,
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
      } catch (error) {
        console.error(`Error processing doc file ${file}:`, error.message)
        // 继续处理其他文件，不中断整个流程
      }
    }
  })

  return allDocs
}

// 生成假的 contentlayer/generated 模块
function generateContentlayerStub() {
  try {
    const root = process.cwd()
    const dataDir = path.join(root, 'data')
    
    // 验证数据目录存在
    if (!fs.existsSync(dataDir)) {
      throw new Error(`Data directory not found: ${dataDir}`)
    }
    
    // 验证 siteMetadata 文件存在
    const siteMetadataPath = path.join(root, 'data', 'siteMetadata.js')
    if (!fs.existsSync(siteMetadataPath)) {
      throw new Error(`Site metadata file not found: ${siteMetadataPath}`)
    }
    
    const siteMetadata = require(siteMetadataPath)

    // 处理所有内容
    const allBlogs = processBlogs(dataDir, siteMetadata)
    const allAuthors = processAuthors(dataDir)
    const allDocs = processDocs(dataDir)

    // 创建输出目录
    const outputDir = path.join(root, '.contentlayer-stub', 'generated')
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
    } catch (error) {
      throw new Error(`Failed to create output directory ${outputDir}: ${error.message}`)
    }

  // 生成 TypeScript 类型定义
  const typeDefinitions = `
export type Blog = {
  type: 'Blog'
  _id: string
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
  _id: string
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
  _id: string
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
    try {
      fs.writeFileSync(outputFile, dataExports, 'utf8')
    } catch (error) {
      throw new Error(`Failed to write output file ${outputFile}: ${error.message}`)
    }

    // 验证文件是否成功写入
    if (!fs.existsSync(outputFile)) {
      throw new Error(`Output file was not created: ${outputFile}`)
    }
    
    const stats = fs.statSync(outputFile)
    if (stats.size === 0) {
      throw new Error(`Output file is empty: ${outputFile}`)
    }

    // 验证生成的数据结构
    const validationErrors = []
    
    // 验证所有博客都有必需的字段
    allBlogs.forEach((blog, index) => {
      if (!blog._id) validationErrors.push(`Blog[${index}] missing _id`)
      if (!blog._raw) validationErrors.push(`Blog[${index}] missing _raw`)
      if (!blog.body) validationErrors.push(`Blog[${index}] missing body`)
      if (!blog.type || blog.type !== 'Blog') validationErrors.push(`Blog[${index}] missing or invalid type`)
    })
    
    // 验证所有作者都有必需的字段
    allAuthors.forEach((author, index) => {
      if (!author._id) validationErrors.push(`Author[${index}] missing _id`)
      if (!author._raw) validationErrors.push(`Author[${index}] missing _raw`)
      if (!author.body) validationErrors.push(`Author[${index}] missing body`)
      if (!author.type || author.type !== 'Authors') validationErrors.push(`Author[${index}] missing or invalid type`)
    })
    
    // 验证所有文档都有必需的字段
    allDocs.forEach((doc, index) => {
      if (!doc._id) validationErrors.push(`Doc[${index}] missing _id`)
      if (!doc._raw) validationErrors.push(`Doc[${index}] missing _raw`)
      if (!doc.body) validationErrors.push(`Doc[${index}] missing body`)
      if (!doc.type || doc.type !== 'Doc') validationErrors.push(`Doc[${index}] missing or invalid type`)
    })
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed:\n${validationErrors.join('\n')}`)
    }

    // 验证文件内容包含必需的类型定义
    const fileContent = fs.readFileSync(outputFile, 'utf8')
    const requiredTypes = ['export type Blog', 'export type Authors', 'export type Doc']
    const missingTypes = requiredTypes.filter(type => !fileContent.includes(type))
    
    if (missingTypes.length > 0) {
      throw new Error(`Missing type definitions in output file: ${missingTypes.join(', ')}`)
    }
    
    // 验证类型定义包含 _id 字段
    if (!fileContent.includes('_id: string')) {
      throw new Error('Type definitions missing _id field')
    }

    console.log(`Contentlayer stub generated successfully!`)
    console.log(`  - Blogs: ${allBlogs.length}`)
    console.log(`  - Authors: ${allAuthors.length}`)
    console.log(`  - Docs: ${allDocs.length}`)
    console.log(`  - Output: ${outputFile}`)
    console.log(`  - File size: ${stats.size} bytes`)
    console.log(`  - Validation: ✓ All types and fields verified`)
    
    return true
  } catch (error) {
    console.error('Error generating contentlayer stub:', error.message)
    console.error(error.stack)
    throw error
  }
}

// 主执行逻辑，带错误处理
try {
  generateContentlayerStub()
  process.exit(0)
} catch (error) {
  console.error('Fatal error in generate-contentlayer-stub.js:', error.message)
  process.exit(1)
}

