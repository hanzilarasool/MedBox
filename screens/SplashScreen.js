import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    console.log("SplashScreen loaded");
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);
  
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Lottie animation */}
      <LottieView
        source={require("../assets/preventive-health-care.json")} // Replace with your animation file path
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.headline}>Welcome to <Text style={{color:"rgb(93, 101, 176)",fontSize:"24"}}>MedBox</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  animation: {
    width: 150, // Set your desired animation size
    height: 150,
    marginBottom: 20,
  },
  headline: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default SplashScreen;
