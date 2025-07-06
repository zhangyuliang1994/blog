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
  const sortedDocs = sortDocs(allDocs)

  // 所有docs页面都需要密码保护（包括根路径）
  return (
    <DocsClientWrapper 
      sortedDocs={sortedDocs}
      slug={slug}
    />
  )
} 