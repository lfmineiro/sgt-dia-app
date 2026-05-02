import { TabsHeader } from '@/src/components/layout/TabsHeader';
import { TopBar } from '@/src/components/layout/TopBar';
import { ToggleQuartos } from '@/src/components/pages/Alteracoes/toggleQuartos';
import { ABAS_ALTERACOES } from '@/src/constants/locais';
import { useAlteracoes } from '@/src/hooks/useAlteracoes';
import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [abaAtiva, setAbaAtiva] = useState(ABAS_ALTERACOES[0])
  
  const { alteracoes } = useAlteracoes()

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