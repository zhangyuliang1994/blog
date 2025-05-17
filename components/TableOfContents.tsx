'use client'

import { useState, useEffect, useRef } from 'react'
import { Toc } from './remark-toc-headings'

interface TableOfContentsProps {
  toc: Toc
  indentDepth?: number
  fromHeading?: number
  toHeading?: number
}

const TableOfContents = ({
  toc,
  indentDepth = 3,
  fromHeading = 1,
  toHeading = 6,
}: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('')
  const [readingProgress, setReadingProgress] = useState<number>(0)
  const headingElementsRef = useRef<{ id: string; top: number }[]>([])

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter((element) => element.id)
      .map((element) => ({
        id: element.id,
        top: element.getBoundingClientRect().top + window.scrollY,
      }))
    
    headingElementsRef.current = headingElements
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      const headingElements = headingElementsRef.current
      
      if (headingElements.length === 0) return
      
      // 找到当前位置对应的标题
      for (let i = headingElements.length - 1; i >= 0; i--) {
        if (scrollPosition >= headingElements[i].top) {
          setActiveId(headingElements[i].id)
          break
        }
      }
      
      // 如果滚动到顶部，选择第一个标题
      if (scrollPosition < headingElements[0].top) {
        setActiveId(headingElements[0].id)
      }
      
      // 计算阅读进度
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)
      setReadingProgress(scrollPercent > 100 ? 100 : (scrollPercent < 0 ? 0 : scrollPercent))
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const filteredToc = toc.filter(
    (heading) => heading.depth >= fromHeading && heading.depth <= toHeading
  )

  if (filteredToc.length === 0) {
    return null
  }

  // 对目录进行编号处理
  const generateNumberedToc = (items) => {
    let level1Counter = 0;
    let level2Counter = 0;
    let level3Counter = 0;
    
    return items.map((item) => {
      let prefix = '';
      if (item.depth === 1 || item.depth === 2) {
        level1Counter++;
        level2Counter = 0;
        level3Counter = 0;
        prefix = `${level1Counter}. `;
      } else if (item.depth === 3) {
        if (level2Counter === 0) level2Counter = 1;
        level2Counter++;
        level3Counter = 0;
        prefix = `${level1Counter}.${level2Counter - 1} `;
      } else if (item.depth === 4) {
        if (level3Counter === 0) level3Counter = 1;
        level3Counter++;
        prefix = `${level1Counter}.${level2Counter - 1}.${level3Counter - 1} `;
      }
      
      return {
        ...item,
        prefix,
      };
    });
  };
  
  const numberedToc = generateNumberedToc(filteredToc);

  return (
    <div className="fixed left-4 top-24 w-64 hidden lg:block">
      <div className="max-h-[calc(100vh-9rem)] overflow-auto rounded-lg px-4 py-3 shadow-lg transition-colors duration-200 bg-gray-100 dark:bg-zinc-800/90">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">目录</h2>
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-green-300">
            {readingProgress}%
          </span>
        </div>
        <ul className="space-y-1">
          {numberedToc.map((heading) => (
            <li
              key={heading.value}
              className={`
                ${heading.depth === 2 ? 'pl-0' : ''}
                ${heading.depth === 3 ? 'pl-4' : ''}
                ${heading.depth === 4 ? 'pl-8' : ''}
                ${heading.depth > 4 ? 'pl-12' : ''}
                py-1
              `}
            >
              <a
                href={heading.url}
                className={`
                  block text-sm relative group transition-all duration-200
                  ${
                    activeId === heading.url.slice(1)
                      ? 'text-primary-500 dark:text-green-400 font-medium bg-primary-50 dark:bg-green-900/20 -mx-2 px-2 py-1 rounded-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-green-400'
                  }
                `}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.url.slice(1))
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 100,
                      behavior: 'smooth',
                    })
                    setActiveId(heading.url.slice(1))
                  }
                }}
              >
                {activeId === heading.url.slice(1) && (
                  <span className="absolute left-0 -ml-3 text-primary-500 dark:text-green-400">▶</span>
                )}
                <span className="font-medium mr-1">{heading.prefix}</span>
                {heading.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TableOfContents 