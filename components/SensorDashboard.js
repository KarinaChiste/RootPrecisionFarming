import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, TextInput } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getSensorData } from '../services/sensorService';

const SensorDashboard = () => {

  const [threshold, setThreshold] = useState(70);
  const [dataPoints, setDataPoints] = useState([0]);
  const [labels, setLabels] = useState(['0:00']);
  const [latestValue, setLatestValue] = useState(0);
  const [events, setEvents] = useState([]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newValue = Math.random() * 100;
  //     const now = new Date().toLocaleTimeString();

  //     setDataPoints(prev => [...prev.slice(-5), newValue]);
  //     setLabels(prev => [...prev.slice(-5), now]);
  //     setLatestValue(newValue.toFixed(2));

  //     if (newValue < threshold) {
  //       setEvents(prev => [
  //         { id: Date.now().toString(), time: now, value: newValue.toFixed(2) },
  //         ...prev.slice(0, 9)
  //       ]);
  //     }

  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [threshold]);

  useEffect(() => {
  const interval = setInterval(async () => {
    const data = await getSensorData();
    if (!data) return;

    const newValue = data.value;
    const now = new Date(data.timestamp).toLocaleTimeString();

    setDataPoints(prev => [...prev.slice(-5), newValue]);
    setLabels(prev => [...prev.slice(-5), now]);
    setLatestValue(newValue.toFixed(2));

    if (newValue < threshold) {
      setEvents(prev => [
        { id: Date.now().toString(), time: now, value: newValue.toFixed(2) },
        ...prev.slice(0, 9)
      ]);
    }

  }, 3000);

  return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.title}>Sensor Dashboard</Text>

        {/* Threshold Input */}
        <View style={styles.thresholdContainer}>
          <Text style={styles.thresholdLabel}>Warning Level:</Text>
          <TextInput
            style={styles.thresholdInput}
            keyboardType="numeric"
            value={threshold.toString()}
            onChangeText={(text) => setThreshold(Number(text) || 0)}
          />
        </View>

        <View style={styles.latestValueContainer}>
          <Text style={styles.latestValueLabel}>Latest Value:</Text>
          <Text style={[styles.latestValue, { color: latestValue < threshold ? '#F26B1D' : '#2FA84F' }]}>
            {latestValue}
          </Text>
        </View>

        <LineChart
          data={{
            labels: labels.length ? labels : ['0:00'],
            datasets: [
              {
                data: dataPoints.length ? dataPoints : [0],
                color: () => '#2FA84F',
              }
            ]
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#f5f5f5',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#f5f5f5',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#2FA84F',
            },
            propsForVerticalLabels: { fontSize: 8 }
          }}
          bezier
          style={{ marginVertical: 16, borderRadius: 8 }}
          renderDotContent={({ x, y, index }) => {
            const value = dataPoints[index];
            const dotColor = value < threshold ? '#F26B1D' : '#2FA84F';

            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  left: x - 4,
                  top: y - 4,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: dotColor,
                  borderWidth: 2,
                  borderColor: dotColor,
                }}
              />
            );
          }}
        />

        <Text style={styles.subHeader}>Recent Warnings (&lt; {threshold})</Text>

        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventRow}>
              <Text style={styles.eventTime}>{item.time}</Text>
              <Text style={styles.eventValue}>{item.value}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No events yet</Text>}
        />

      </ScrollView>
      <View style={{margin:16}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContainer: { alignItems: 'center', paddingVertical: 16 },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },

  thresholdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },

  thresholdLabel: {
    fontSize: 18,
    marginRight: 8
  },

  thresholdInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    width: 80,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 16
  },

  latestValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },

  latestValueLabel: { fontSize: 18, marginRight: 8 },
  latestValue: { fontSize: 24, fontWeight: 'bold' },

  subHeader: { fontWeight: 'bold', marginTop: 10 },

  eventTime: { fontSize: 14, color: '#333' },
  eventValue: { fontSize: 14, color: '#F26B1D', fontWeight: 'bold' },

  empty: { fontSize: 14, color: '#888', fontStyle: 'italic' },

  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f9f9f9'
  }
});

export default SensorDashboard;