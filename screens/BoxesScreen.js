import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Modal 
} from 'react-native';
import ChatAssistantModal from '../components/ChatAssistantModal';
import { BoxesContext } from '../contexts/BoxesContext';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BoxesScreen = () => {
  const { state, fetchBoxes, selectBox } = useContext(BoxesContext);
  const navigation = useNavigation();
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      await fetchBoxes();
      await loadUserData();
      await configureAndScheduleNotifications();
    };
    initialize();
  }, []); // Runs only once on mount

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    }
  };

  const configureAndScheduleNotifications = async () => {
    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Check and request permissions
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }
      console.log('Notification permissions granted');
    } else {
      console.log('Must use physical device for notifications');
      return;
    }

    // Check if notifications have already been scheduled
    const hasScheduled = await AsyncStorage.getItem('notificationsScheduled');
    if (hasScheduled === 'true') {
      console.log('Notifications already scheduled, skipping...');
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Currently scheduled notifications:', scheduled);
      return;
    }

    // Schedule notifications and mark as scheduled
    await scheduleMedicineReminders();
    await AsyncStorage.setItem('notificationsScheduled', 'true');
    console.log('Notifications scheduled and marked in AsyncStorage');
  };

  const scheduleMedicineReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all existing notifications');

    const boxes = state.boxes || [];
    if (!boxes.length) {
      console.log('No boxes available to schedule notifications');
      return;
    }

    console.log('Scheduling notifications for boxes:', boxes);

    const notificationPromises = boxes.map(async (box) => {
      let trigger;
      let reminderTitle;
      let reminderBody;

      switch (box.name.toLowerCase()) {
        case 'medbox-1':
          trigger = { hour: 8, minute: 0, repeats: true }; // 8:00 AM
          reminderTitle = 'Morning Medicine Reminder';
          reminderBody = 'Time to take your MedBox-1 medicines';
          break;
        case 'medbox-2':
          trigger = { hour: 12, minute: 0, repeats: true }; // 12:00 PM
          reminderTitle = 'Midday Medicine Reminder';
          reminderBody = 'Time to take your MedBox-2 medicines';
          break;
        case 'medbox-3':
          trigger = { hour: 20, minute: 0, repeats: true }; // 8:00 PM
          reminderTitle = 'Night Medicine Reminder';
          reminderBody = 'Time to take your MedBox-3 medicines';
          break;
        default:
          return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminderTitle,
          body: reminderBody,
          data: { boxId: box._id },
        },
        trigger,
      });

      console.log(`Scheduled ${box.name} notification with ID: ${notificationId} at ${trigger.hour}:${trigger.minute}`);
      return notificationId;
    });

    await Promise.all(notificationPromises.filter(Boolean));
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all stored data, including notificationsScheduled flag
      await Notifications.cancelAllScheduledNotificationsAsync(); // Clear notifications on logout
      console.log('Logged out and cleared notifications');
      navigation.replace("Login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.profileContainer}>
          <View>
            <Text style={styles.profileTitle}>Welcome, {user.name}!</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

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

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowChat(true)}
      >
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
  profileContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingTop: 55,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 10,
    marginLeft: 10,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E58C7',
  },
  profileEmail: {
    fontSize: 13,
    color: '#657C7E',
    marginVertical: 4,
  },
  logoutButton: {
    backgroundColor: '#4E58C7',
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    color: "#4E58C7",
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
    zIndex: 100,
  },
  aiIcon: {
    width: 32,
    height: 29,
  },
});

export default BoxesScreen;