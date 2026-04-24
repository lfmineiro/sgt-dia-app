import { Plus, X } from "lucide-react"
import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"
import { useModalAlteracao } from "../../../hooks/useModalAlteracao"
import { getLabelComodo, LABEL_SETOR, type Setor } from "../../../constants/locais"

// centralizar a interface -> assim como centralizar a componente de modal pra deixar padrão
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  local: string
  comodo: string
  onCreated?: () => void
}

export const ModalAddAlteracao = ({ isOpen, onClose, local, comodo, onCreated }: ModalProps) => {
  
  const {
    handleSubmit, descricao, setDescricao, fileInputRef, setArquivo,
    isSubmitting, erro, handleClose, previewUrl
  } = useModalAlteracao({ onClose, local, comodo, onCreated })


  if(!isOpen) return null 
  return (
    <div className=" fixed inset-0 z-50 flex items-center bg-black/40 backdrop-blur justify-center">

      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 relative">
        <Button type="button" onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </Button>

        <p className="text-sm text-slate-500">Local: <strong>{LABEL_SETOR[local as Setor]}</strong></p>
        <p className="text-sm text-slate-500 mb-3">Cômodo: <strong>{getLabelComodo(comodo)}</strong></p>
      
        <Input 
        label="Descrição"
        type="text"
        value={descricao}
        onChange={(event) => setDescricao(event.target.value)}
        className="mt-4 mb-4"
        />

        <h3 className="text-lg font-bold text-slate-800 mb-4 mt-4">Foto</h3>

        <div className="flex flex-col gap-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setArquivo(event.target.files?.[0] ?? null)}
          />
          
          <Button
            type="button"
            leftIcon={<Plus />}
            onClick={() => fileInputRef.current?.click()}
          >
            Adicionar Foto
          </Button>

          {previewUrl && (
            <img 
              src={previewUrl}
              className="h-40 w-40"
            />
            
          )}

          {erro && (
            <p className="text-sm text-red-600">{erro}</p>
          )}

        </div>
        
        <Button 
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="mt-6"
        >
          Criar Alteração
        </Button>



      </form>

    </div>
  )
}