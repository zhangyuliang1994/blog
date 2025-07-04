'use client'

import { DocsLayout } from '@/layouts/DocsLayout'
import { allDocs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { sortDocs } from '@/lib/utils/contentlayer'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import PostPasswordPrompt from '@/components/PostPasswordPrompt'

export const generateStaticParams = async () => {
  return allDocs.map((doc) => ({
    slug: doc.slug.split('/'),
  }))
}

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug ? params.slug.join('/') : ''
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (slug) {
      const isUnlocked = sessionStorage.getItem('docs_unlocked') === 'true'
      if (isUnlocked) {
        setUnlocked(true)
      }
    }
  }, [slug])
  
  // If no slug, show docs index page
  if (!slug) {
    const sortedDocs = sortDocs(allDocs)
    
    // 按照分类组织文档
    const docsByCategory: Record<string, typeof allDocs> = {}
    
    sortedDocs.forEach(doc => {
      const [category] = doc.slug.split('/')
      if (!docsByCategory[category]) {
        docsByCategory[category] = []
      }
      docsByCategory[category].push(doc)
    })
    
    const categoryNames: Record<string, string> = {
      '01-development-preparation': '开发前期准备',
      '02-ai-tools': '软件工具教程',
      '03-programming-basics': 'Cursor教程',
      '04-advanced-techniques': '全栈开发指南',
      '05-project-practice': '实战项目开发'
    }
    
    return (
      <div className="flex">
        <DocsSidebar docs={sortedDocs} />
        <main className="flex-1">
          <div className="mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                AI编程教程
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                从零开始学习AI驱动的编程开发，掌握现代开发工具和技巧
              </p>
            </div>
            
            <div className="space-y-8">
              {Object.keys(docsByCategory)
                .sort()
                .map(category => {
                  const docs = docsByCategory[category]
                  const categoryName = categoryNames[category] || category
                  
                  // 获取章节概览文档
                  const overviewDoc = docs.find(doc => doc.slug.endsWith('overview') || doc.order === 0)
                  
                  return (
                    <div key={category} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        {categoryName}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {overviewDoc?.description || '了解更多关于这个主题的内容'}
                      </p>
                      <ul className="space-y-1 ml-5 list-disc">
                        {docs
                          .sort((a, b) => a.order - b.order)
                          .slice(0, 5)
                          .map(doc => (
                            <li key={doc.slug}>
                              <Link
                                href={doc.url}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                {doc.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                      {docs.length > 5 && (
                        <Link
                          href={overviewDoc?.url || `/docs/${category}`}
                          className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          查看全部 ({docs.length}) →
                        </Link>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </main>
      </div>
    )
  }
  
  const sortedDocs = sortDocs(allDocs)
  const docIndex = sortedDocs.findIndex((d) => d.slug === slug)

  if (docIndex === -1) {
    notFound()
  }

  const doc = sortedDocs[docIndex]
  const prev = docIndex > 0 ? sortedDocs[docIndex - 1] : null
  const next = docIndex < sortedDocs.length - 1 ? sortedDocs[docIndex + 1] : null

  const MDXContent = useMDXComponent(doc.body.code)

  // Password protection for all docs pages
  if (slug && !unlocked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <PostPasswordPrompt
          password_real={'Xiaofeng2025.'}
          onCorrectPassword={() => {
            sessionStorage.setItem('docs_unlocked', 'true')
            setUnlocked(true)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex">
      <DocsSidebar docs={sortedDocs} />
      <DocsLayout doc={doc} prev={prev} next={next}>
        <MDXContent />
      </DocsLayout>
    </div>
  )
} 