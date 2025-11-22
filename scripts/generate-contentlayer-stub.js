const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const GithubSlugger = require('github-slugger')
const readingTime = require('reading-time')
const { compile } = require('@mdx-js/mdx')
// Remark packages
const remarkGfm = require('remark-gfm')
const remarkMath = require('remark-math')
const {
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} = require('pliny/mdx-plugins/index.js')
// Rehype packages
const rehypeSlug = require('rehype-slug')
const rehypeAutolinkHeadings = require('rehype-autolink-headings')
const rehypeKatex = require('rehype-katex')
const rehypePrismPlusModule = require('rehype-prism-plus')
const rehypePrismPlus = rehypePrismPlusModule.default || rehypePrismPlusModule
const rehypePresetMinify = require('rehype-preset-minify')

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

// 编译 MDX 内容为 JavaScript 代码
async function compileMDX(mdxContent, filePath = '') {
  try {
    // 使用与 contentlayer.config.ts 相同的插件配置
    // 注意：不包含 remarkExtractFrontmatter，因为我们已经用 gray-matter 处理了 frontmatter
    const compiled = await compile(mdxContent, {
      remarkPlugins: [
        remarkGfm,
        remarkCodeTitles,
        remarkMath,
        remarkImgToJsx,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
        rehypePresetMinify,
      ],
    })
    
    // 将编译后的代码转换为字符串（compile 返回的是 Uint8Array/Buffer）
    const codeString = Buffer.isBuffer(compiled) 
      ? compiled.toString('utf-8')
      : compiled instanceof Uint8Array
      ? Buffer.from(compiled).toString('utf-8')
      : String(compiled)
    
    // 包装代码，使其返回一个包含 default 的对象
    // 注意：MDXLayoutRenderer 使用 new Function() 执行代码并期望返回 fn().default
    // 编译后的 MDX 代码通常使用 export default，我们需要将其转换为 return { default: ... }
    let wrappedCode = codeString
    
    // 首先检查代码是否已经包含正确的 return { default: ... } 格式
    if (/return\s*\{[^}]*default[^}]*\}/.test(codeString)) {
      // 代码已经是正确格式，直接返回
      return codeString
    }
    
    // 如果代码包含 export default，将其转换为 return { default: ... }
    if (codeString.includes('export default')) {
      // 提取 default 导出的内容
      // 匹配 export default function MDXContent(props) { ... }
      const defaultMatch = codeString.match(/export\s+default\s+function\s+(\w+)\s*\([^)]*\)\s*{([\s\S]*)}/m)
      if (defaultMatch) {
        const functionName = defaultMatch[1]
        const functionBody = defaultMatch[2]
        wrappedCode = `return { default: function ${functionName}(props) {${functionBody}} }`
      } else {
        // 尝试匹配其他格式的 export default
        // 匹配 export default MDXContent 或 export default (props) => ...
        const altMatch = codeString.match(/export\s+default\s+([\s\S]+?)(?:\n|$)/)
        if (altMatch) {
          const exportValue = altMatch[1].trim()
          // 如果是一个函数表达式或箭头函数，直接使用
          if (exportValue.includes('=>') || exportValue.includes('function')) {
            wrappedCode = `return { default: ${exportValue} }`
          } else {
            // 如果是一个变量名，需要包装成函数
            wrappedCode = `return { default: ${exportValue} }`
          }
        } else {
          // 如果无法匹配，使用原始代码但包装在 return 中
          wrappedCode = `return { default: (${codeString}) }`
        }
      }
    } else if (/return\s+[^;]+;?\s*$/.test(codeString)) {
      // 如果代码已经包含 return 语句（但不是 return { default: ... }），需要转换
      // 匹配 return Component; 或类似的格式
      const returnMatch = codeString.match(/return\s+([^;]+)\s*;?\s*$/)
      if (returnMatch) {
        const returnValue = returnMatch[1].trim()
        // 替换最后的 return 语句
        wrappedCode = codeString.replace(/return\s+[^;]+;?\s*$/, `return { default: ${returnValue} };`)
      } else {
        // 如果没有匹配到，直接包装整个代码
        wrappedCode = `return { default: (${codeString}) }`
      }
    } else {
      // 如果没有 export default 也没有 return，直接包装整个代码
      wrappedCode = `return { default: (${codeString}) }`
    }
    
    return wrappedCode
  } catch (error) {
    // 改进错误处理：记录详细的错误信息
    const errorInfo = filePath 
      ? `Error compiling MDX in file: ${filePath}\n  Error: ${error.message}`
      : `Error compiling MDX: ${error.message}`
    console.error(errorInfo)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    // 如果编译失败，抛出错误而不是返回空组件，这样可以在处理时知道哪些文件失败了
    throw new Error(errorInfo)
  }
}

