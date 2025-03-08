import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';

export default function ProfileScreen({ route }) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Title>Welcome, {user.name}!</Title>
      <Paragraph>Email: {user.email}</Paragraph>
      {/* Add more user information as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});