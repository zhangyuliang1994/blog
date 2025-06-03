import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '关于' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  
  if (!author) {
    return <div>作者信息未找到</div>
  }
  
  if (!author.body?.code) {
    return <div>内容加载中...</div>
  }

  const mainContent = coreContent(author)

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}
