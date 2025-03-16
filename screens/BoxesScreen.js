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
import { Ionicons } from '@expo/vector-icons';
import { BoxesContext } from '../contexts/BoxesContext';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const BoxesScreen = () => {
  const { state, fetchBoxes, selectBox } = useContext(BoxesContext);
  const navigation = useNavigation();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchBoxes();
  }, []);

  // Schedule notifications only after boxes are fetched
  useEffect(() => {
    if (state.boxes && state.boxes.length > 0) {
      configureNotifications();
      scheduleMedicineReminders();
    }
  }, [state.boxes]);

  // Configure notification handler and request permissions
  const configureNotifications = async () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push notification permissions');
        return;
      }
      console.log('Notification permissions granted');
    } else {
      console.log('Must use physical device for notifications');
    }
  };

  // Schedule reminders for each box
  const scheduleMedicineReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled existing notifications');

    const boxes = state.boxes || [];
    console.log('Boxes:', boxes);

    boxes.forEach((box) => {
      let trigger;
      let reminderTitle;
      let reminderBody;

      switch (box.name.toLowerCase()) {
        case 'box1': // Day medicine at 8:00 AM
          trigger = new Date();
          trigger.setHours(8, 0, 0, 0); // 8:00 AM
          reminderTitle = 'Day time medicine reminder';
          reminderBody = 'Take your Box1 medicines';
          if (trigger < new Date()) trigger.setDate(trigger.getDate() + 1); // Next day if time passed
          break;
        case 'box2': // Midday medicine at 12:00 PM
          trigger = new Date();
          trigger.setHours(12, 0, 0, 0); // 12:00 PM
          reminderTitle = 'Midday medicine reminder';
          reminderBody = 'Take your Box2 medicines';
          if (trigger < new Date()) trigger.setDate(trigger.getDate() + 1);
          break;
        case 'box3': // Midnight medicine at 12:00 AM
          trigger = new Date();
          trigger.setHours(0, 0, 0, 0); // 12:00 AM
          reminderTitle = 'Midnight medicine reminder';
          reminderBody = 'Take your Box3 medicines';
          if (trigger < new Date()) trigger.setDate(trigger.getDate() + 1);
          break;
        default:
          return;
      }

      console.log(`Scheduling for ${box.name} at ${trigger}`);
      Notifications.scheduleNotificationAsync({
        content: {
          title: reminderTitle,
          body: reminderBody,
          data: { boxId: box._id },
        },
        trigger: {
          hour: trigger.getHours(),
          minute: trigger.getMinutes(),
          repeats: true, // Repeat daily
        },
      });
    });
  };

  // Test notification function
  // const triggerTestNotification = async () => {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: 'Test Notification',
  //       body: 'This is a test!',
  //     },
  //     trigger: { seconds: 1 },
  //   });
  // };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={triggerTestNotification} style={{ padding: 10, backgroundColor: 'blue' }}>
        <Text style={{ color: 'white' }}>Test Notification</Text>
      </TouchableOpacity> */}
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
  aiIcon: {
    width: 32,
    height: 29,
  }
});

export default BoxesScreen;