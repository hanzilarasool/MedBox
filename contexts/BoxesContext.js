// context/BoxesContext.js
import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";

const IP = Constants.expoConfig.extra.IP;
export const BoxesContext = createContext();

const initialState = {
  boxes: [],
  loading: false,
  error: null,
  selectedBox: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_BOXES_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_BOXES_SUCCESS':
      return { ...state, loading: false, boxes: action.payload };
    case 'FETCH_BOXES_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'SELECT_BOX':
      return { ...state, selectedBox: action.payload };
    default:
      return state;
  }
};

export const BoxesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchBoxes = async (patientId = null) => {
    try {
      dispatch({ type: 'FETCH_BOXES_REQUEST' });
      const token = await AsyncStorage.getItem('token');
      console.log('Fetching boxes with token:', token);

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      if (patientId) {
        headers['X-User-Id'] = patientId; // Include X-User-Id header for admins
      }

      const response = await axios.get(`http://${IP}:5000/api/boxes`, { headers });
      console.log('Boxes response:', response.data);
      dispatch({ type: 'FETCH_BOXES_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Error fetching boxes:', error);
      dispatch({ type: 'FETCH_BOXES_FAILURE', payload: error.message });
    }
  };

  const addMedicine = async (boxId, medicineData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      dispatch({ type: 'FETCH_BOXES_REQUEST' });

      const response = await axios.post(
        `http://${IP}:5000/api/boxes/${boxId}/medicines`,
        medicineData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updatedBoxes = state.boxes.map(box =>
        box._id === response.data._id ? response.data : box
      );

      dispatch({ type: 'FETCH_BOXES_SUCCESS', payload: updatedBoxes });
    } catch (error) {
      console.error('Error adding medicine:', error);
      dispatch({ type: 'FETCH_BOXES_FAILURE', payload: error.message });
    }
  };

  const deleteMedicine = async (boxId, medicineId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      dispatch({ type: 'FETCH_BOXES_REQUEST' });

      const response = await axios.delete(
        `http://${IP}:5000/api/boxes/${boxId}/medicines/${medicineId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Delete medicine response:', response.data);

      const updatedBoxes = state.boxes.map(box =>
        box._id === response.data._id ? response.data : box
      );

      dispatch({ type: 'FETCH_BOXES_SUCCESS', payload: updatedBoxes });
    } catch (error) {
      console.error('Error deleting medicine:', error);
      dispatch({ type: 'FETCH_BOXES_FAILURE', payload: error.message });
    }
  };

  const updateMedicine = async (boxId, medicineId, medicineData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      dispatch({ type: 'FETCH_BOXES_REQUEST' });

      const response = await axios.put(
        `http://${IP}:5000/api/boxes/${boxId}/medicines/${medicineId}`,
        medicineData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updatedBoxes = state.boxes.map(box =>
        box._id === response.data._id ? response.data : box
      );

      dispatch({ type: 'FETCH_BOXES_SUCCESS', payload: updatedBoxes });
    } catch (error) {
      console.error('Error updating medicine:', error);
      dispatch({ type: 'FETCH_BOXES_FAILURE', payload: error.message });
    }
  };

  const selectBox = (boxId) => {
    dispatch({ type: 'SELECT_BOX', payload: boxId });
    AsyncStorage.setItem('selectedBox', JSON.stringify(boxId));
  };

  return (
    <BoxesContext.Provider
      value={{
        state,
        fetchBoxes,
        selectBox,
        addMedicine,
        deleteMedicine,
        updateMedicine,
      }}
    >
      {children}
    </BoxesContext.Provider>
  );
};

export const useBoxes = () => {
  return useContext(BoxesContext);
};