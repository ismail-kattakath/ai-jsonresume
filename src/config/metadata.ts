import DefaultResumeData from '@/components/resume-builder/utility/DefaultResumeData'
import { SITE_URL } from '@/config/site'
import type { Metadata } from 'next'

/**
 * Generate metadata from DefaultResumeData
 * Single source of truth for all site metadata
 */
export function generateSiteMetadata(): Metadata {
  const { name, position, summary, socialMedia } = DefaultResumeData

  // Find LinkedIn handle for Twitter creator field
  const linkedInProfile = socialMedia.find(
    (sm) => sm.socialMedia === 'LinkedIn'
  )
  const linkedInHandle = linkedInProfile?.link.replace('linkedin.com/in/', '')

  // OG title: "Name - Position"
  const siteTitle = name && position ? `${name} - ${position}` : name || 'Portfolio'

  // OG description: First sentence from summary (55-200 chars)
  let siteDescription = 'Professional Portfolio'

  if (summary) {
    // Extract first sentence from summary
    const firstSentence = summary.split(/[.!?]/)[0]?.trim()
    if (firstSentence) {
      siteDescription = firstSentence

      // Ensure 55-200 character requirement
      if (siteDescription.length < 55) {
        // If too short, try adding second sentence
        const sentences = summary.split(/[.!?]/).filter(s => s.trim())
        if (sentences.length > 1) {
          siteDescription = `${sentences[0].trim()}. ${sentences[1].trim()}`
        }
      }

      // Truncate if too long
      if (siteDescription.length > 200) {
        siteDescription = siteDescription.substring(0, 197) + '...'
      }
    }
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${name}`,
    },
    description: siteDescription,
    keywords:
      'Principal Software Engineer, Technical Leader, Full Stack, AI/ML, OAuth, SSO, CI/CD, Kubernetes, MCP Gateways, RAG Systems, GenAI, Machine Learning, Cloud Architecture',
    authors: [{ name }],
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: SITE_URL,
      siteName: name,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      creator: linkedInHandle ? `@${linkedInHandle}` : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Google Search Console verification handled via DNS (Domain name provider method)
    // No meta tag needed
  }
}
