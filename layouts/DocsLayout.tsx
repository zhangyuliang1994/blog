'use client'

import { allDocs, Doc } from 'contentlayer/generated'
import { ReactNode } from 'react'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsTOC } from '@/components/docs/DocsTOC'
import { DocsFooter } from '@/components/docs/DocsFooter'
import { Breadcrumbs } from '@/components/docs/Breadcrumbs'

interface DocsLayoutProps {
  doc: Doc
  prev: Doc | null
  next: Doc | null
  children: ReactNode
}

export function DocsLayout({ doc, prev, next, children }: DocsLayoutProps) {
  const toc = doc.toc as any

  return (
    <div className="mx-auto flex max-w-screen-xl">
      <DocsSidebar docs={allDocs} />
      <main className="w-full max-w-3xl flex-1 px-4 py-8 md:px-8">
        <Breadcrumbs slug={doc.slug} />
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{doc.title}</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{doc.description}</p>
        </div>
        <div className="prose max-w-none dark:prose-dark">{children}</div>
        <DocsFooter prev={prev} next={next} />
      </main>
      <div className="hidden w-64 flex-col pl-4 lg:flex">
        <div className="sticky top-24">
          <h2 className="mb-2 font-semibold">On this page</h2>
          <DocsTOC toc={toc} />
        </div>
      </div>
    </div>
  )
} 