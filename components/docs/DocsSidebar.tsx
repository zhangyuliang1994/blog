'use client'

import { Doc } from 'contentlayer/generated'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'

interface DocsSidebarProps {
  docs: Doc[]
}

interface NavItem {
  title: string
  url: string
  order: number
}

interface NavGroup {
  title: string
  order: number
  items: NavItem[]
}

function getInitialCollapsedState(navTree: NavGroup[], pathname: string | null) {
  if (!pathname) return {}
  const state: Record<string, boolean> = {}
  for (const group of navTree) {
    const isActiveGroup = group.items.some((item) => item.url === pathname)
    state[group.title] = !isActiveGroup
  }
  return state
}

export function DocsSidebar({ docs }: DocsSidebarProps) {
  const pathname = usePathname()

  const navTree = useMemo(() => {
    const tree: Record<string, NavGroup> = {}
    
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

    for (const doc of docs) {
      const [categorySlug, ...rest] = doc.slug.split('/')
      const categoryName = getChineseTitle(categorySlug)

      if (!tree[categorySlug]) {
        tree[categorySlug] = {
          title: categoryName,
          order: parseInt(categorySlug.match(/^(\d+)-/)?.[1] || '0', 10),
          items: [],
        }
      }
      tree[categorySlug].items.push({
        title: doc.title,
        url: doc.url,
        order: doc.order,
      })
    }

    const sortedTree = Object.values(tree).sort((a, b) => a.order - b.order)
    sortedTree.forEach((group) => {
      group.items.sort((a, b) => a.order - b.order)
    })

    return sortedTree
  }, [docs])

  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState(navTree, pathname))

  const toggleCollapse = (title: string) => {
    setIsCollapsed((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-16 z-30">
      <div className="p-4">
        <Link href="/docs" className="block mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            AI编程入门指南
          </h2>
        </Link>
        <nav className="space-y-1">
          {navTree.map((group) => (
            <div key={group.title} className="mb-2">
              <button
                className="flex w-full items-center justify-between py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2"
                onClick={() => toggleCollapse(group.title)}
              >
                <span>{group.title}</span>
                <ChevronRight
                  className={`h-4 w-4 transform transition-transform ${
                    isCollapsed[group.title] ? '' : 'rotate-90'
                  }`}
                />
              </button>
              {!isCollapsed[group.title] && (
                <ul className="mt-1 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.url}>
                      <Link
                        href={item.url}
                        className={`block py-1.5 pl-6 text-sm rounded ${
                          pathname === item.url
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
} 