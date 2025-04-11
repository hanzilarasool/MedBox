// Screens/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet,TouchableOpacity,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

const IP = Constants.expoConfig.extra.IP;

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      // await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Logged out and cleared notifications');
      navigation.replace("Login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${IP}:5000/api/user/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter((patient) =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const viewPatientBoxes = (patientId) => {
    navigation.navigate('AdminBoxes', { patientId });
  };

  const renderPatient = ({ item }) => (
    <View style={styles.patientItem}>
      <View>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientEmail}>{item.email}</Text>
      </View>
      <Pressable
        style={styles.viewButton}
        onPress={() => viewPatientBoxes(item._id)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Admin Dashboard</Text> */}
    <View style={styles.logoutButtonContainer}>
      {/* <Text style={styles.title}>Search patient</Text> */}
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
    </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search patients..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredPatients}
        renderItem={renderPatient}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No patients found.</Text>}
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
  logoutButtonContainer:{
display:"flex",
flexDirection:"row",
justifyContent:"flex-end",
margin:10
  },
  
  logoutButton: {
    backgroundColor: '#4E58C7',
    padding: 10,
    borderRadius: 5,
    marginTop: 0,
    width:75,
    
    // alignSelf: 'flex-start',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  patientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  patientEmail: {
    fontSize: 14,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#4E58C7',
    padding: 8,
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AdminDashboard;