import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, shadows } from '../utils/theme';

export default function Card({ title, value, icon, color, trend, style }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <MaterialCommunityIcons 
              name={trend > 0 ? 'trending-up' : 'trending-down'} 
              size={16} 
              color={trend > 0 ? colors.success : colors.error} 
            />
            <Text style={styles.trendText}>{Math.abs(trend)}%</Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
    flex: 1,
    margin: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  value: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
