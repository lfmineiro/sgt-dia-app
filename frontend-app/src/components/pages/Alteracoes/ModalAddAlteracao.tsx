import { Plus, X } from "lucide-react"
import { useEffect } from "react"
import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"
import { useModalAlteracao } from "../../../hooks/useModalAlteracao"
import {
  getLabelComodo,
  LABEL_SETOR,
  MAPEAMENTO_QUARTOS,
  ORDEM_SETORES,
  type Setor,
} from "../../../constants/locais"
import type { Alteracao } from "../../../types/alterecao.types"

// centralizar a interface -> assim como centralizar a componente de modal pra deixar padrão
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  local: Setor
  comodo: string
  alteracao?: Alteracao | null
  onSaved?: () => void
}

export const ModalAddAlteracao = ({
  isOpen,
  onClose,
  local,
  comodo,
  alteracao,
  onSaved,
}: ModalProps) => {
  
  const {
    handleSubmit,
    descricao,
    setDescricao,
    localSelecionado,
    setLocalSelecionado,
    comodoSelecionado,
    setComodoSelecionado,
    statusSelecionado,
    setStatusSelecionado,
    isEdicao,
    fileInputRef,
    setArquivo,
    isSubmitting,
    erro,
    handleClose,
    previewUrl,
    fotoAtualUrl,
  } = useModalAlteracao({ onClose, local, comodo, alteracao, onSaved })

  useEffect(() => {
    if (!isEdicao) return

    const comodosDaLocalSelecionada = MAPEAMENTO_QUARTOS[localSelecionado] ?? []
    if (!comodosDaLocalSelecionada.some((item) => item.id === comodoSelecionado) && comodosDaLocalSelecionada[0]) {
      setComodoSelecionado(comodosDaLocalSelecionada[0].id)
    }
  }, [comodoSelecionado, isEdicao, localSelecionado, setComodoSelecionado])


  if(!isOpen) return null 
  return (
    <div className=" fixed inset-0 z-50 flex items-center bg-black/40 backdrop-blur justify-center">

      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 relative">
        <Button type="button" onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </Button>

        <p className="text-xl font-semibold text-slate-900 mb-1">
          {isEdicao ? "Editar alteração" : "Criar alteração"}
        </p>

        {isEdicao ? (
          <div className="grid gap-4 md:grid-cols-3 mb-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-900">Local</span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={localSelecionado}
                onChange={(event) => setLocalSelecionado(event.target.value as Setor)}
              >
                {ORDEM_SETORES.map((setor) => (
                  <option key={setor} value={setor}>
                    {LABEL_SETOR[setor]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-900">Cômodo</span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={comodoSelecionado}
                onChange={(event) => setComodoSelecionado(event.target.value)}
              >
                {(MAPEAMENTO_QUARTOS[localSelecionado] ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-900">Status</span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={statusSelecionado}
                onChange={(event) => setStatusSelecionado(event.target.value as typeof statusSelecionado)}
              >
                <option value="NOVA">Nova</option>
                <option value="PENDENTE">Pendente</option>
                <option value="RESOLVIDA">Resolvida</option>
              </select>
            </label>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500">Local: <strong>{LABEL_SETOR[local]}</strong></p>
            <p className="text-sm text-slate-500 mb-3">Cômodo: <strong>{getLabelComodo(comodo)}</strong></p>
          </>
        )}
      
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
            {isEdicao ? "Alterar foto" : "Adicionar Foto"}
          </Button>

          {(previewUrl || fotoAtualUrl) && (
            <img 
              src={previewUrl ?? fotoAtualUrl ?? ""}
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
          {isEdicao ? "Salvar Alteração" : "Criar Alteração"}
        </Button>



      </form>

    </div>
  )
}