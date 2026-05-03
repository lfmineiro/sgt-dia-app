import { useState } from 'react'
import { Tabs } from '../components/ui/Tabs'
import { AlteracoesConfiguracoes } from '../components/pages/Configuracoes/AlteracoesConfiguracoes'
import { ServicosConfiguracoes } from '../components/pages/Configuracoes/ServicosConfiguracoes'

export const ConfiguracoesPage = () => {
  const [abaAtiva, setAbaAtiva] = useState('alteracoes')

  const abas = ['Alterações', 'Serviços']

  const handleAbaChange = (novaAba: string) => {
    if (novaAba === 'Alterações') {
      setAbaAtiva('alteracoes')
    } else if (novaAba === 'Serviços') {
      setAbaAtiva('servicos')
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-600">Gerencie alterações e serviços</p>
      </div>

      {/* NavBar */}
      <Tabs 
        options={abas}
        activeTab={abaAtiva === 'alteracoes' ? 'Alterações' : 'Serviços'}
        onChange={handleAbaChange}
      />

      {/* Conteúdo */}
      <div className="space-y-4">
        {abaAtiva === 'alteracoes' && <AlteracoesConfiguracoes />}
        {abaAtiva === 'servicos' && <ServicosConfiguracoes />}
      </div>
    </div>
  )
}
