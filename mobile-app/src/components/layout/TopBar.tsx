import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

interface TopBarProps {
  userNameInitials: string;
}

export const TopBar = ({ userNameInitials }: TopBarProps) => {
  // Isso pega os espaços seguros do celular (topo, base, lados)
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={[
        styles.container, 
        { paddingTop: Platform.OS === 'android' ? insets.top + 16 : insets.top }
      ]}
    >
      <View style={styles.secaoEsquerda}>
        <View style={styles.imagemIcon}>
          <MaterialCommunityIcons name="shield-check" size={24} color="#3B82F6" />
        </View>
        
        <View style={styles.tituloApp}>
          <Text style={styles.titulo}>Sargento</Text>
          <Text style={styles.subTitulo}>de Dia IME</Text>
        </View>
      </View>

      <Pressable 
        style={styles.avatar}
        onPress={() => console.log('Abrir menu de perfil')}
      >
        <Text style={styles.avatarText}>{userNameInitials}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B', 
    flexDirection: 'row',       
    justifyContent: 'space-between', 
    alignItems: 'center',       
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1, // linha divisoria       
    borderBottomColor: '#334155',
    width: '100%',
  },
  secaoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagemIcon: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  tituloApp: {
    justifyContent: 'center',
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitulo: {
    color: '#94A3B8', 
    fontSize: 12,
  },
  avatar: {
    backgroundColor: '#3B82F6', 
    width: 40,
    height: 40,
    borderRadius: 20,           
    justifyContent: 'center', 
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});