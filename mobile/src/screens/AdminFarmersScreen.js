import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { adminService } from '../services/api';
import { colors, spacing, fontSize, borderRadius, shadows } from '../utils/theme';

export default function AdminFarmersScreen({ navigation }) {
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = farmers.filter(
        (farmer) =>
          farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farmer.barangay.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFarmers(filtered);
    } else {
      setFilteredFarmers(farmers);
    }
  }, [searchQuery, farmers]);

  const fetchFarmers = async () => {
    try {
      const data = await adminService.getAllFarmers();
      setFarmers(data);
      setFilteredFarmers(data);
    } catch (error) {
      console.error('Failed to fetch farmers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFarmers();
  };

  const renderFarmer = ({ item }) => (
    <TouchableOpacity
      style={styles.farmerCard}
      onPress={() => {/* Navigate to farmer details */}}
    >
      <View style={styles.farmerAvatar}>
        <MaterialCommunityIcons name="account" size={32} color="#fff" />
      </View>
      
      <View style={styles.farmerInfo}>
        <Text style={styles.farmerName}>{item.name}</Text>
        <View style={styles.farmerMeta}>
          <MaterialCommunityIcons name="map-marker" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {item.barangay}, {item.municipality}
          </Text>
        </View>
        <View style={styles.farmerMeta}>
          <MaterialCommunityIcons name="barn" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {item.farm_name} • {item.farm_size} hectares
          </Text>
        </View>
        <View style={styles.farmerStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.total_reports || 0}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.pending_reports || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registered Farmers</Text>
        <Text style={styles.subtitle}>{farmers.length} total farmers</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search farmers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredFarmers}
        renderItem={renderFarmer}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No farmers found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  listContent: {
    padding: spacing.lg,
  },
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  farmerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  farmerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  farmerStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
