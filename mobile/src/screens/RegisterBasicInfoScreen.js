import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, spacing, fontSize } from '../utils/theme';

export default function RegisterBasicInfoScreen({ navigation, route }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10-11 digits)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate('RegisterFarmInfo', { basicInfo: formData });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Step 1 of 4 - Basic Information</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
        </View>

        <View style={styles.form}>
          <Input
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            error={errors.firstName}
            placeholder="Juan"
          />

          <Input
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            error={errors.lastName}
            placeholder="Dela Cruz"
          />

          <Input
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            error={errors.email}
            placeholder="juan@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            error={errors.phone}
            placeholder="09171234567"
            keyboardType="phone-pad"
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            error={errors.password}
            placeholder="Minimum 6 characters"
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            error={errors.confirmPassword}
            placeholder="Re-enter password"
            secureTextEntry
          />

          <Button title="Next" onPress={handleNext} />
          
          <Button
            title="Back to Login"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
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
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: colors.primary,
  },
  form: {
    gap: spacing.md,
  },
});
