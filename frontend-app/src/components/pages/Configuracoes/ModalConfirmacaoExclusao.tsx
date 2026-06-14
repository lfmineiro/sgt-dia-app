import { X, AlertTriangle } from "lucide-react"
import { Button } from "../../ui/Button"

interface ModalConfirmacaoExclusaoProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  titulo?: string
  mensagem?: string
  isExcluindo?: boolean
}

export const ModalConfirmacaoExclusao = ({
  isOpen,
  onClose,
  onConfirm,
  titulo = "Confirmar Exclusão",
  mensagem = "Tem certeza que deseja excluir esta alteração? Esta ação não pode ser desfeita.",
  isExcluindo = false,
}: ModalConfirmacaoExclusaoProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center bg-black/40 backdrop-blur justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 relative">
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 h-8 w-8"
        >
          <X size={20} />
        </Button>

        <div className="flex items-center gap-3 mb-4 text-red-600">
          <div className="p-2 bg-red-50 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{titulo}</h2>
        </div>

        <p className="text-slate-600 mb-8">
          {mensagem}
        </p>

        <div className="flex gap-3 justify-end">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={onClose}
            disabled={isExcluindo}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isExcluindo}
            disabled={isExcluindo}
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  )
}
