import { buscarSargentoDeDia } from "../../services/alunos.service";
import { useQuery } from '@tanstack/react-query';

export const Header = () => {
//  vamos puxar da API usando o react Query 
  const { data: sgtDia, isLoading } = useQuery({
    queryKey: ['sgtAtual'],
    queryFn: buscarSargentoDeDia
  })

  // const nomeSgtDia = "Al 4º Ano Fulano";
  const dataHoje = new Date().getFullYear();

  // calcular a turma do elemento 
  // const CalcularTurma = () => {
  //   const dataHoje = new Date()
  //   console.log(dataHoje)
  //   return dataHoje
  // }

  return (
    <header className="bg-white border-b border-slate-100 p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950">
            {isLoading ? 
              <span>Carregando...</span> : 
              <>
                Sgt Dia: <span className="text-blue-700">Al {sgtDia?.numero} - {sgtDia?.nomeGuerra}</span>
              </>
              }
          </h1>
          <p className="mt-1 text-xl text-slate-600">
            {dataHoje}
          </      p>
        </div>
        
        {/* Espaço opcional para notificações ou busca, se quiser adicionar depois */}
      </div>
    </header>
  );
};