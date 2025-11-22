import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '关于' })

/**
 * 修复 MDX 代码，确保 _Fragment 等必要的变量已定义
 */
function fixMDXCode(code: string): string {
  if (!code) return code
  
  let fixedCode = code
  
  // 检查并添加 _Fragment 定义（如果代码中使用了但未定义）
  const needsFragment = fixedCode.includes('_Fragment') && !fixedCode.match(/const\s+_Fragment\s*=/)
  if (needsFragment) {
    // 在第一个函数定义之前添加 _Fragment 声明
    const firstFunctionIndex = fixedCode.search(/function\s+\w+/)
    const fragmentDecl = 'const _Fragment = _jsx_runtime.Fragment;\n'
    if (firstFunctionIndex > 0) {
      fixedCode = fixedCode.substring(0, firstFunctionIndex) + 
                 fragmentDecl + 
                 fixedCode.substring(firstFunctionIndex)
    } else {
      // 如果没有找到函数，在代码开头添加
      fixedCode = fragmentDecl + fixedCode
    }
  }
  
  return fixedCode
}

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  
  if (!author) {
    return <div>作者信息未找到</div>
  }
  
  if (!author.body?.code) {
    return <div>内容加载中...</div>
  }

  const mainContent = coreContent(author)
  const fixedCode = fixMDXCode(author.body.code)

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={fixedCode} />
    </AuthorLayout>
  )
}
