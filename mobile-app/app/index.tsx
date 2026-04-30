import { View, StyleSheet } from 'react-native';
import { TopBar } from './components/layout/TopBar';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TopBar userNameInitials='LF'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

});