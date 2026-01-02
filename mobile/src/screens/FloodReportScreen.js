import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import Input from '../components/Input';
import { reportService } from '../services/api';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

const SEVERITY_LEVELS = [
  { value: 'minor', label: 'Minor', color: colors.warning },
  { value: 'moderate', label: 'Moderate', color: '#FF9800' },
  { value: 'severe', label: 'Severe', color: colors.error },
];

export default function FloodReportScreen({ navigation }) {
  const [formData, setFormData] = useState({
    severity: '',
    waterLevel: '',
    affectedArea: '',
    description: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        images: [...formData.images, result.assets[0]],
      });
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async () => {
    if (!formData.severity) {
      Alert.alert('Validation Error', 'Please select severity level');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Please provide a description');
      return;
    }

    setLoading(true);

    try {
      const reportData = {
        type: 'flood',
        severity: formData.severity,
        water_level: formData.waterLevel,
        affected_area: formData.affectedArea,
        description: formData.description,
        status: 'pending',
      };

      const response = await reportService.createReport(reportData);

      // Upload images if any
      if (formData.images.length > 0 && response.report_id) {
        for (const image of formData.images) {
          await reportService.uploadMedia(response.report_id, image.uri);
        }
      }

      Alert.alert(
        'Success!',
        'Your flood report has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="water" size={48} color={colors.primary} />
        <Text style={styles.title}>Flood Report</Text>
        <Text style={styles.subtitle}>Document flooding incident on your farm</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Severity Level *</Text>
        <View style={styles.severityContainer}>
          {SEVERITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.severityButton,
                formData.severity === level.value && {
                  backgroundColor: level.color,
                  borderColor: level.color,
                },
              ]}
              onPress={() => setFormData({ ...formData, severity: level.value })}
            >
              <Text
                style={[
                  styles.severityText,
                  formData.severity === level.value && styles.severityTextActive,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="Water Level (cm)"
        value={formData.waterLevel}
        onChangeText={(text) => setFormData({ ...formData, waterLevel: text })}
        placeholder="e.g., 50"
        keyboardType="numeric"
      />

      <Input
        label="Affected Area (hectares)"
        value={formData.affectedArea}
        onChangeText={(text) => setFormData({ ...formData, affectedArea: text })}
        placeholder="e.g., 1.5"
        keyboardType="decimal-pad"
      />

      <Input
        label="Description *"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        placeholder="Describe the flooding situation..."
        multiline
        numberOfLines={4}
        style={{ height: 100 }}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Photos</Text>
        <Text style={styles.helperText}>Take photos of the affected area</Text>
        
        <View style={styles.imagesContainer}>
          {formData.images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <MaterialCommunityIcons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          
          {formData.images.length < 5 && (
            <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
              <MaterialCommunityIcons name="camera-plus" size={32} color={colors.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Submitting report...</Text>
        </View>
      ) : (
        <>
          <Button title="Submit Report" onPress={handleSubmit} />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.cancelButton}
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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  helperText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  severityContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  severityButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  severityText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
  },
  severityTextActive: {
    color: '#fff',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  cancelButton: {
    marginTop: spacing.md,
  },
});
