import { DocsLayout } from '@/layouts/DocsLayout'
import { allDocs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { sortDocs } from '@/lib/utils/contentlayer'

export const generateStaticParams = async () => {
  return allDocs.map((doc) => ({
    slug: doc.slug.split('/'),
  }))
}

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug ? params.slug.join('/') : ''
  const sortedDocs = sortDocs(allDocs)
  const docIndex = sortedDocs.findIndex((d) => d.slug === slug)

  if (docIndex === -1) {
    notFound()
  }

  const doc = sortedDocs[docIndex]
  const prev = docIndex > 0 ? sortedDocs[docIndex - 1] : null
  const next = docIndex < sortedDocs.length - 1 ? sortedDocs[docIndex + 1] : null

  const MDXContent = useMDXComponent(doc.body.code)

  return (
    <DocsLayout doc={doc} prev={prev} next={next}>
      <MDXContent />
    </DocsLayout>
  )
} 