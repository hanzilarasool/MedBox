// Screens/BoxesScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Modal // Added Modal import
} from 'react-native';
import ChatAssistantModal from '../components/ChatAssistantModal';
import { Ionicons } from '@expo/vector-icons';
import { BoxesContext } from '../contexts/BoxesContext';
import { useNavigation } from '@react-navigation/native';

const BoxesScreen = () => {
  const { state, fetchBoxes, selectBox } = useContext(BoxesContext);
  const navigation = useNavigation();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchBoxes();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.scheduleButtonContainer}>
          <Text style={styles.scheduleButtonText}>Schedule</Text>
          <Image 
            source={require("../assets/icons/bell.png")} 
            style={styles.bellIcon}
          />
        </View>
        
        {state.boxes?.map((box) => (
          <TouchableOpacity
            key={box._id}
            style={styles.boxContainer}
            onPress={() => {
              selectBox(box._id);
              navigation.navigate('BoxDetail');
            }}
          >
            <View style={styles.boxContent}>
              <Text style={styles.boxTitle}>{box.name}</Text>
              <View style={styles.timerContainer}>
                <Image 
                  source={require("../assets/icons/clock.png")} 
                  style={styles.clockIcon} 
                />
                <View>
                  <Text style={styles.boxDescription}>{box.description}</Text>
                  <Text style={styles.boxTime}>{box.timeSlot}</Text>
                </View>
              </View>
              <Text style={styles.seeMore}>See more...</Text>
            </View>
            <Image 
              source={require("../assets/images/Medicine-box.png")} 
              style={styles.medicineBoxImage} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowChat(true)}
      >
        {/* <Ionicons name="medical" size={28} color="white" /> */}
        <Image source={require("../assets/icons/ai.png")} style={styles.aiIcon} />
      </TouchableOpacity>

      <ChatAssistantModal 
        visible={showChat} 
        onClose={() => setShowChat(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  scheduleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4E58C7',
    backgroundColor: 'rgba(30, 29, 29, 0.12)',
  },
  scheduleButtonText: {
    color: '#4E58C7',
    fontSize: 15,
    fontWeight: '700',
  },
  bellIcon: {
    width: 24,
    height: 24,
  },
  boxContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boxContent: {
    flex: 1,
  },
  medicineBoxImage: {
    width: 100,
    height: 100,
    marginLeft: 10,
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
    backgroundColor: '#4E58C7',
    color: '#FFFFFF',
    borderRadius: 5,
    textAlign: 'center',
    padding: 5,
    fontSize: 14,
    marginTop: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    width: 21,
    height: 21,
    marginRight: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#4e58c7',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 100
  },
  aiIcon:{
    width:32,
    height:29,
  }

});

export default BoxesScreen;