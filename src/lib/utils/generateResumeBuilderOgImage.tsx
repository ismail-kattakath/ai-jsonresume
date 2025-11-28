import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import { BACKGROUND_IMAGE_FILE_PATH } from '@/config/background'

interface ResumeBuilderOgImageConfig {
  width: number
  height: number
}

/**
 * Generate OpenGraph/Twitter card image for Resume Builder page
 * Custom design showcasing AI Resume Builder capabilities
 */
export async function generateResumeBuilderOgImage(
  config: ResumeBuilderOgImageConfig
) {
  const { width, height } = config

  // Read background image from filesystem during build
  const backgroundImageBuffer = readFileSync(
    join(process.cwd(), BACKGROUND_IMAGE_FILE_PATH)
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
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
            filter: 'blur(8px)',
            opacity: 0.3,
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
            background:
              'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            padding: '80px',
            textAlign: 'center',
          }}
        >
          {/* Icon/Emoji */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '40px',
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))',
            }}
          >
            🎯
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
              letterSpacing: '-2px',
              filter: 'drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3))',
            }}
          >
            AI Resume Builder
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '50px',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            Build professional resumes and cover letters with AI-powered
            suggestions
          </div>

          {/* Feature Pills */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '1000px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(102, 126, 234, 0.2)',
                border: '2px solid rgba(102, 126, 234, 0.4)',
                borderRadius: '50px',
                color: '#a5b4fc',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              ✨ AI-Powered
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '2px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '50px',
                color: '#e9d5ff',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              📄 Real-time Preview
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(236, 72, 153, 0.2)',
                border: '2px solid rgba(236, 72, 153, 0.4)',
                borderRadius: '50px',
                color: '#fbcfe8',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              📋 JSON Resume
            </div>
          </div>
        </div>

        {/* Bottom Gradient Accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          }}
        />
      </div>
    ),
    {
      width,
      height,
    }
  )
}
