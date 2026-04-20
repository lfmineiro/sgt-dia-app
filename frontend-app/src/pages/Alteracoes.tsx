import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";

const mockQuartos = [
  { id: '5001', nome: 'Quarto 5001', status: 'Verificado', alteracao: { descricao: '1 porta faltando', resolvida: false }, },
  { id: '5002', nome: 'Quarto 5002', status: 'Pendente', alteracao: null },
  { id: '5003', nome: 'Quarto 5003', status: 'Verificado', alteracao: null },
  { id: '5004', nome: 'Quarto 5004', status: 'Pendente', alteracao: null },
  { id: '5005', nome: 'Quarto 5005', status: 'Verificado', alteracao: null },
];

const abas = ['Ala 5º Piso', '4º Piso', '3º Piso', 'SegFem'];

export const AlteracoesPage = () => {
  const [abaAtiva, setAbaAtiva] = useState(abas[0]);
  const [quartosExpandidos, setQuartosExpandidos] = useState<string[]>(['5001']); 

  const toggleQuarto = (id: string) => {
    setQuartosExpandidos(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space y-10">
      {/* NavBar */}
      <Tabs 
      options={abas}
      activeTab={abaAtiva}
      onChange={setAbaAtiva}/>

      {/* Lista de Quartos -> Vou transformar em Component */}
      {/* Além disso, tenho que associar a lista de quartos com a primeira aba pode ser com uma condicional talvez */}
      <div className="space-y-4">
        {mockQuartos.map((quarto) => {
          const isExpandido = quartosExpandidos.includes(quarto.id);

          return (
            <div key={quarto.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              
                 {/* Linha Visível (Header do Accordion) */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleQuarto(quarto.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">
                    {isExpandido ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </span>
                  <span className="font-semibold text-slate-800">{quarto.nome}</span>
                  
                  {/* da pra transformar em component em /alteracao */}
                  {/* lógica vai ser quando se criar um serviço por padrão as alterações não terão sidos verificadas e ao verificar todas as alterações de um quarto ou qlqr recinto o status muda */}
                  {/* Salvar em algum cantos os diferentes recintos de cada alojamento */}
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                    quarto.status === 'Verificado' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {quarto.status}
                  </span>
                </div>

                {/* Botão de Adicionar Alteração */}
                <button 
                  // O e.stopPropagation evita que o clique no botão abra/feche o toggle
                  onClick={(e) => { e.stopPropagation() }}
                  className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-500 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Plus size={16} /> Adicionar Alteração
                </button>
              </div>

              {/* Ao abrir o toggle (Detalhes da Alteração) */}
              {isExpandido && quarto.alteracao && (
                <div className="p-5 border-t border-slate-100 flex gap-6 bg-slate-50/50">
                  
                  {/* Placeholder da Imagem (Puxaremos do Cloudinary depois) */}
                  <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium shrink-0">
                    80 × 80
                  </div>

                  {/* Dados da Alteração */}
                  <div className="flex flex-col gap-3">
                    <p className="text-slate-700 font-medium">{quarto.alteracao.descricao}</p>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-slate-600">Alteração Verificada</span>
                    </label>

                    <div>
                      <button className="mt-2 px-4 py-1.5 border-2 border-emerald-500 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors">
                        Alteração Resolvida
                      </button>
                    </div>
                  </div>
                  
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}