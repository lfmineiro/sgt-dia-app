import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alteracao } from "@/src/types/alteracao.types";

interface AlteracaoItemProps {
  alteracao: Alteracao;
  onResolver: (id: string) => void;
}

export function AlteracaoItem({ alteracao, onResolver }: AlteracaoItemProps) {
  const [verificado, setVerificado] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable 
          onPress={() => setVerificado(!verificado)} 
          style={styles.checkboxContainer}
          hitSlop={10} 
        >
          <MaterialCommunityIcons 
            name={verificado ? "checkbox-marked" : "checkbox-blank-outline"} 
            size={24} 
            color={verificado ? "#059669" : "#94A3B8"} 
          />
        </Pressable>
        
        <Text style={[
          styles.descricao, 
          verificado && styles.descricaoRiscada 
        ]}>
          {alteracao.descricao}
        </Text>
      </View>

      {alteracao.fotoUrl && (
        <Image 
          source={{ uri: alteracao.fotoUrl }} 
          style={styles.foto}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity 
        style={styles.btnResolver}
        onPress={() => onResolver(alteracao.id)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#FFFFFF" />
        <Text style={styles.btnText}>Marcar como Resolvida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: -2, 
  },
  descricao: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    lineHeight: 20,
  },
  descricaoRiscada: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  foto: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#E2E8F0', 
  },
  btnResolver: {
    backgroundColor: '#025309',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  }
});