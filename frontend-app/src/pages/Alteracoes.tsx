import { Tabs } from "../components/ui/Tabs";
import {
  ABAS_ALTERACOES,
  getSetorByAba,
} from "../constants/locais";
import { ToggleQuarto } from "../components/pages/Alteracoes/toggleQuarto";
import { useAlteracoesPage } from "../hooks/useAlteracoesPage";

const abas = ABAS_ALTERACOES;

export const AlteracoesPage = () => {
  const {
    setorAtivo, setSetorAtivo,
    listaAlteracoes, abaAtiva, comodosSetorAtivo, alteracoesSetorAtivo,
    alteracoesPendentesSetorAtivo, isLoading, isError
  } = useAlteracoesPage()

  return (
    <div className="space y-10">
      {/* NavBar */}
      <Tabs 
      options={abas}
      activeTab={abaAtiva}
      onChange={(novaAba) => setSetorAtivo(getSetorByAba(novaAba))}/>

      <div className="space-y-4">
        {isLoading && <p>Carregando alterações...</p>}

        {isError && <p>Erro ao carregar alterações.</p>}

        {!isLoading && !isError && listaAlteracoes.length === 0 && (
          <p>Nenhuma alteração encontrada.</p>
        )}

        {!isLoading && !isError && (
          <>
            <p>Total de alterações no setor: {alteracoesPendentesSetorAtivo.length}</p>

            <ToggleQuarto
              comodos={comodosSetorAtivo}
              alteracoes={alteracoesSetorAtivo}
              setor={setorAtivo}
            />
          </>
        )}
      </div>
        
    </div>
  );
}