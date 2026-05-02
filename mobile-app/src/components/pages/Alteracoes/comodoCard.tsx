import type { Alteracao } from "@/src/types/alteracao.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AlteracaoItem } from "./AlteracaoItem";

interface RoomCardProps {
  nomeComodo: string;
  status: 'Verificado' | 'Pendente'; 
  alteracoes: Alteracao[] | null
  onResolverAlteracao: (id: string) => void
}

export const ComodoCard = ({ nomeComodo, status, alteracoes, onResolverAlteracao }: RoomCardProps) => {

  const [isExpandido, setIsExpandido] = useState(false)

  const isVerificado = status === 'Verificado'     
  const badgeBackgroundColor = isVerificado ? '#D1FAE5' : '#FFEDD5'
  const badgeTextColor = isVerificado ? '#059669' : '#C2410C'
  return (
    
    <View 
      style={styles.cardContainer} 
    >
      <Pressable style={styles.cardHeader} onPress={() => setIsExpandido(!isExpandido)}>
        <View style={styles.leftContent}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#94A3B8"
            style={styles.chevronIcon}
          />
        
          <Text style={styles.comodoText}>{nomeComodo}</Text>
        
          <View style={[styles.badge, { backgroundColor: badgeBackgroundColor }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {status}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color="#94A3B8"
        />
      </Pressable>
      {isExpandido && (
        <View style={styles.areaExpandida}>
          {alteracoes?.length === 0 ? (
            <Text style={styles.listaVazia}>Nenhuma alteração registrada para este cômodo.</Text>
          ) : (
            alteracoes?.map((alt) => (
              <AlteracaoItem 
                key={alt.id} 
                alteracao={alt} 
                onResolver={onResolverAlteracao} 
              />
            ))
          )}
        </View>
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,   
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: '#E2E8F0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIcon: {
    marginRight: 12,
  },
  comodoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  areaExpandida: {},
  listaVazia: {},
});
  
