import { TabsHeader } from '@/src/components/layout/TabsHeader';
import { TopBar } from '@/src/components/layout/TopBar';
import { View, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TopBar userNameInitials='LF'/>
      <TabsHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

});