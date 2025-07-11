import TOCInline from './TOCInline'
import Pre from './Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import ImageZoom from './ImageZoom'
import CustomLink from './Link'
import CImage from './CImage'

export const components: MDXComponents = {
  Image: ImageZoom,
  img: ImageZoom,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm,
  CImage,
}
