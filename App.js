import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";  // Adjust your path if necessary
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import { BoxesProvider } from "./contexts/BoxesContext";
import BoxesScreen from "./screens/BoxesScreen";
import BoxDetailScreen from "./screens/BoxDetailScreen";
import HistoryScreen from "./screens/HistoryScreen";
import AdminDashboard from "./screens/AdminDashboard";
import AdminBoxesScreen from "./screens/AdminBoxesScreen";
import AdminBoxDetailScreen from "./screens/AdminBoxDetailScreen";
import AdminHistoryScreen from "./screens/AdminHistoryScreen"; // Add this import
const Stack = createStackNavigator();

export default function App() {
  return (
    <BoxesProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        {/* boxes screens */}
        <Stack.Screen
          name="Boxes"
          component={BoxesScreen }
          // options={{ title: "Boxes" }}
          options={{ headerShown: false }} // Hide the header (no back arrow)
        />
        <Stack.Screen
  name="BoxDetail"
  component={BoxDetailScreen}
  options={{ title: "Box Details" }}
/>
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "History" }}
        />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="AdminBoxes" component={AdminBoxesScreen} />
          <Stack.Screen name="AdminBoxDetail" component={AdminBoxDetailScreen} />
          
          <Stack.Screen
            name="AdminHistory"
            component={AdminHistoryScreen}
            options={{ title: "Patient History" }} // Add this screen
          />
      </Stack.Navigator>
    </NavigationContainer>
    </BoxesProvider>
  );
}
