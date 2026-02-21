import { useContext } from 'react'
import Image from 'next/image'
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaGlobe,
  FaPassport,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaBriefcase,
} from 'react-icons/fa'
import ContactInfo from '@/components/document-builder/shared-preview/contact-info'
import { formatUrl } from '@/lib/utils/format-url'
import { ResumeContext } from '@/lib/contexts/document-context'
import type { ResumeData, SocialMediaLink } from '@/types/resume'

const ProfileHeader = () => {
  const context = useContext(ResumeContext)

  if (!context) {
    return null
  }

  const { resumeData, setResumeData, editable = true } = context

  const icons = [
    { name: 'github', icon: <FaGithub /> },
    { name: 'linkedin', icon: <FaLinkedin /> },
    { name: 'twitter', icon: <FaTwitter /> },
    { name: 'facebook', icon: <FaFacebook /> },
    { name: 'instagram', icon: <FaInstagram /> },
    { name: 'youtube', icon: <FaYoutube /> },
    { name: 'website', icon: <FaGlobe /> },
  ]

  const hasPhoto = resumeData.profilePicture && resumeData.profilePicture.length > 0

  return (
    <div
      className={`mb-2 flex border-b-2 border-dashed border-gray-300 pb-1 ${
        hasPhoto ? 'flex-row items-center gap-4' : 'flex-col items-center'
      }`}
    >
      {hasPhoto && (
        <div className="h-32 w-32 shrink-0 overflow-hidden border border-gray-300">
          <Image
            src={resumeData.profilePicture}
            alt="profile"
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className={`flex-1 ${hasPhoto ? 'text-left' : 'text-center'}`}>
        <h1 className="name editable" contentEditable={editable} suppressContentEditableWarning>
          {resumeData.name}
        </h1>
        <h2 className="profession editable" contentEditable={editable} suppressContentEditableWarning>
          {resumeData.position}
        </h2>
        <ContactInfo
          mainclass={`flex flex-row gap-4 mb-1 contact ${hasPhoto ? '' : 'justify-center'}`}
          linkclass="inline-flex items-center gap-1"
          teldata={resumeData.contactInformation}
          emaildata={resumeData.email}
          addressdata={resumeData.address}
          nationalitydata={resumeData.nationality}
          visadata={resumeData.visaStatus}
          telicon={<FaPhone />}
          emailicon={<FaEnvelope />}
          addressicon={<FaMapMarkerAlt />}
          nationalityicon={<FaPassport />}
        />
        <div
          className={`social-media-container mb-1 flex flex-row flex-wrap gap-4 ${hasPhoto ? '' : 'justify-center'}`}
        >
          {resumeData.socialMedia &&
            resumeData.socialMedia.map((socialMedia: SocialMediaLink, index: number) => {
              const handleSocialMediaBlur = (e: React.FocusEvent<HTMLAnchorElement>) => {
                const newSocialMedia = resumeData.socialMedia.map((item, i) =>
                  i === index
                    ? {
                        ...item,
                        link: (e.target as HTMLElement).innerText,
                      }
                    : item
                )
                setResumeData({
                  ...resumeData,
                  socialMedia: newSocialMedia,
                })
              }

              return (
                <a
                  href={formatUrl(socialMedia.link)}
                  aria-label={socialMedia.socialMedia}
                  key={index}
                  title={socialMedia.socialMedia}
                  target="_blank"
                  rel="noreferrer"
                  className="content align-center editable inline-flex items-center justify-center gap-1 text-blue-700 hover:underline"
                  contentEditable={editable}
                  suppressContentEditableWarning
                  onBlur={handleSocialMediaBlur}
                >
                  {icons.map((icon, i) => {
                    if (icon.name === socialMedia.socialMedia.toLowerCase()) {
                      return <span key={i}>{icon.icon}</span>
                    }
                  })}
                  {socialMedia.link}
                </a>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
