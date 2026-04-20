import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchAlteracoes } from "../services/alteracao.service";


const abas = ['Ala 5º Piso', '4º Piso', '3º Piso', 'SegFem'];

export const AlteracoesPage = () => {
  const [abaAtiva, setAbaAtiva] = useState(abas[0]);
  
  const { data: alteracoes, isLoading, isError } = useQuery({
    queryKey: ['alteracoesAtuais'],
    queryFn: fetchAlteracoes
  })

  const listaAlteracoes = alteracoes ?? [];

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
        {isLoading && <p>Carregando alterações...</p>}

        {isError && <p>Erro ao carregar alterações.</p>}

        {!isLoading && !isError && listaAlteracoes.length === 0 && (
          <p>Nenhuma alteração encontrada.</p>
        )}

        {!isLoading && !isError && listaAlteracoes.length > 0 && (
          <>
            <p>Total de alterações: {listaAlteracoes.length}</p>

            {listaAlteracoes.map((a) => (
              <div key={a.id} className="rounded border p-3">
                <p><strong>Local:</strong> {a.local}</p>
                <p><strong>Descrição:</strong> {a.descricao}</p>
                {a.fotoUrl && <p><strong>Foto:</strong> {a.fotoUrl}</p>}
              </div>
            ))}
          </>
        )}
      </div>
        
    </div>
  );
}