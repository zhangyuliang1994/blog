import { slug } from 'github-slugger'
import { allCoreContent } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = params.tag
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((tag) => ({
    tag: tag,
  }))
  return paths
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params
  // 对URL参数进行解码
  const decodedTag = decodeURIComponent(tag)
  // Capitalize first letter and convert space to dash
  const title = decodedTag[0].toUpperCase() + decodedTag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    allBlogs.filter(
      (post) => post.draft !== true && post.tags && post.tags.map((t) => slug(t)).includes(decodedTag)
    )
  )
  return <ListLayout posts={filteredPosts} title={title} />
}
