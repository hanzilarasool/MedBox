// Screens/BoxesScreen.js
import React, { useContext, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import bellIcon from '../assets/icons/bell.svg';
// import SvgUri from 'react-native-svg-uri';

import { BoxesContext } from '../contexts/BoxesContext';
import { useNavigation } from '@react-navigation/native'; 


const BoxesScreen = () => {
  const { state, fetchBoxes,selectBox } = useContext(BoxesContext);
  const navigation = useNavigation(); // Add this line
  useEffect(() => {
    fetchBoxes();
  }, []);

return (
    <ScrollView style={styles.container}>
        <View style={styles.scheduleButtonContainer}>
            {/* <SvgUri source={require("../assets/icons/bell.svg")} /> */}
            <Text style={styles.scheduleButtonText}>Schedule</Text>
            <Image source={require("../assets/icons/bell.png")} />
        </View>
        {state.boxes?.map((box) => (
            <View 
                key={box._id}
                style={styles.boxContainer}
               
            >
               <View>
               <Text style={styles.boxTitle}>{box.name}</Text>
         <View style={styles.timerContainer}  >
            <Image source={require("../assets/icons/clock.png")} style={styles.clockIcon} />
         <View>
         <Text style={styles.boxDescription}>{box.description}</Text>
          {/* <Text style={styles.boxDate}>{box.date}</Text> */}
          <Text style={styles.boxTime}>{box.timeSlot}</Text>
         </View>
         </View>
          <Text style={styles.seeMore}  onPress={() => {
                    selectBox(box._id);
                    navigation.navigate('BoxDetail');
                }}>see more...</Text>

               </View>
               <Image source={require("../assets/images/Medicine-box.png")} style={styles.medicineBoxImage} />
          {/* <View style={styles.divider} /> */}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },

  scheduleButtonContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    padding:10,
    marginBottom:12,
    borderBottomWidth: 1,
    borderBottomColor: '#4E58C7',
    backgroundColor: 'rgba(30, 29, 29, 0.12)',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    borderTopLeftRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // backgroundColor:"yellow",
    color:"#f5f5f5",
    // borderRadius:8,
 
  },
  scheduleButtonText: {
    color: '#4E58C7',
    fontFamily: 'Inter',
    fontSize: 15,
    // fontStyle: 'normal',
    fontWeight: '700',
    // lineHeight: 'normal',
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
    display:"flex",
    flexDirection:"row",    
    justifyContent:"space-between",
    alignItems:"center",
  },
  medicineBoxImage:{
width:100,
height:100,
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
  boxDate: {
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  boxTime: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  seeMore: {
    width: 190,
    // height: 26,
    backgroundColor: '#4E58C7',
    color: '#FFFFFF',
    borderRadius: 5,
    textAlign: 'center',
    padding: 5,
fontSize:14,
marginBottom:5,

  },
  timerContainer:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    
  },
  clockIcon:{
    width:21,
    height:21,
    marginRight:10,
    borderRadius:20,
  },
 
});

export default BoxesScreen;