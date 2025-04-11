// Screens/AdminBoxDetailScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useBoxes } from '../contexts/BoxesContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from "expo-constants";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP = Constants.expoConfig.extra.IP;

const AdminBoxDetailScreen = () => {
  const { state } = useBoxes();
  const selectedBox = state.boxes?.find(box => box._id === state.selectedBox);
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId } = route.params || {};
  const [takenStatus, setTakenStatus] = useState({});

  useEffect(() => {
    if (selectedBox && patientId) {
      fetchTakenStatus();
    }
  }, [selectedBox, patientId]);

  const fetchTakenStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      if (!state.selectedBox) throw new Error('No box selected');
      if (!patientId) throw new Error('No patient ID provided');

      const response = await axios.get(
        `http://${IP}:5000/api/boxes/${state.selectedBox}/history?period=day`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-User-Id': patientId,
          },
        }
      );

      const history = response.data;
      const newTakenStatus = {};
      selectedBox.medicines.forEach(medicine => {
        const takenEntry = history.find(
          entry => entry.medicineId === medicine._id && entry.action === 'taken'
        );
        newTakenStatus[medicine._id] = !!takenEntry;
      });
      setTakenStatus(newTakenStatus);
    } catch (error) {
      console.error('Error fetching taken status:', error.message);
    }
  };

  if (!selectedBox) {
    return (
      <View style={styles.container}>
        <Text>No box selected or box not found.</Text>
      </View>
    );
  }

  if (state.loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <View>
          <Text style={styles.boxTitle}>{selectedBox.name}</Text>
          <View style={styles.timerContainer}>
            <Image source={require("../assets/icons/clock.png")} style={styles.clockIcon} />
            <View>
              <Text style={styles.boxDescription}>{selectedBox.description}</Text>
              <Text style={styles.boxTime}>{selectedBox.timeSlot}</Text>
            </View>
          </View>
          <Pressable
            style={styles.historyButton}
            onPress={() => navigation.navigate('AdminHistory', { patientId })} // Navigate to AdminHistory
          >
            <Text style={styles.historyButtonText}>View History</Text>
          </Pressable>
        </View>
        <Image source={require("../assets/images/Medicine-box.png")} style={styles.medicineBoxImage} />
      </View>
      {selectedBox?.medicines?.length === 0 ? (
        <Text>No medicines in this box.</Text>
      ) : (
        selectedBox?.medicines?.map((medicine, index) => (
          <View key={index} style={styles.singleMedicineWrapper}>
            <View style={styles.medicineContainer}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text>Dosage: {medicine.dosage}</Text>
              <Text>Time: {medicine.time}</Text>
              <View style={[
                styles.statusButton,
                takenStatus[medicine._id] && styles.takenButton
              ]}>
                <View style={[
                  styles.radioCircle,
                  takenStatus[medicine._id] && styles.radioCircleFilled
                ]} />
                <Text style={[
                  styles.statusText,
                  takenStatus[medicine._id] && styles.takenText
                ]}>
                  {takenStatus[medicine._id] ? 'Taken' : 'Not Taken'}
                </Text>
              </View>
            </View>
          </View>
        ))
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
  historyButton: {
    backgroundColor: '#4E58C7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  medicineContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: 250,
    height: 110,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 130,
  },
  takenButton: {
    backgroundColor: '#E6F0FA',
    borderRadius: 4,
  },
  radioCircle: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4E58C7',
    marginRight: 6,
  },
  radioCircleFilled: {
    backgroundColor: '#4E58C7',
    borderColor: '#4E58C7',
  },
  statusText: {
    color: '#4E58C7',
    fontSize: 18,
    fontWeight: "500"
  },
  takenText: {
    fontWeight: '600',
  },
  boxContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medicineBoxImage: {
    width: 100,
    height: 100,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#4E58C7"
  },
  boxDescription: {
    fontSize: 16,
    color: '#657C7E',
    marginBottom: 4,
  },
  boxTime: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  timerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  clockIcon: {
    width: 21,
    height: 21,
    marginRight: 10,
    borderRadius: 20,
  },
  singleMedicineWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    gap: 10,
  },
});

export default AdminBoxDetailScreen;