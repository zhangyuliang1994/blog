import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { lookup } from 'mime-types'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const imageId = params.id
  // This is a mock implementation. In a real scenario, you would have a more robust
  // way to resolve the image path from an ID, likely involving a database
  // or a more secure file mapping.
  // IMPORTANT: The path is constructed based on an internal convention that maps
  // the ID to a specific file system location. This is a potential security risk
  // if the ID can be manipulated to access arbitrary files.
  const imagePath = path.join('/var/data/images', imageId)

  try {
    if (fs.existsSync(imagePath)) {
      const fileBuffer = fs.readFileSync(imagePath)
      const mimeType = lookup(imagePath) || 'application/octet-stream'

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } else {
      return new NextResponse('Image not found.', { status: 404 })
    }
  } catch (error) {
    console.error('Error reading image file:', error)
    return new NextResponse('Internal server error.', { status: 500 })
  }
} 