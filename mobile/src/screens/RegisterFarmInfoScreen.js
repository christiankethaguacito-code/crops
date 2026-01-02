import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, spacing, fontSize } from '../utils/theme';

export default function RegisterFarmInfoScreen({ navigation, route }) {
  const { basicInfo } = route.params;
  const [formData, setFormData] = useState({
    farmName: '',
    farmSize: '',
    address: '',
    barangay: '',
    municipality: 'Norala',
    province: 'South Cotabato',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.farmName.trim()) newErrors.farmName = 'Farm name is required';
    if (!formData.farmSize.trim()) {
      newErrors.farmSize = 'Farm size is required';
    } else if (isNaN(formData.farmSize) || parseFloat(formData.farmSize) <= 0) {
      newErrors.farmSize = 'Invalid farm size';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.barangay.trim()) newErrors.barangay = 'Barangay is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate('RegisterAppInfo', {
        basicInfo,
        farmInfo: formData,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Farm Information</Text>
          <Text style={styles.subtitle}>Step 2 of 4 - Tell us about your farm</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={[styles.progressStep, styles.progressActive]} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
        </View>

        <View style={styles.form}>
          <Input
            label="Farm Name"
            value={formData.farmName}
            onChangeText={(text) => setFormData({ ...formData, farmName: text })}
            error={errors.farmName}
            placeholder="e.g., Green Valley Farm"
          />

          <Input
            label="Farm Size (hectares)"
            value={formData.farmSize}
            onChangeText={(text) => setFormData({ ...formData, farmSize: text })}
            error={errors.farmSize}
            placeholder="e.g., 2.5"
            keyboardType="decimal-pad"
          />

          <Input
            label="Street Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            error={errors.address}
            placeholder="e.g., Purok 5"
          />

          <Input
            label="Barangay"
            value={formData.barangay}
            onChangeText={(text) => setFormData({ ...formData, barangay: text })}
            error={errors.barangay}
            placeholder="e.g., Poblacion"
          />

          <Input
            label="Municipality"
            value={formData.municipality}
            onChangeText={(text) => setFormData({ ...formData, municipality: text })}
            placeholder="Norala"
          />

          <Input
            label="Province"
            value={formData.province}
            onChangeText={(text) => setFormData({ ...formData, province: text })}
            placeholder="South Cotabato"
          />

          <Button title="Next" onPress={handleNext} />
          
          <Button
            title="Back"
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
