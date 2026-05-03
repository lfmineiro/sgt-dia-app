import { TabsHeader } from '@/src/components/layout/TabsHeader';
import { TopBar } from '@/src/components/layout/TopBar';
import ModalNovaAlteracao from '@/src/components/pages/Alteracoes/ModalNovaAlteracao/ModalNovaAlteracao';
import { ToggleQuartos } from '@/src/components/pages/Alteracoes/ToggleQuartos';
import { ABAS_ALTERACOES } from '@/src/constants/locais';
import { useAlteracoes } from '@/src/hooks/useAlteracoes';
import { useModalAlteracao } from '@/src/hooks/useModalAlteracao';
import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [abaAtiva, setAbaAtiva] = useState(ABAS_ALTERACOES[0])
  
  const { alteracoes, handleResolverAlteracao } = useAlteracoes()
  const { isModalOpen, comodoNome, abrirModal, fecharModal } = useModalAlteracao()


  return (
    <View style={styles.container}>
      <TopBar userNameInitials='LF'/>
      <TabsHeader 
      abaAtiva={abaAtiva}
      onMudarAba={setAbaAtiva}
      />
      <ScrollView style={styles.listaQuartos}>
        <ToggleQuartos 
        abaAtiva={abaAtiva}
        alteracoes={alteracoes}
        handleResolverAlteracao={handleResolverAlteracao}
        onAbrirModal={abrirModal}
        />
        <ModalNovaAlteracao 
          visible={isModalOpen}
          onClose={fecharModal}
          comodoNome={comodoNome}
          onSave={async (desc, img) => {
            console.log("Vai chamar a criação da alteracao")
            fecharModal()
  }}
          />
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  listaQuartos: {
    marginTop: 10,
    width: '90%'
  },

});