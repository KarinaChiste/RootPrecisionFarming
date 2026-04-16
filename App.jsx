import { View, StyleSheet } from 'react-native';
import SensorDashboard from './components/SensorDashboard';

export default function App() {
  return (
    <View style={styles.container}>
      <SensorDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                 // MUST be flex: 1 to fill screen
    backgroundColor: '#f5f5f5'
  },
});