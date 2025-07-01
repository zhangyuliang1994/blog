'use client'

import { Doc, allDocs } from 'contentlayer/generated'
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
    for (const doc of docs) {
      const [categorySlug, ...rest] = doc.slug.split('/')
      const categoryName = categorySlug.replace(/^\d+-/, '').replace(/-/g, ' ')

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
    <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] w-64 flex-col pr-4 md:flex">
      <nav className="flex-1 space-y-4">
        {navTree.map((group) => (
          <div key={group.title}>
            <h3
              className="mb-2 flex cursor-pointer items-center justify-between text-sm font-semibold capitalize tracking-wide text-gray-900 dark:text-white"
              onClick={() => toggleCollapse(group.title)}
            >
              {group.title}
              <ChevronRight
                className={`h-4 w-4 transform transition-transform ${
                  isCollapsed[group.title] ? '' : 'rotate-90'
                }`}
              />
            </h3>
            {!isCollapsed[group.title] && (
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url}
                      className={`block rounded-md px-3 py-2 text-sm ${
                        pathname === item.url
                          ? 'bg-primary-100 font-semibold text-primary-600 dark:bg-primary-900'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
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
    </aside>
  )
} 