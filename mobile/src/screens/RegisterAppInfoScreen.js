import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

const CROP_TYPES = [
  { id: 'rice', name: 'Rice', icon: 'rice' },
  { id: 'corn', name: 'Corn', icon: 'corn' },
  { id: 'vegetables', name: 'Vegetables', icon: 'carrot' },
  { id: 'fruits', name: 'Fruits', icon: 'fruit-cherries' },
];

const NOTIFICATION_PREFERENCES = [
  { id: 'flood_alerts', label: 'Flood Alerts', icon: 'water-alert' },
  { id: 'pest_alerts', label: 'Pest Alerts', icon: 'bug' },
  { id: 'weather_updates', label: 'Weather Updates', icon: 'weather-cloudy' },
  { id: 'advisory', label: 'Advisory Notifications', icon: 'bell' },
];

export default function RegisterAppInfoScreen({ navigation, route }) {
  const { basicInfo, farmInfo } = route.params;
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [notifications, setNotifications] = useState([
    'flood_alerts',
    'pest_alerts',
    'weather_updates',
    'advisory',
  ]);

  const toggleCrop = (cropId) => {
    if (selectedCrops.includes(cropId)) {
      setSelectedCrops(selectedCrops.filter((id) => id !== cropId));
    } else {
      setSelectedCrops([...selectedCrops, cropId]);
    }
  };

  const toggleNotification = (notifId) => {
    if (notifications.includes(notifId)) {
      setNotifications(notifications.filter((id) => id !== notifId));
    } else {
      setNotifications([...notifications, notifId]);
    }
  };

  const handleNext = () => {
    navigation.navigate('RegisterSummary', {
      basicInfo,
      farmInfo,
      appInfo: {
        crops: selectedCrops,
        notifications,
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>App Preferences</Text>
        <Text style={styles.subtitle}>Step 3 of 4 - Customize your experience</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressStep, styles.progressActive]} />
        <View style={[styles.progressStep, styles.progressActive]} />
        <View style={[styles.progressStep, styles.progressActive]} />
        <View style={styles.progressStep} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crops You Grow</Text>
        <Text style={styles.sectionSubtitle}>Select all that apply</Text>
        
        <View style={styles.grid}>
          {CROP_TYPES.map((crop) => (
            <TouchableOpacity
              key={crop.id}
              style={[
                styles.cropCard,
                selectedCrops.includes(crop.id) && styles.cropCardSelected,
              ]}
              onPress={() => toggleCrop(crop.id)}
            >
              <MaterialCommunityIcons
                name={crop.icon}
                size={32}
                color={selectedCrops.includes(crop.id) ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.cropText,
                  selectedCrops.includes(crop.id) && styles.cropTextSelected,
                ]}
              >
                {crop.name}
              </Text>
              {selectedCrops.includes(crop.id) && (
                <View style={styles.checkBadge}>
                  <MaterialCommunityIcons name="check" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <Text style={styles.sectionSubtitle}>Choose what alerts you want to receive</Text>
        
        {NOTIFICATION_PREFERENCES.map((pref) => (
          <TouchableOpacity
            key={pref.id}
            style={styles.notifItem}
            onPress={() => toggleNotification(pref.id)}
          >
            <View style={styles.notifLeft}>
              <MaterialCommunityIcons
                name={pref.icon}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.notifLabel}>{pref.label}</Text>
            </View>
            <View
              style={[
                styles.checkbox,
                notifications.includes(pref.id) && styles.checkboxChecked,
              ]}
            >
              {notifications.includes(pref.id) && (
                <MaterialCommunityIcons name="check" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Next" onPress={handleNext} style={styles.button} />
      
      <Button
        title="Back"
        onPress={() => navigation.goBack()}
        variant="outline"
        style={styles.button}
      />
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
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cropCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  cropCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  cropText: {
    marginTop: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  cropTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  notifLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  notifLabel: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  button: {
    marginBottom: spacing.md,
  },
});
