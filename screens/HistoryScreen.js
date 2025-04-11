// Screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useBoxes } from '../contexts/BoxesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from "expo-constants";

const IP = Constants.expoConfig.extra.IP;
const HistoryScreen = () => {
  const { state } = useBoxes();
  const selectedBox = state.boxes?.find(box => box._id === state.selectedBox);
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    if (selectedBox) {
      fetchHistory();
    }
  }, [selectedBox, period]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `http://${IP}:5000/api/boxes/${state.selectedBox}/history?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`
          }
        }
      );
      setHistory(response.data);
      console.log('History response:', response.data); // Debugging line
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.medicineName}>{item.name}</Text>
      <Text>Dosage: {item.dosage}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Action: {item.action}</Text>
      <Text>Taken At: {new Date(item.takenAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedBox ? (
        <>
          <Text style={styles.title}>{selectedBox.name} History</Text>
          <View style={styles.filterContainer}>
            <Pressable
              style={[styles.filterButton, period === 'week' && styles.activeFilter]}
              onPress={() => setPeriod('week')}
            >
              <Text style={styles.filterText}>Week</Text>
            </Pressable>
            <Pressable
              style={[styles.filterButton, period === 'month' && styles.activeFilter]}
              onPress={() => setPeriod('month')}
            >
              <Text style={styles.filterText}>Month</Text>
            </Pressable>
          </View>
          {history.length === 0 ? (
            <Text>No history available for this period.</Text>
          ) : (
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </>
      ) : (
        <Text>No box selected.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeFilter: {
    backgroundColor: '#4E58C7',
  },
  filterText: {
    color: '#fff',
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
});

export default HistoryScreen;