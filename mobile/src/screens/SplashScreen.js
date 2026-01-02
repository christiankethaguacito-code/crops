import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, fontSize } from '../utils/theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>CropAid</Text>
      <Text style={styles.subtitle}>Agricultural Monitoring System</Text>
      <Text style={styles.location}>Municipality of Norala</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: fontSize.xxxl + 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  location: {
    fontSize: fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
});
