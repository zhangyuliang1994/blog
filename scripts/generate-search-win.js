const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const GithubSlugger = require('github-slugger')

// 递归获取目录下所有文件
function getAllFilesRecursively(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles
  }
  
  try {
    const files = fs.readdirSync(dirPath)

    files.forEach((file) => {
      try {
        const filePath = path.join(dirPath, file)
        if (fs.statSync(filePath).isDirectory()) {
          arrayOfFiles = getAllFilesRecursively(filePath, arrayOfFiles)
        } else {
          arrayOfFiles.push(filePath)
        }
      } catch (error) {
        console.error(`Error processing file/directory ${file}:`, error.message)
        // 继续处理其他文件，不中断整个流程
      }
    })
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message)
  }

  return arrayOfFiles
}

// 手动处理博客文章并生成搜索索引
function generateSearchIndex() {
  try {
    const root = process.cwd()
    const blogDir = path.join(root, 'data', 'blog')
    
    // 验证博客目录存在
    if (!fs.existsSync(blogDir)) {
      console.warn(`Blog directory not found: ${blogDir}, creating empty search index`)
      // 创建空的搜索索引，不抛出错误
      const emptySearchPath = path.join(root, 'public', 'search.json')
      const emptyTagPath = path.join(root, 'app', 'tag-data.json')
      
      // 确保 public 目录存在
      const publicDir = path.join(root, 'public')
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }
      
      fs.writeFileSync(emptySearchPath, JSON.stringify([]))
      fs.writeFileSync(emptyTagPath, JSON.stringify({}))
      console.log('Empty search index and tag data generated')
      return
    }
    
    // 获取所有MDX文件
    const files = getAllFilesRecursively(blogDir)
    const allBlogs = []

    files.forEach((file) => {
      if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
        try {
          const source = fs.readFileSync(file, 'utf8')
          const { data, content } = matter(source)
          
          // 只处理非草稿文章
          if (data.draft !== true) {
            const slug = path.basename(file, path.extname(file))
            const blog = {
              title: data.title || '',
              date: data.date || '',
              tags: data.tags || [],
              summary: data.summary || '',
              slug: slug,
              path: `blog/${slug}`,
              filePath: file,
              body: content
            }
            allBlogs.push(blog)
          }
        } catch (error) {
          console.error(`Error processing blog file ${file}:`, error.message)
          // 继续处理其他文件，不中断整个流程
        }
      }
    })

    // 按日期排序
    allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date))

    // 生成搜索数据
    const searchData = allBlogs.map(blog => ({
      title: blog.title,
      summary: blog.summary,
      slug: blog.slug,
      date: blog.date,
      tags: blog.tags,
      path: blog.path
    }))

    // 确保 public 目录存在
    const publicDir = path.join(root, 'public')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // 确保 app 目录存在
    const appDir = path.join(root, 'app')
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true })
    }

    // 写入搜索索引文件
    const searchPath = path.join(root, 'public', 'search.json')
    try {
      fs.writeFileSync(searchPath, JSON.stringify(searchData, null, 2))
      
      // 验证文件是否成功写入
      if (!fs.existsSync(searchPath)) {
        throw new Error(`Search index file was not created: ${searchPath}`)
      }
      const searchStats = fs.statSync(searchPath)
      if (searchStats.size === 0) {
        throw new Error(`Search index file is empty: ${searchPath}`)
      }
      console.log(`Search index generated successfully! (${searchStats.size} bytes)`)
    } catch (error) {
      throw new Error(`Failed to write search index file ${searchPath}: ${error.message}`)
    }

    // 生成标签统计（使用与 contentlayer 相同的 slug 方法）
    const tagCount = {}
    allBlogs.forEach((blog) => {
      if (blog.tags) {
        blog.tags.forEach((tag) => {
          const formattedTag = GithubSlugger.slug(tag)
          if (formattedTag in tagCount) {
            tagCount[formattedTag] += 1
          } else {
            tagCount[formattedTag] = 1
          }
        })
      }
    })

    const tagPath = path.join(root, 'app', 'tag-data.json')
    try {
      fs.writeFileSync(tagPath, JSON.stringify(tagCount, null, 2))
      
      // 验证文件是否成功写入
      if (!fs.existsSync(tagPath)) {
        throw new Error(`Tag data file was not created: ${tagPath}`)
      }
      const tagStats = fs.statSync(tagPath)
      if (tagStats.size === 0) {
        throw new Error(`Tag data file is empty: ${tagPath}`)
      }
      console.log(`Tag data generated successfully! (${tagStats.size} bytes)`)
    } catch (error) {
      throw new Error(`Failed to write tag data file ${tagPath}: ${error.message}`)
    }
    
    console.log(`  - Processed ${allBlogs.length} blog posts`)
  } catch (error) {
    console.error('Error generating search index:', error.message)
    console.error(error.stack)
    throw error
  }
}

// 主执行逻辑，带错误处理
try {
  generateSearchIndex()
  process.exit(0)
} catch (error) {
  console.error('Fatal error in generate-search-win.js:', error.message)
  process.exit(1)
} 