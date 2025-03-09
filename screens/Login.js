import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import
const Login = ({ navigation }) => {
  // const BACKEND_URL = process.env.BACKEND_URL ;

// console.log(BACKEND_URL, "is the backend url");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


const handleLogin = async () => {
  try {
    const response = await axios.post(`http://192.168.1.4:5000/api/user/login`, {
      email,
      password,
    });

    try {
      await AsyncStorage.multiSet([
        ['token', response.data.token],
        ['user', JSON.stringify(response.data.user)]
      ]);
      setSuccess("Login successful!");
      navigation.navigate("Boxes");
    } catch (storageError) {
      setError("Failed to store login data");
    }

  } catch (err) {
    setError(err.response?.data?.error || "Login failed");
  }
};
  const handleSignupRedirect = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input} 
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={{ marginBottom: 20, alignSelf: "flex-start", marginLeft: 11 }}>
        Don't have an account? <Text style={{ color: "rgb(93, 101, 176)", textDecorationLine: "underline" }} onPress={handleSignupRedirect}>Sign Up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "rgb(93, 101, 176)",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: "100%",
    backgroundColor: "rgb(93, 101, 176)",
    padding: 15,
    
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  success: {
    color: "green",
    marginBottom: 10,
  },
});

export default Login;