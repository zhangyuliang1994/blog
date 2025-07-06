'use client'

import { allDocs, Doc } from 'contentlayer/generated'
import { ReactNode } from 'react'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsTOC } from '@/components/docs/DocsTOC'
import { DocsFooter } from '@/components/docs/DocsFooter'
import Breadcrumbs from '@/components/docs/Breadcrumbs'

interface NavDoc {
  title: string
  url: string
  slug: string
}

interface DocsLayoutProps {
  doc: Doc
  prev: NavDoc | null
  next: NavDoc | null
  children: ReactNode
}

export function DocsLayout({ doc, prev, next, children }: DocsLayoutProps) {
  const toc = doc.toc as any

  return (
    <div className="flex">
      <main className="w-full max-w-3xl px-4 py-6 md:px-6">
        <Breadcrumbs doc={doc} />
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{doc.title}</h1>
          {doc.description && (
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">{doc.description}</p>
          )}
        </div>
        <div className="prose max-w-none dark:prose-dark">{children}</div>
        <DocsFooter prev={prev} next={next} />
      </main>
      <div className="hidden w-64 flex-col pl-4 lg:flex">
        <div className="sticky top-20">
          <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">本页目录</h3>
          <DocsTOC toc={toc} />
        </div>
      </div>
    </div>
  )
} 