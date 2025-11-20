import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Logo } from '@/components/Logo'

interface OgImageConfig {
  width: number
  height: number
  logoWidth: number
  logoHeight: number
}

/**
 * Generate OpenGraph/Twitter card image with logo centered on blurred background
 * DRY utility shared by opengraph-image.tsx and twitter-image.tsx
 */
export async function generateOgImage(config: OgImageConfig) {
  const { width, height, logoWidth, logoHeight } = config

  // Read background image from filesystem during build
  const backgroundImageBuffer = readFileSync(
    join(process.cwd(), 'public', 'images', 'background.jpg')
  )
  const backgroundImageData = backgroundImageBuffer.buffer.slice(
    backgroundImageBuffer.byteOffset,
    backgroundImageBuffer.byteOffset + backgroundImageBuffer.byteLength
  )

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
        {/* Background Image with blur effect */}
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

        {/* SVG Logo - Centered */}
        <Logo width={logoWidth} height={logoHeight} />
      </div>
    ),
    {
      width,
      height,
    }
  )
}
