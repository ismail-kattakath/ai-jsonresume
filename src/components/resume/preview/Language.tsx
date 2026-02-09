import { useAISettings } from '@/lib/contexts/AISettingsContext'
import { Highlight } from '@/components/ui/Highlight'

const Language = ({ title, languages }) => {
  const { settings } = useAISettings()
  return (
    languages.length > 0 && (
      <div>
        <h2 className="section-title mb-1 border-b-2 border-dashed border-gray-300">
          {title}
        </h2>
        <p className="content">
          <Highlight
            text={languages.join(', ')}
            keywords={settings.skillsToHighlight}
          />
        </p>
      </div>
    )
  )
}

export default Language
