import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, shadows } from '../utils/theme';

export default function ReportSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Report</Text>
        <Text style={styles.subtitle}>Select the type of calamity to report</Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('FloodReport')}
        >
          <MaterialCommunityIcons name="water" size={64} color="#fff" />
          <Text style={styles.cardTitle}>Flood Report</Text>
          <Text style={styles.cardDescription}>
            Report flooding incidents affecting your farm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.error }]}
          onPress={() => navigation.navigate('PestReport')}
        >
          <MaterialCommunityIcons name="bug" size={64} color="#fff" />
          <Text style={styles.cardTitle}>Pest Report</Text>
          <Text style={styles.cardDescription}>
            Report pest infestations in your crops
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
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
  cardsContainer: {
    flex: 1,
    gap: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: fontSize.md,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
});
