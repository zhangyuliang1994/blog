'use client'

import { DocsLayout } from '@/layouts/DocsLayout'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import PostPasswordPrompt from '@/components/PostPasswordPrompt'
import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Doc } from 'contentlayer/generated'

interface DocsClientWrapperProps {
  docsForSidebar: Array<{
    slug: string
    title: string
    order: number
    url: string
  }>
  currentDoc: Doc | null
  slug: string
}

export default function DocsClientWrapper({ 
  docsForSidebar, 
  currentDoc,
  slug 
}: DocsClientWrapperProps) {
  const [unlocked, setUnlocked] = useState(true) // 初始化为true，避免静态导出时显示密码框
  const [isClient, setIsClient] = useState(false)

  // 排序侧边栏文档
  const sortedDocsForSidebar = docsForSidebar.sort((a, b) => a.order - b.order)
  
  // 计算前后文档（仅用于导航）- 转换为DocsLayout需要的格式
  const docIndex = slug ? sortedDocsForSidebar.findIndex((d) => d.slug === slug) : -1
  const prevNav = docIndex > 0 ? sortedDocsForSidebar[docIndex - 1] : null
  const nextNav = docIndex < sortedDocsForSidebar.length - 1 ? sortedDocsForSidebar[docIndex + 1] : null
  
  // 为DocsLayout创建导航对象
  const prev = prevNav ? { 
    title: prevNav.title, 
    url: prevNav.url,
    slug: prevNav.slug
  } : null
  
  const next = nextNav ? { 
    title: nextNav.title, 
    url: nextNav.url,
    slug: nextNav.slug
  } : null
  
  // 总是调用 useMDXComponent，但只在有文档时使用
  const MDXContent = currentDoc ? useMDXComponent(currentDoc.body.code) : null

  useEffect(() => {
    setIsClient(true)
    const isUnlocked = sessionStorage.getItem('docs_unlocked') === 'true'
    if (!isUnlocked) {
      setUnlocked(false)
    }
  }, [])

  // 等待客户端渲染完成，避免静态导出时的水合问题
  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Password protection for all docs pages (including root)
  if (!unlocked) {
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

  // If no slug, show docs index page
  if (!slug) {
    // 按照分类组织文档
    const docsByCategory: Record<string, typeof sortedDocsForSidebar> = {}
    
    sortedDocsForSidebar.forEach(doc => {
      const [category] = doc.slug.split('/')
      if (!docsByCategory[category]) {
        docsByCategory[category] = []
      }
      docsByCategory[category].push(doc)
    })
    
    const categoryData = [
      {
        key: '01-development-preparation',
        name: '开发前期准备',
        icon: '🚀',
        gradient: 'from-blue-500 to-purple-600',
        description: '从零开始搭建AI编程环境，掌握必备工具和账号配置'
      },
      {
        key: '02-ai-tools',
        name: '软件工具教程',
        icon: '🛠️',
        gradient: 'from-green-500 to-teal-600',
        description: '深度学习主流AI开发工具，提升编程效率'
      },
      {
        key: '03-programming-basics',
        name: 'Cursor教程',
        icon: '💻',
        gradient: 'from-purple-500 to-pink-600',
        description: '掌握AI代码编辑器，体验智能编程的魅力'
      },
      {
        key: '04-advanced-techniques',
        name: '全栈开发指南',
        icon: '⚡',
        gradient: 'from-yellow-500 to-orange-600',
        description: '从前端到后端，构建完整的现代化应用'
      },
      {
        key: '05-project-practice',
        name: '实战项目开发',
        icon: '🎯',
        gradient: 'from-red-500 to-pink-600',
        description: '通过真实项目，巩固AI编程技能'
      }
    ]
    
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <DocsSidebar docs={sortedDocsForSidebar} />
        <main className="flex-1 overflow-hidden">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative px-8 py-16">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  AI编程从零到一
                </h1>
                <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  探索AI驱动的编程世界，从工具配置到项目实战，让AI成为你的最佳编程伙伴
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm font-medium">📚 {sortedDocsForSidebar.length} 篇教程</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm font-medium">🎯 5 个模块</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm font-medium">⚡ 实战导向</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="px-8 py-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                学习路径
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryData.map((category, index) => {
                  const docs = docsByCategory[category.key] || []
                  const overviewDoc = docs.find(doc => doc.slug.endsWith('overview') || doc.order === 0)
                  
                  return (
                    <div
                      key={category.key}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      
                      {/* Content */}
                      <div className="relative p-6">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                            {category.icon}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                              {category.name}
                            </h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              第 {index + 1} 章 · {docs.length} 篇文章
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          {category.description}
                        </p>
                        
                        {/* Articles Preview */}
                        <div className="space-y-2 mb-6">
                          {docs
                            .sort((a, b) => a.order - b.order)
                            .slice(0, 3)
                            .map(doc => (
                              <Link
                                key={doc.slug}
                                href={doc.url}
                                className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group/item"
                              >
                                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 group-hover/item:bg-blue-500 transition-colors duration-200 mr-3"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-200 truncate">
                                  {doc.title}
                                </span>
                              </Link>
                            ))}
                          {docs.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 pl-5">
                              还有 {docs.length - 3} 篇文章...
                            </div>
                          )}
                        </div>
                        
                        {/* Action Button */}
                        <Link
                          href={overviewDoc?.url || `/docs/${category.key}`}
                          className={`block w-full text-center py-3 px-4 rounded-xl bg-gradient-to-r ${category.gradient} text-white font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                        >
                          开始学习 →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gray-50 dark:bg-gray-800 px-8 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                你将学到什么
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    🤖
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI工具掌握</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    熟练使用Cursor、GitHub Copilot等AI编程工具
                  </p>
                </div>
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    ⚡
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">效率提升</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    让AI辅助编程，大幅提升开发效率和代码质量
                  </p>
                </div>
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    🎯
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">项目实战</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    通过真实项目，巩固AI编程技能和最佳实践
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Handle specific doc page
  if (docIndex === -1) {
    notFound()
  }

  if (!currentDoc || !MDXContent) {
    notFound()
  }

  return (
    <div className="flex">
      <DocsSidebar docs={sortedDocsForSidebar} />
      <DocsLayout doc={currentDoc} prev={prev} next={next}>
        <MDXContent />
      </DocsLayout>
    </div>
  )
}