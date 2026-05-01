import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface RoomCardProps {
  nomeComodo: string;
  status: 'Verificado' | 'Pendente';
  onPress?: () => void; 
}

export const ComodoCard = ({ nomeComodo, onPress, status }: RoomCardProps) => {
  
    const isVerificado = status === 'Verificado'     
    const badgeBackgroundColor = isVerificado ? '#D1FAE5' : '#FFEDD5'
    const badgeTextColor = isVerificado ? '#059669' : '#C2410C'
  return (
    <Pressable 
      style={styles.cardContainer} 
      onPress={onPress}
    >
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
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,   
    borderRadius: 12, // Bordas arredondadas do seu design
    borderWidth: 1,
    borderColor: '#E2E8F0', // Borda cinza bem clara
    
    // Sombra leve para destacar do fundo cinza
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Sombra no Android
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
});
  
