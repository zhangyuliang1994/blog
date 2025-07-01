import { Doc } from 'contentlayer/generated'
import Link from 'next/link'

interface DocsFooterProps {
  prev: Doc | null
  next: Doc | null
}

export function DocsFooter({ prev, next }: DocsFooterProps) {
  return (
    <div className="mt-12 flex justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
      <div>
        {prev && (
          <Link
            href={prev.url}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <div className="text-sm text-gray-500">Previous</div>
            <div className="font-semibold">{prev.title}</div>
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={next.url}
            className="text-right text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <div className="text-sm text-gray-500">Next</div>
            <div className="font-semibold">{next.title}</div>
          </Link>
        )}
      </div>
    </div>
  )
} 