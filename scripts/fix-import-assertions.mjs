import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

async function fixImportAssertions(dir) {
  try {
    const files = await readdir(dir, { withFileTypes: true })
    
    for (const file of files) {
      const fullPath = join(dir, file.name)
      
      if (file.isDirectory()) {
        await fixImportAssertions(fullPath)
      } else if (file.name.endsWith('.mjs')) {
        try {
          let content = await readFile(fullPath, 'utf-8')
          const originalContent = content
          
          // 替换 assert { type: 'json' } 为 with { type: 'json' }
          content = content.replace(/assert\s*{\s*type:\s*['"]json['"]\s*}/g, "with { type: 'json' }")
          
          if (content !== originalContent) {
            await writeFile(fullPath, content, 'utf-8')
            console.log(`Fixed: ${fullPath}`)
          }
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error.message)
        }
      }
    }
  } catch (error) {
    // 目录不存在时忽略错误
    if (error.code !== 'ENOENT') {
      console.error(`Error reading directory ${dir}:`, error.message)
    }
  }
}

async function main() {
  const contentlayerDir = join(process.cwd(), '.contentlayer', 'generated')
  await fixImportAssertions(contentlayerDir)
  console.log('Import assertions fixed!')
}

main().catch(console.error)

