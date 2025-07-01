import { Doc } from 'contentlayer/generated'

export const sortDocs = (docs: Doc[]) => {
  return docs.sort((a, b) => {
    const aOrder = a.slug.split('/')[0]
    const bOrder = b.slug.split('/')[0]

    if (aOrder !== bOrder) {
      return parseInt(aOrder) - parseInt(bOrder)
    }

    return a.order - b.order
  })
} 