// 生成 MDX body（编译 MDX 内容）
async function generateFakeBody(content, filePath = '') {
  const compiledCode = await compileMDX(content, filePath)
  return {
    raw: content,
    code: compiledCode,
    compiled: compiledCode,
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
async function processBlogs(dataDir, siteMetadata) {
  const blogDir = path.join(dataDir, 'blog')
  if (!fs.existsSync(blogDir)) {
    return []
  }

  const files = getAllFilesRecursively(blogDir)
  const allBlogs = []

  // 使用 Promise.all 并行处理所有文件
  const blogPromises = files
    .filter((file) => path.extname(file) === '.mdx' || path.extname(file) === '.md')
    .map(async (file) => {
      try {
        const source = fs.readFileSync(file, 'utf8')
        const { data, content } = matter(source)

        const flattenedPath = computePath(file, dataDir)
        const slug = computeSlug(file, dataDir)
        const readingTimeData = readingTime(content)

        // 异步编译 MDX 内容
        const body = await generateFakeBody(content, file)

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
          body: body,
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

        return blog
      } catch (error) {
        console.error(`Error processing blog file ${file}:`, error.message)
        // 返回 null，后续会被过滤掉
        return null
      }
    })

  const results = await Promise.all(blogPromises)
  // 过滤掉 null 值
  allBlogs.push(...results.filter((blog) => blog !== null))

  return allBlogs
}

// 处理作者
async function processAuthors(dataDir) {
  const authorsDir = path.join(dataDir, 'authors')
  if (!fs.existsSync(authorsDir)) {
    return []
  }

  const files = getAllFilesRecursively(authorsDir)
  const allAuthors = []

  // 使用 Promise.all 并行处理所有文件
  const authorPromises = files
    .filter((file) => path.extname(file) === '.mdx' || path.extname(file) === '.md')
    .map(async (file) => {
      try {
        const source = fs.readFileSync(file, 'utf8')
        const { data, content } = matter(source)

        const flattenedPath = computePath(file, dataDir)
        const slug = path.basename(file, path.extname(file))
        const readingTimeData = readingTime(content)

        // 异步编译 MDX 内容
        const body = await generateFakeBody(content, file)

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
          body: body,
        }

        return author
      } catch (error) {
        console.error(`Error processing author file ${file}:`, error.message)
        // 返回 null，后续会被过滤掉
        return null
      }
    })

  const results = await Promise.all(authorPromises)
  // 过滤掉 null 值
  allAuthors.push(...results.filter((author) => author !== null))

  return allAuthors
}

// 处理文档
async function processDocs(dataDir) {
  const docsDir = path.join(dataDir, 'docs')
  if (!fs.existsSync(docsDir)) {
    return []
  }

  const files = getAllFilesRecursively(docsDir)
  const allDocs = []

  // 使用 Promise.all 并行处理所有文件
  const docPromises = files
    .filter((file) => path.extname(file) === '.mdx' || path.extname(file) === '.md')
    .map(async (file) => {
      try {
        const source = fs.readFileSync(file, 'utf8')
        const { data, content } = matter(source)

        const flattenedPath = computePath(file, dataDir)
        const slug = flattenedPath.replace('docs/', '')
        const url = `/${flattenedPath}`

        // 异步编译 MDX 内容
        const body = await generateFakeBody(content, file)

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
          body: body,
        }

        return doc
      } catch (error) {
        console.error(`Error processing doc file ${file}:`, error.message)
        // 返回 null，后续会被过滤掉
        return null
      }
    })

  const results = await Promise.all(docPromises)
  // 过滤掉 null 值
  allDocs.push(...results.filter((doc) => doc !== null))

  return allDocs
}

// 生成假的 contentlayer/generated 模块
async function generateContentlayerStub() {
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

    // 处理所有内容（现在是异步的）
    const [allBlogs, allAuthors, allDocs] = await Promise.all([
      processBlogs(dataDir, siteMetadata),
      processAuthors(dataDir),
      processDocs(dataDir),
    ])

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

    // 验证至少有一个博客的 body.code 不是空组件
    const blogsWithContent = allBlogs.filter(blog => {
      const code = blog.body?.code || ''
      return code && !code.includes('function Content() { return null; }')
    })
    
    if (blogsWithContent.length === 0) {
      throw new Error('Validation failed: All blogs have empty body.code. MDX compilation may have failed for all files.')
    }
    
    console.log(`Contentlayer stub generated successfully!`)
    console.log(`  - Blogs: ${allBlogs.length}`)
    console.log(`  - Authors: ${allAuthors.length}`)
    console.log(`  - Docs: ${allDocs.length}`)
    console.log(`  - Blogs with compiled content: ${blogsWithContent.length}/${allBlogs.length}`)
    console.log(`  - Output: ${outputFile}`)
    console.log(`  - File size: ${stats.size} bytes`)
    console.log(`  - Validation: ✓ All types and fields verified`)
    console.log(`  - Content validation: ✓ ${blogsWithContent.length} blogs have compiled MDX content`)
    
    return true
  } catch (error) {
    console.error('Error generating contentlayer stub:', error.message)
    console.error(error.stack)
    throw error
  }
}

// 主执行逻辑，带错误处理
;(async () => {
  try {
    await generateContentlayerStub()
    process.exit(0)
  } catch (error) {
    console.error('Fatal error in generate-contentlayer-stub.js:', error.message)
    process.exit(1)
  }
})()

