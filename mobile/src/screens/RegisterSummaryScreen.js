import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

export default function RegisterSummaryScreen({ navigation, route }) {
  const { basicInfo, farmInfo, appInfo } = route.params;
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    const userData = {
      first_name: basicInfo.firstName,
      last_name: basicInfo.lastName,
      email: basicInfo.email,
      phone: basicInfo.phone,
      password: basicInfo.password,
      role: 'farmer',
      farm_name: farmInfo.farmName,
      farm_size: parseFloat(farmInfo.farmSize),
      address: farmInfo.address,
      barangay: farmInfo.barangay,
      municipality: farmInfo.municipality,
      province: farmInfo.province,
      crops: appInfo.crops.join(','),
      notifications: appInfo.notifications.join(','),
    };

    const result = await register(userData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success!',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Review & Confirm</Text>
        <Text style={styles.subtitle}>Step 4 of 4 - Verify your information</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressStep, styles.progressActive]} />
        <View style={[styles.progressStep, styles.progressActive]} />
        <View style={[styles.progressStep, styles.progressActive]} />
        <View style={[styles.progressStep, styles.progressActive]} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <InfoRow
            icon="account"
            label="Name"
            value={`${basicInfo.firstName} ${basicInfo.lastName}`}
          />
          <InfoRow icon="email" label="Email" value={basicInfo.email} />
          <InfoRow icon="phone" label="Phone" value={basicInfo.phone} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farm Information</Text>
        <View style={styles.card}>
          <InfoRow icon="barn" label="Farm Name" value={farmInfo.farmName} />
          <InfoRow icon="texture-box" label="Farm Size" value={`${farmInfo.farmSize} hectares`} />
          <InfoRow
            icon="map-marker"
            label="Location"
            value={`${farmInfo.address}, ${farmInfo.barangay}, ${farmInfo.municipality}, ${farmInfo.province}`}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.card}>
          <InfoRow
            icon="sprout"
            label="Crops"
            value={appInfo.crops.length > 0 ? appInfo.crops.join(', ') : 'None selected'}
          />
          <InfoRow
            icon="bell"
            label="Notifications"
            value={`${appInfo.notifications.length} types enabled`}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Creating your account...</Text>
        </View>
      ) : (
        <>
          <Button title="Create Account" onPress={handleRegister} />
          
          <Button
            title="Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.backButton}
          />
        </>
      )}
    </ScrollView>
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  backButton: {
    marginTop: spacing.md,
  },
});
