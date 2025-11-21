import resumeData from "@/lib/resumeAdapter"
import { generateOgImage } from '@/utils/generateOgImage'

export const dynamic = 'force-static'

export const alt = (resumeData.name || 'Portfolio').toUpperCase()
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return generateOgImage({
    width: size.width,
    height: size.height,
    logoWidth: 600,
    logoHeight: 337,
  })
}
