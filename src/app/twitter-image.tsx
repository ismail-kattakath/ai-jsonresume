import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-static'

export const alt = 'Ismail Kattakath - Principal Software Engineer & Technical Leader'
export const size = {
  width: 1200,
  height: 600,
}

export const contentType = 'image/png'

export default async function Image() {
  // Read images from filesystem during build and convert to ArrayBuffer
  const backgroundImageBuffer = readFileSync(
    join(process.cwd(), 'public', 'images', 'background.jpg')
  )
  const backgroundImageData = backgroundImageBuffer.buffer.slice(
    backgroundImageBuffer.byteOffset,
    backgroundImageBuffer.byteOffset + backgroundImageBuffer.byteLength
  )

  // Read and parse SVG logo to extract path data
  const logoSvg = readFileSync(
    join(process.cwd(), 'public', 'images', 'logo.svg'),
    'utf-8'
  )

  // Extract path d attribute from SVG
  const pathMatch = logoSvg.match(/<path[^>]*\sd="([^"]+)"/)
  const pathData = pathMatch ? pathMatch[1] : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background Image with blur effect applied directly */}
        <img
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          src={backgroundImageData as any}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(4px)',
          }}
        />

        {/* Dark Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
          }}
        />

        {/* SVG Logo - Centered - dynamically loaded from logo.svg */}
        <svg
          width="560"
          height="315"
          viewBox="0 0 1280 720"
          style={{
            zIndex: 1,
          }}
        >
          <path fill="#ffffff" d={pathData} />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
