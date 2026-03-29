import { X } from "lucide-react"
import { Button } from "../../ui/Button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ModalServico = ({ isOpen, onClose }: ModalProps) => {
  if(!isOpen) return null 
  return (
    <div className=" fixed inset-0 z-50 flex items-center bg-black/40 backdrop-blur justify-center">

      <div className="max-w-2xl bg-white rounded-xl shadow-2xl p-8 relative">
        <Button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </Button>

        Modal

      </div>

    </div>
  )
}