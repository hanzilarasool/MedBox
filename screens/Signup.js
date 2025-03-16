import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';

const IP = Constants.expoConfig.extra.IP;

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP array
  const [showPassword, setShowPassword] = useState(false);
  const otpRefs = useRef([]);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignup = async () => {
    try {
      setError("");
      setSuccess("");

      if (!name || !email || !password) {
        setError("All fields are required");
        return;
      }

      if (!isValidEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      const response = await axios.post(`http://${IP}:5000/api/user/register`, {
        name,
        email,
        password,
      });
      setSuccess(response.data.message || "OTP sent successfully");
      setError("");
      setStep(2); // Move to OTP verification
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong during registration");
      setSuccess("");
    }
  };

  const handleOTPChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPSubmit = async () => {
    try {
      setError("");
      setSuccess("");
  
      const otpValue = otp.join(""); // Combine OTP digits into a single string
      if (!otpValue || otpValue.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
  
      if (!email) {
        setError("Email is missing. Please restart the signup process.");
        return;
      }
  
      const response = await axios.post(`http://${IP}:5000/api/user/verify-otp`, {
        email: email,
        otp: otpValue,
      });
  
      setSuccess(response.data.message || "OTP verified successfully");
      setTimeout(() => navigation.navigate("Login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate("Login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step === 1 ? "SignUp" : "Verify OTP"}</Text>

      {step === 1 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="rgb(93, 101, 176)"
              />
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
          <Text style={{ marginBottom: 20, alignSelf: "flex-start", marginLeft: 11,fontSize:15,color:"rgb(93, 91, 91)",marginTop:5 }}>
            Already have an account?{" "}
            <Text
              style={{ color: "rgb(93, 101, 176)", textDecorationLine: "underline",fontSize:15 ,fontWeight:"bold" }}
              onPress={handleLoginRedirect}
            >
              Login
            </Text>
          </Text>
        </>
      ) : (
        <View>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOTPChange(value, index)}
                onKeyPress={(e) => handleOTPKeyDown(e, index)}
                maxLength={1}
                keyboardType="numeric"
                ref={(el) => (otpRefs.current[index] = el)}
                textAlign="center"
              />
            ))}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleOTPSubmit}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
  passwordInput: {
    flex: 1,
    padding: 15,
  },
  eyeIcon: {
    padding: 10,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    fontSize: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Signup;