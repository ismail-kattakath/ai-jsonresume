import { MdAddCircle, MdRemoveCircle } from 'react-icons/md'

interface FormButtonProps {
  size: number
  remove?: () => void
  add: () => void
  label?: string
}

const FormButton = ({ size, remove, add, label = 'Item' }: FormButtonProps) => {
  return (
    <div className="my-2 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={add}
        aria-label={`Add ${label}`}
        className="inline-flex cursor-pointer items-center gap-2 rounded bg-red-800 px-3 py-1.5 text-sm text-white transition-colors hover:opacity-90"
      >
        <MdAddCircle className="text-lg" />
        <span>Add {label}</span>
      </button>
      {size > 0 && remove && (
        <button
          type="button"
          onClick={remove}
          aria-label={`Remove ${label}`}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-red-800 px-3 py-1.5 text-sm text-white transition-colors hover:opacity-90"
        >
          <MdRemoveCircle className="text-lg" />
          <span>Remove {label}</span>
        </button>
      )}
    </div>
  )
}

export default FormButton
