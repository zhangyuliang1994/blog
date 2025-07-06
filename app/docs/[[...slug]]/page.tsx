import { DocsLayout } from '@/layouts/DocsLayout'
import { allDocs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { sortDocs } from '@/lib/utils/contentlayer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import Link from 'next/link'
import DocsClientWrapper from '@/components/docs/DocsClientWrapper'

export const generateStaticParams = async () => {
  const params = allDocs.map((doc) => ({
    slug: doc.slug.split('/'),
  }))
  
  // 添加空 slug 参数以生成 /docs 页面
  params.push({ slug: [] })
  
  return params
}

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug ? params.slug.join('/') : ''
  
  // 优化：只为侧边栏获取必要的文档信息，不传递完整内容
  const docsForSidebar = allDocs.map(doc => ({
    slug: doc.slug,
    title: doc.title,
    order: doc.order,
    url: doc.url
  }))
  
  // 只获取当前文档的完整内容
  const currentDoc = slug ? allDocs.find(doc => doc.slug === slug) || null : null

  // 所有docs页面都需要密码保护（包括根路径）
  return (
    <DocsClientWrapper 
      docsForSidebar={docsForSidebar}
      currentDoc={currentDoc}
      slug={slug}
    />
  )
} 