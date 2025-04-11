// Screens/BoxDetailScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useBoxes } from '../contexts/BoxesContext';
import AddMedicineModal from '../components/AddMedicineModal';
import EditMedicineModal from '../components/EditMedicineModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";

const IP = Constants.expoConfig.extra.IP;

const BoxDetailScreen = () => {
  const { state, addMedicine, deleteMedicine, updateMedicine } = useBoxes();
  const selectedBox = state.boxes?.find(box => box._id === state.selectedBox);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [takenStatus, setTakenStatus] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      await checkAndResetTakenStatus();
      await loadTakenStatus();
    };
    initialize();
  }, []);

  const checkAndResetTakenStatus = async () => {
    try {
      const lastResetDate = await AsyncStorage.getItem('lastResetDate');
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      if (lastResetDate !== today) {
        // Reset takenStatus and update last reset date
        setTakenStatus({});
        await AsyncStorage.setItem('medicineTakenStatus', JSON.stringify({}));
        await AsyncStorage.setItem('lastResetDate', today);
        console.log('Taken status reset for new day:', today);
      }
    } catch (error) {
      console.error('Error checking/resetting taken status:', error);
    }
  };

  const loadTakenStatus = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem('medicineTakenStatus');
      if (storedStatus) {
        setTakenStatus(JSON.parse(storedStatus));
      }
    } catch (error) {
      console.error('Error loading taken status:', error);
    }
  };

  const saveTakenStatus = async (newStatus) => {
    try {
      await AsyncStorage.setItem('medicineTakenStatus', JSON.stringify(newStatus));
    } catch (error) {
      console.error('Error saving taken status:', error);
    }
  };

  const toggleTakenStatus = async (medicineId) => {
    const newStatus = {
      ...takenStatus,
      [medicineId]: !takenStatus[medicineId]
    };
    setTakenStatus(newStatus);
    saveTakenStatus(newStatus);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      if (!state.selectedBox) throw new Error('No box selected');

      const url = `http://${IP}:5000/api/boxes/${state.selectedBox}/medicines/${medicineId}/toggle`;
      console.log('Request URL:', url);
      console.log('Token:', token);
      console.log('Payload:', { action: newStatus[medicineId] ? 'taken' : 'untaken' });

      const response = await axios.post(
        url,
        { action: newStatus[medicineId] ? 'taken' : 'untaken' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Toggle response:', response.data);
    } catch (error) {
      console.error('Error toggling medicine status:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Failed to update medicine status: ${error.message}`);
    }
  };

  const handleAddMedicine = async (medicineData) => {
    try {
      await addMedicine(state.selectedBox, medicineData);
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  const handleEditMedicine = async (medicineData) => {
    try {
      await updateMedicine(state.selectedBox, selectedMedicine._id, medicineData);
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    try {
      await deleteMedicine(state.selectedBox, medicineId);
    } catch (error) {
      console.error('Error deleting medicine:', error);
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
      <AddMedicineModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddMedicine}
      />
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
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.historyButtonText}>View History</Text>
          </Pressable>
        </View>
        <Image source={require("../assets/images/Medicine-box.png")} style={styles.medicineBoxImage} />
      </View>
      <Pressable style={styles.addNewMedicineContainer} onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: "white" }}>Add new Medicine</Text>
        <Image source={require("../assets/icons/plus.png")} style={{ width: 35, height: 35 }} />
      </Pressable>
      {selectedBox?.medicines?.length === 0 ? (
        <Text>No medicines in this box.</Text>
      ) : (
        selectedBox?.medicines?.map((medicine, index) => (
          <View key={index} style={styles.singleMedicineWrapper}>
            <View style={styles.editORDelContainer}>
              <Pressable onPress={() => {
                setSelectedMedicine(medicine);
                setEditModalVisible(true);
              }}>
                <Image source={require("../assets/icons/edit.png")} style={{ width: 46, height: 46 }} />
              </Pressable>
              <EditMedicineModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSubmit={handleEditMedicine}
                medicine={selectedMedicine}
              />
              <Pressable onPress={() => handleDeleteMedicine(medicine._id)}>
                <Image source={require("../assets/icons/delete.png")} style={{ width: 46, height: 46 }} />
              </Pressable>
            </View>
            <View style={styles.medicineContainer}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text>Dosage: {medicine.dosage}</Text>
              <Text>Time: {medicine.time}</Text>
              <Pressable
                style={[
                  styles.statusButton,
                  takenStatus[medicine._id] && styles.takenButton
                ]}
                onPress={() => toggleTakenStatus(medicine._id)}
              >
                <View style={[
                  styles.radioCircle,
                  takenStatus[medicine._id] && styles.radioCircleFilled
                ]} />
                <Text style={[
                  styles.statusText,
                  takenStatus[medicine._id] && styles.takenText
                ]}>
                  {takenStatus[medicine._id] ? 'Taken' : 'Take'}
                </Text>
              </Pressable>
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
    padding: 4,
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
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
  addNewMedicineContainer: {
    backgroundColor: "#5D65B0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginBottom: 12,
    borderRadius: 10,
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
  seeMore: {
    width: 190,
    backgroundColor: '#4E58C7',
    color: '#FFFFFF',
    borderRadius: 5,
    textAlign: 'center',
    padding: 5,
    fontSize: 14,
    marginBottom: 5,
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
  editORDelContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
  }
});

export default BoxDetailScreen;