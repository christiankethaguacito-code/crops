import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { adminService } from '../services/api';
import { colors, spacing, fontSize, borderRadius, shadows } from '../utils/theme';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: colors.warning, icon: 'clock-outline' },
  investigating: { label: 'Investigating', color: '#2196F3', icon: 'magnify' },
  resolved: { label: 'Resolved', color: colors.success, icon: 'check-circle' },
  rejected: { label: 'Rejected', color: colors.error, icon: 'close-circle' },
};

const TYPE_CONFIG = {
  flood: { label: 'Flood', color: colors.primary, icon: 'water' },
  pest: { label: 'Pest', color: colors.error, icon: 'bug' },
};

export default function AdminReportsScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, resolved

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await adminService.getAllReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await adminService.updateReportStatus(reportId, newStatus);
      fetchReports();
      Alert.alert('Success', 'Report status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update report status');
    }
  };

  const showStatusMenu = (report) => {
    const options = [
      { text: 'Mark as Investigating', value: 'investigating' },
      { text: 'Mark as Resolved', value: 'resolved' },
      { text: 'Mark as Rejected', value: 'rejected' },
      { text: 'Cancel', style: 'cancel' },
    ];

    Alert.alert(
      'Update Status',
      `Change status for report #${report.id}`,
      options.map((option) => ({
        text: option.text,
        style: option.style,
        onPress: option.value ? () => handleStatusChange(report.id, option.value) : undefined,
      }))
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredReports = reports.filter((report) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return report.status === 'pending';
    if (filter === 'resolved') return report.status === 'resolved';
    return true;
  });

  const renderReport = ({ item }) => {
    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.flood;

    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => showStatusMenu(item)}
      >
        <View style={styles.reportHeader}>
          <View style={[styles.typeBadge, { backgroundColor: typeConfig.color }]}>
            <MaterialCommunityIcons name={typeConfig.icon} size={16} color="#fff" />
            <Text style={styles.typeBadgeText}>{typeConfig.label}</Text>
          </View>
          <Text style={styles.reportId}>#{item.id}</Text>
        </View>

        <View style={styles.reportBody}>
          <View style={styles.reportInfo}>
            <MaterialCommunityIcons name="account" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{item.farmer_name}</Text>
          </View>
          <View style={styles.reportInfo}>
            <MaterialCommunityIcons name="map-marker" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{item.barangay}</Text>
          </View>
          <View style={styles.reportInfo}>
            <MaterialCommunityIcons name="clock" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{formatDate(item.created_at)}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.reportFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
            <MaterialCommunityIcons name={statusConfig.icon} size={16} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          
          {item.severity && (
            <View style={styles.severityBadge}>
              <Text style={styles.severityText}>{item.severity}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.title}>All Reports</Text>
        <Text style={styles.subtitle}>{reports.length} total reports</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({reports.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'pending' && styles.filterTabActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
            Pending ({reports.filter(r => r.status === 'pending').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'resolved' && styles.filterTabActive]}
          onPress={() => setFilter('resolved')}
        >
          <Text style={[styles.filterText, filter === 'resolved' && styles.filterTextActive]}>
            Resolved ({reports.filter(r => r.status === 'resolved').length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-document-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No reports found</Text>
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
  filterContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: spacing.lg,
  },
  reportCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  reportId: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  reportBody: {
    marginBottom: spacing.sm,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
  },
  severityText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'capitalize',
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
