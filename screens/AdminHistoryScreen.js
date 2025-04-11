// Screens/AdminHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRoute } from '@react-navigation/native';
import { useBoxes } from '../contexts/BoxesContext';

const IP = Constants.expoConfig.extra.IP;

const AdminHistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('day'); // Default to daily history
  const route = useRoute();
  const { patientId } = route.params || {};
  const { state } = useBoxes();
  const selectedBoxId = state.selectedBox;

  useEffect(() => {
    if (patientId && selectedBoxId) {
      fetchHistory();
    }
  }, [patientId, selectedBoxId, period]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      if (!patientId) throw new Error('No patient ID provided');
      if (!selectedBoxId) throw new Error('No box selected');

      const response = await axios.get(
        `http://${IP}:5000/api/boxes/${selectedBoxId}/history?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-User-Id': patientId, // Include patientId to fetch history for the patient
          },
        }
      );
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.medicineName}>{item.name}</Text>
      <Text style={styles.detailText}>Dosage: {item.dosage}</Text>
      <Text style={styles.detailText}>Time: {item.time}</Text>
      <Text style={styles.detailText}>Action: {item.action}</Text>
      <Text style={styles.detailText}>Taken At: {new Date(item.takenAt).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!patientId || !selectedBoxId) {
    return (
      <View style={styles.container}>
        <Text>No patient or box selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Medicine History</Text>
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, period === 'day' && styles.activeFilterButton]}
          onPress={() => handlePeriodChange('day')}
        >
          <Text style={[styles.filterText, period === 'day' && styles.activeFilterText]}>Day</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, period === 'week' && styles.activeFilterButton]}
          onPress={() => handlePeriodChange('week')}
        >
          <Text style={[styles.filterText, period === 'week' && styles.activeFilterText]}>Week</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, period === 'month' && styles.activeFilterButton]}
          onPress={() => handlePeriodChange('month')}
        >
          <Text style={[styles.filterText, period === 'month' && styles.activeFilterText]}>Month</Text>
        </Pressable>
      </View>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>No history found for this period.</Text>}
      />
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
    textAlign: 'center',
    color: '#4E58C7',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activeFilterButton: {
    backgroundColor: '#4E58C7',
  },
  filterText: {
    fontSize: 16,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 5,
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
    color: '#4E58C7',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});

export default AdminHistoryScreen;