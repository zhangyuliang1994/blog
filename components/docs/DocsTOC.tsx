'use client'

import { Toc } from '../remark-toc-headings'
import { useState, useEffect, useRef } from 'react'

interface DocsTocProps {
  toc: Toc
}

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({})
  useEffect(() => {
    const callback = (headings: IntersectionObserverEntry[]) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement
        return map
      }, headingElementsRef.current)

      const visibleHeadings: IntersectionObserverEntry[] = []
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key]
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement)
      })

      const getIndexFromId = (id: string) =>
        headings.findIndex((heading) => heading.target.id === id)

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id)
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id)
        )
        setActiveId(sortedVisibleHeadings[0].target.id)
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -40% 0px',
    })

    const headingElements = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6'))
    headingElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [setActiveId])
}

export function DocsTOC({ toc }: DocsTocProps) {
  const [activeId, setActiveId] = useState('')
  useIntersectionObserver(setActiveId)

  if (toc.length === 0) {
    return null
  }

  return (
    <ul className="space-y-2">
      {toc.map((heading) => (
        <li
          key={heading.value}
          className={`${heading.depth >= 3 ? 'pl-4' : ''} ${
            heading.depth >= 4 ? 'pl-8' : ''
          }`}
        >
          <a
            href={heading.url}
            className={`block text-sm transition-colors duration-200 ${
              activeId === heading.url.slice(1)
                ? 'font-medium text-primary-500'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            {heading.value}
          </a>
        </li>
      ))}
    </ul>
  )
} 