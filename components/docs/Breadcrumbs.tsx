import Link from 'next/link'

interface BreadcrumbsProps {
  slug: string
}

function toTitleCase(str: string) {
  return str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export function Breadcrumbs({ slug }: BreadcrumbsProps) {
  const segments = slug.split('/').filter(Boolean)

  return (
    <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
      <Link href="/docs/01-getting-started/01-introduction" className="hover:text-primary-500">
        Docs
      </Link>
      {segments.map((segment, index) => {
        const path = `/docs/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        const title = toTitleCase(segment.replace(/^\d+-/, ''))

        return (
          <span key={path}>
            <span className="mx-2">/</span>
            {!isLast ? (
              <Link href={path} className="hover:text-primary-500">
                {title}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800 dark:text-gray-200">{title}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
} 