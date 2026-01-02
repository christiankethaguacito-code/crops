import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, spacing, fontSize } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(identifier, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
    // Navigation handled automatically by AuthContext
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to CropAid</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email or RSBSA Number"
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="Enter your email or RSBSA"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <Button
            title="Create Account"
            onPress={() => navigation.navigate('RegisterBasicInfo')}
            variant="outline"
            style={styles.registerButton}
          />
        </View>

        <Text style={styles.footer}>
          For Municipal Agriculture Office personnel,{'\n'}
          contact admin for credentials
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl + 4,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  form: {
    marginTop: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    textAlign: 'center',
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
