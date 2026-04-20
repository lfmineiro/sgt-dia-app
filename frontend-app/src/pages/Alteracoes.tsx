import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchAlteracoes } from "../services/alteracao.service";
import {
  ABAS_ALTERACOES,
  getSetorByAba,
  LABEL_SETOR,
  MAPEAMENTO_QUARTOS,
  ORDEM_SETORES,
  type Setor,
} from "../constants/locais";
import { ToggleQuarto } from "../components/pages/Alteracoes/toggleQuarto";

const abas = ABAS_ALTERACOES;

export const AlteracoesPage = () => {
  const [setorAtivo, setSetorAtivo] = useState<Setor>(ORDEM_SETORES[0]);
  
  const { data: alteracoes, isLoading, isError } = useQuery({
    queryKey: ['alteracoesAtuais'],
    queryFn: fetchAlteracoes
  })

  const listaAlteracoes = alteracoes ?? [];
  const abaAtiva = LABEL_SETOR[setorAtivo];
  const comodosSetorAtivo = MAPEAMENTO_QUARTOS[setorAtivo];
  const alteracoesSetorAtivo = listaAlteracoes.filter(
    (alteracao) => alteracao.local === setorAtivo
  );

  return (
    <div className="space y-10">
      {/* NavBar */}
      <Tabs 
      options={abas}
      activeTab={abaAtiva}
      onChange={(novaAba) => setSetorAtivo(getSetorByAba(novaAba))}/>

      {/* Lista de Quartos -> Vou transformar em Component */}
      {/* Além disso, tenho que associar a lista de quartos com a primeira aba pode ser com uma condicional talvez */}
      <div className="space-y-4">
        {isLoading && <p>Carregando alterações...</p>}

        {isError && <p>Erro ao carregar alterações.</p>}

        {!isLoading && !isError && listaAlteracoes.length === 0 && (
          <p>Nenhuma alteração encontrada.</p>
        )}

        {!isLoading && !isError && (
          <>
            <p>Total de alterações no setor: {alteracoesSetorAtivo.length}</p>

            <ToggleQuarto
              comodos={comodosSetorAtivo}
              alteracoes={alteracoesSetorAtivo}
            />
          </>
        )}
      </div>
        
    </div>
  );
}