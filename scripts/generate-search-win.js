const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { getAllFilesRecursively } = require('pliny/utils/files')

// 手动处理博客文章并生成搜索索引
function generateSearchIndex() {
  const root = process.cwd()
  const blogDir = path.join(root, 'data', 'blog')
  
  // 获取所有MDX文件
  const files = getAllFilesRecursively(blogDir)
  const allBlogs = []

  files.forEach((file) => {
    if (path.extname(file) === '.mdx' || path.extname(file) === '.md') {
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

  // 写入搜索索引文件
  const searchPath = path.join(root, 'public', 'search.json')
  fs.writeFileSync(searchPath, JSON.stringify(searchData))
  console.log('Search index generated successfully!')

  // 生成标签统计
  const tagCount = {}
  allBlogs.forEach((blog) => {
    if (blog.tags) {
      blog.tags.forEach((tag) => {
        const formattedTag = tag.toLowerCase().replace(/\s+/g, '')
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })

  const tagPath = path.join(root, 'app', 'tag-data.json')
  fs.writeFileSync(tagPath, JSON.stringify(tagCount))
  console.log('Tag data generated successfully!')
}

generateSearchIndex() 