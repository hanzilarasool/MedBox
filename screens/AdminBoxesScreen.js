// Screens/AdminBoxesScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useBoxes } from '../contexts/BoxesContext';
import { useNavigation, useRoute } from '@react-navigation/native';

const AdminBoxesScreen = () => {
  const { state, fetchBoxes, selectBox } = useBoxes();
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId } = route.params || {};

  useEffect(() => {
    if (patientId) {
      fetchBoxes(patientId);
    }
  }, [patientId]);

  const handleBoxPress = (boxId) => {
    selectBox(boxId);
    navigation.navigate('AdminBoxDetail', { patientId });
  };

  const renderBox = ({ item }) => (
    <Pressable style={styles.boxItem} onPress={() => handleBoxPress(item._id)}>
      <Text style={styles.boxName}>{item.name}</Text>
      <Text style={styles.boxDescription}>{item.description}</Text>
      <Text style={styles.boxTime}>{item.timeSlot}</Text>
    </Pressable>
  );

  if (state.loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!patientId) {
    return (
      <View style={styles.container}>
        <Text>No patient selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Medicine Boxes</Text>
      <FlatList
        data={state.boxes}
        renderItem={renderBox}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No boxes found for this patient.</Text>}
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
  },
  boxItem: {
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
  boxName: {
    fontSize: 16,
    fontWeight: '500',
  },
  boxDescription: {
    fontSize: 14,
    color: '#666',
  },
  boxTime: {
    fontSize: 14,
    color: '#4E58C7',
  },
});

export default AdminBoxesScreen;