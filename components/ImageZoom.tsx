'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageZoomProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function ImageZoom({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = '' 
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const handleImageClick = () => {
    setIsZoomed(true)
  }

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsZoomed(false)
    }
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
        onClick={handleImageClick}
        unoptimized
      />
      
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={handleModalClick}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 z-10"
              aria-label="关闭"
            >
              ✕
            </button>
            <Image
              src={src}
              alt={alt}
              width={width * 1.5}
              height={height * 1.5}
              className="max-w-full max-h-full object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  )
} 