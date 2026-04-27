import { Plus, Trash2, X } from "lucide-react"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { useModalServico } from "../hooks/useModalServico"
import type { Aluno } from "../types/aluno.types"


interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ModalServico = ({ isOpen, onClose }: ModalProps) => {
  const { 
    dataServico, setDataServico, membros, alunos, 
    adicionarMembro, removerMembro, atualizarMembro,
    handleSalvar, isSalvando 
  } = useModalServico(onClose);
  if(!isOpen) return null 
  return (
    <div className=" fixed inset-0 z-50 flex items-center bg-black/40 backdrop-blur justify-center">

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 relative">
        <Button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </Button>
      
        <Input 
        label="Data"
        type="data"
        value={dataServico}
        onChange={(e) => setDataServico(e.target.value)}
        className="mt-4 mb-4"
        />

        <h3 className="text-lg font-bold text-slate-800 mb-4 mt-4">Guarnição de Alunos</h3>

        <div className="flex flex-col gap-5">
          {membros.map((membro, index) => (
            <div key={index} className="flex gap-3 items-center">
              
              {/* Select do Aluno */}
              <select 
                value={membro.alunoNumero}
                onChange={(e) => atualizarMembro(index, 'alunoNumero', e.target.value)}
                className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecionar Aluno...</option>
                {alunos.map((aluno: Aluno) => (
                  <option key={aluno.numero} value={aluno.numero}>
                    {aluno.nomeGuerra} ({aluno.numero})
                  </option>
                ))}
              </select>

              {/* Select da Função */}
              <select 
                value={membro.funcao}
                onChange={(e) => atualizarMembro(index, 'funcao', e.target.value)}
                className="w-1/3 p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Função...</option>
                <option value="SGT_DIA">Sgt Dia</option>
                <option value="CB_DIA">Cb Dia</option>
                <option value="PLANTAO">Plantão</option>
                <option value="PERMANENCIA">Permanência</option>
              </select>

              {/* Botão Remover Linha */}
              <button 
                onClick={() => removerMembro(index)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <Button 
          leftIcon={<Plus />}
          onClick={adicionarMembro}>Adicionar Aluno</Button>

        </div>
        
        <Button 
        className="mt-6"
        onClick={handleSalvar}
        disabled={isSalvando}
        >
          Criar Serviço
        </Button>



      </div>

    </div>
  )
}