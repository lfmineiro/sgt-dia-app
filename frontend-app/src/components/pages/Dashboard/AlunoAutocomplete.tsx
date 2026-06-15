import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "../../ui/Input"
import type { Aluno } from "../../../types/aluno.types"

interface AlunoAutocompleteProps {
  value: number
  onChange: (v: string) => void
  alunos: Aluno[]
  disabled?: boolean
}

export const AlunoAutocomplete = ({ 
  value, 
  onChange, 
  alunos, 
  disabled 
}: AlunoAutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sincronizar termo de busca com o valor selecionado
  useEffect(() => {
    const selected = alunos.find(a => a.numero === value)
    if (selected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchTerm(`${selected.nomeGuerra} (${selected.numero})`)
    } else if (value === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchTerm("")
    }
  }, [value, alunos])

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        // Resetar para o nome selecionado se fechar sem escolher
        const selected = alunos.find(a => a.numero === value)
        if (selected) {
          setSearchTerm(`${selected.nomeGuerra} (${selected.numero})`)
        } else {
          setSearchTerm("")
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [value, alunos])

  const filtered = alunos.filter(a => 
    a.nomeGuerra.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.numero.toString().includes(searchTerm)
  )

  return (
    <div ref={containerRef} className="relative flex-1">
      <Input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setIsOpen(true)
          if (e.target.value === "") onChange("0")
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Buscar Aluno..."
        disabled={disabled}
        iconRight={<Search size={18} />}
        className="!h-10 !py-2"
      />

      {isOpen && !disabled && (
        <div className="absolute z-[60] w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto">
          {filtered.length > 0 ? (
            filtered.map(aluno => (
              <button
                key={aluno.numero}
                type="button"
                className="w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 flex justify-between items-center"
                onClick={() => {
                  onChange(aluno.numero.toString())
                  setSearchTerm(`${aluno.nomeGuerra} (${aluno.numero})`)
                  setIsOpen(false)
                }}
              >
                <span className="font-semibold text-slate-900">{aluno.nomeGuerra}</span>
                <span className="text-slate-500 text-xs">{aluno.numero}</span>
              </button>
            ))
          ) : (
            <div className="p-3 text-slate-500 text-center text-sm italic">Nenhum aluno encontrado</div>
          )}
        </div>
      )}
    </div>
  )
}
