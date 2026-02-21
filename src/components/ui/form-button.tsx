import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa'
import { BaseButton } from './base-button'

interface FormButtonProps {
  size: number
  remove?: () => void
  add: () => void
  label?: string
}

const FormButton = ({ size, remove, add, label = 'Item' }: FormButtonProps) => {
  return (
    <div className="my-2 flex flex-wrap gap-2">
      <BaseButton
        type="button"
        onClick={add}
        aria-label={`Add ${label}`}
        variant="red"
        size="sm"
        icon={<FaPlusCircle className="text-lg" />}
      >
        Add {label}
      </BaseButton>
      {size > 0 && remove && (
        <BaseButton
          type="button"
          onClick={remove}
          aria-label={`Remove ${label}`}
          variant="red"
          size="sm"
          icon={<FaMinusCircle className="text-lg" />}
        >
          Remove {label}
        </BaseButton>
      )}
    </div>
  )
}

export default FormButton
