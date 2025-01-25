import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

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
      {/* <Image source={require("./assets/logo.png")} style={styles.logo} /> */}
      <Text style={styles.headline}>Welcome to Our App</Text>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default SplashScreen;
