import Link from 'next/link'
import { Doc } from 'contentlayer/generated'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface DocsFooterProps {
  prev: Doc | null
  next: Doc | null
}

export function DocsFooter({ prev, next }: DocsFooterProps) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between">
        {prev ? (
          <Link 
            href={prev.url} 
            className="group flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {prev.title}
          </Link>
        ) : (
          <div></div>
        )}
        {next && (
          <Link 
            href={next.url} 
            className="group flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {next.title}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  )
} 