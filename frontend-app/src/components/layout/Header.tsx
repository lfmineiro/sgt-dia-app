import { buscarSargentoDeDia } from "../../services/alunos.service";
import { useQuery } from '@tanstack/react-query';
import { Button } from "../ui/Button";
import { PlusCircle } from "lucide-react";

export const Header = () => {
//  vamos puxar da API usando o react Query 
  const { data: sgtDia, isLoading } = useQuery({
    queryKey: ['sgtAtual'],
    queryFn: buscarSargentoDeDia
  })

  // const nomeSgtDia = "Al 4º Ano Fulano";
  const anoAtual = new Date().getFullYear() % 100;

  // calcular a turma do elemento 
  const CalcularTurma = (): number => {
    return sgtDia ? (5 - sgtDia.anoFormatura + anoAtual)  : 0
  }

  const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(new Date());

  // ano atual -> 26 anoFormatura - > 27 - > turma 4º ano 

  return (
    <header className="bg-white border-b border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="w-full">
          {isLoading ? 
          <h1 className="text-3xl font-extrabold text-slate-950">
              <span>Carregando...</span>
            </h1> : 
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-slate-950">Sgt Dia: <span className="text-blue-700">Alu {CalcularTurma()}º Ano {sgtDia?.nomeGuerra}</span></h1>
                <Button variant="outline" size="md" leftIcon={<PlusCircle className="h-5 w-5" />}>Criar novo Serviço</Button>
              </div>
              }
          <p className="mt-1 text-xl text-slate-600">
            {dataFormatada}
          </p>
        </div>
        
        {/* Espaço opcional para notificações ou busca, se quiser adicionar depois */}
      </div>
    </header>
  );
};