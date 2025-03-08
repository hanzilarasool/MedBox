// Screens/BoxDetailScreen.js
import React, { useContext,useState } from 'react';
import { View, Text, StyleSheet,Image,Pressable } from 'react-native';
import { useBoxes } from '../contexts/BoxesContext';
import AddMedicineModal from '../components/AddMedicineModal';
import EditMedicineModal from '../components/EditMedicineModel';

const BoxDetailScreen = () => {
  const { state,addMedicine,deleteMedicine,updateMedicine } = useBoxes();
  const selectedBox = state.boxes?.find(box => box._id === state.selectedBox);
// states to handle modal visiblity
const [modalVisible, setModalVisible] = useState(false);
const [editModalVisible, setEditModalVisible] = useState(false);
const [selectedMedicine, setSelectedMedicine] = useState(null);
// handle add medicine

const handleAddMedicine = async (medicineData) => {
    try {
      await addMedicine(state.selectedBox, medicineData);
      // Force re-render by updating local state
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };
// Handle edit medicine
const handleEditMedicine = async (medicineData) => {
    try {
      await updateMedicine(
        state.selectedBox, 
        selectedMedicine._id, 
        medicineData
      );
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };
// Add delete handler
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
               <View style={styles.timerContainer}  >
                  <Image source={require("../assets/icons/clock.png")} style={styles.clockIcon} />
               <View>
               <Text style={styles.boxDescription}>{selectedBox.description}</Text>
                {/* <Text style={styles.boxDate}>{box.date}</Text> */}
                <Text style={styles.boxTime}>{selectedBox.timeSlot}</Text>
               </View>
               </View>
                <Text style={styles.seeMore}>Details below</Text>
      
                     </View>
                     <Image source={require("../assets/images/Medicine-box.png")} style={styles.medicineBoxImage} />
          </View>
      {/* <Text style={styles.title}>{selectedBox.name}</Text> */}
      {/* <Text style={styles.description}>{selectedBox.description}</Text> */}
      <Pressable style={styles.addNewMedicineContainer} onPress={() => setModalVisible(true)}>
        <Text style={{fontSize:16,fontWeight:'600',color:"white"}}>Add new Medicine</Text>
        <Image source={require("../assets/icons/plus.png")} style={{width:35,height:35}} />
      </Pressable>
      {/* <Text style={styles.sectionTitle}>Medicines:</Text> */}
      
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
    <Image source={require("../assets/icons/edit.png")} style={{width:46,height:46}} />
  </Pressable>
  <EditMedicineModal
    visible={editModalVisible}
    onClose={() => setEditModalVisible(false)}
    onSubmit={handleEditMedicine}
    medicine={selectedMedicine}
  />

           <Pressable  onPress={() => handleDeleteMedicine(medicine._id)}>
           <Image source={require("../assets/icons/delete.png")} style={{width:46,height:46}} />
           </Pressable>
            </View>
            <View style={styles.medicineContainer}>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            <Text>Dosage: {medicine.dosage}</Text>
            <Text>Time: {medicine.time}</Text>
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

  addNewMedicineContainer:{
backgroundColor:"#5D65B0",
display:"flex",
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
padding:8,
marginBottom:12,
borderRadius:10,
  },
//   selected box styles
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
      singleMedicineWrapper:{
        
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-end",
        alignItems:"flex-start",
        gap:10,
        // marginBottom:10,
        // flexgap:10,
      }
      ,
      editORDelContainer:{
        display:"flex",
        flexDirection:"column",
       gap:4,
        alignItems:"center",
     
      }
     
});

export default BoxDetailScreen;