import React from 'react'
import Link from 'next/link'
import { Doc } from 'contentlayer/generated'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbsProps {
  doc: Doc
}

interface Breadcrumb {
  title: string
  href: string
}

export default function Breadcrumbs({ doc }: BreadcrumbsProps) {
  const pathSegments = doc.slug.split('/')
  const breadcrumbs: Breadcrumb[] = []

  // 中文标题映射
  const getChineseTitle = (categorySlug: string): string => {
    const titleMap: Record<string, string> = {
      '01-development-preparation': '开发前期准备',
      '02-ai-tools': '软件工具教程',
      '03-programming-basics': 'Cursor教程',
      '04-advanced-techniques': '全栈开发指南',
      '05-project-practice': '实战项目开发'
    }
    return titleMap[categorySlug] || categorySlug.replace(/^\d+-/, '').replace(/-/g, ' ')
  }
  
  // 首页
  breadcrumbs.push({
    title: 'AI编程',
    href: '/docs'
  })
  
  // 分类
  if (pathSegments.length > 0) {
    breadcrumbs.push({
      title: getChineseTitle(pathSegments[0]),
      href: `/docs/${pathSegments[0]}`
    })
  }
  
  return (
    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
          )}
          <Link 
            href={crumb.href} 
            className={`hover:text-blue-600 dark:hover:text-blue-400`}
          >
            {crumb.title}
          </Link>
        </React.Fragment>
      ))}
      {breadcrumbs.length > 0 && (
        <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
      )}
      <span className="text-gray-900 dark:text-gray-200 font-medium">
        {doc.title}
      </span>
    </div>
  )
} 