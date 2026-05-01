import { ABAS_ALTERACOES } from '@/src/constants/locais';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

type TabHeaderProps = {
  abaAtiva: string
  onMudarAba: (aba: string) => void
}

export const TabsHeader = ({ abaAtiva, onMudarAba }: TabHeaderProps) => {


  const tabs = ABAS_ALTERACOES;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = abaAtiva === tab;
          
          return (
            <Pressable
              key={tab}
              onPress={() => onMudarAba(tab)}
              style={[
                styles.tabItem,
                isActive && styles.activeTabItem 
              ]}
            >
              <Text 
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText 
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B', 
    width: '100%',
    alignItems: 'center'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 0, 
  },
  tabItem: {
    paddingVertical: 16,
    marginRight: 24, 
    borderBottomWidth: 2,
    borderBottomColor: 'transparent', 
  },
  activeTabItem: {
    borderBottomColor: '#3B82F6', // Estilo da aba ativa 
  },
  tabText: {
    color: '#94A3B8', // Cinza para os inativos
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#3B82F6', // Azul para o ativo
  },
});