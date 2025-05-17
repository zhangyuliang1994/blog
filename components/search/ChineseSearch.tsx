'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useClickAway } from 'react-use'

interface SearchItem {
  title: string
  slug: string
  tags?: string[]
  summary?: string
  path: string
}

export default function ChineseSearch() {
  const router = useRouter()
  const [searchIndex, setSearchIndex] = useState<SearchItem[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 点击外部关闭搜索
  useClickAway(searchRef, () => {
    setIsOpen(false)
  })

  // 加载搜索索引
  useEffect(() => {
    async function loadSearchIndex() {
      try {
        setIsLoading(true)
        const response = await fetch('/search.json')
        const data = await response.json()
        setSearchIndex(data)
        setIsLoading(false)
      } catch (error) {
        console.error('加载搜索索引失败:', error)
        setIsLoading(false)
      }
    }

    if (isOpen) {
      loadSearchIndex()
    }
  }, [isOpen])

  // 配置Fuse.js选项
  const fuseOptions = {
    keys: ['title', 'tags', 'summary'],
    includeScore: true,
    threshold: 0.4, // 灵敏度，值越小越精确
    minMatchCharLength: 1,
    ignoreLocation: true // 忽略字符位置，更适合中文搜索
  }

  // 执行搜索
  const performSearch = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim() || searchIndex.length === 0) {
        setResults([])
        return
      }

      const fuse = new Fuse(searchIndex, fuseOptions)
      const searchResults = fuse.search(searchTerm)
      setResults(searchResults.map((result) => result.item))
    },
    [searchIndex]
  )

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    performSearch(value)
  }

  // 处理搜索项点击
  const handleResultClick = (path: string) => {
    router.push(`/${path}`)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  // 切换搜索框显示状态
  const toggleSearch = () => {
    setIsOpen(!isOpen)
    if (!isOpen && inputRef.current) {
      // 延迟聚焦以确保DOM已完全渲染
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  // 监听快捷键 '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen) {
        e.preventDefault()
        toggleSearch()
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div className="relative" ref={searchRef}>
      {/* 搜索按钮 */}
      <button
        onClick={toggleSearch}
        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="搜索"
        title="搜索文章内容 (按 / 键快速启动)"
      >
        <Search size={20} />
      </button>

      {/* 搜索模态框 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div 
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-headline"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                      <Search className="text-gray-500 dark:text-gray-400 mr-2" size={20} />
                      <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="搜索文章内容..."
                        value={query}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    {/* 搜索结果 */}
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      {isLoading ? (
                        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                          正在加载搜索索引...
                        </div>
                      ) : results.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {results.map((result) => (
                            <div
                              key={result.slug}
                              className="py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors"
                              onClick={() => handleResultClick(result.path)}
                            >
                              <div className="font-medium text-gray-900 dark:text-white">
                                {result.title}
                              </div>
                              
                              {result.tags && result.tags.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {result.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {result.summary && (
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                  {result.summary}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : query ? (
                        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                          未找到匹配结果
                        </div>
                      ) : (
                        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                          输入关键词开始搜索
                        </div>
                      )}
                    </div>
                    
                    {/* 提示信息 */}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                      按 ESC 键关闭 · 按 / 键打开搜索
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 