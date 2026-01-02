import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { farmerService } from '../services/api';
import { colors, spacing, fontSize, borderRadius, shadows } from '../utils/theme';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: colors.warning,
    icon: 'clock-outline',
  },
  investigating: {
    label: 'Under Investigation',
    color: '#2196F3',
    icon: 'magnify',
  },
  resolved: {
    label: 'Resolved',
    color: colors.success,
    icon: 'check-circle',
  },
  rejected: {
    label: 'Rejected',
    color: colors.error,
    icon: 'close-circle',
  },
};

const TYPE_CONFIG = {
  flood: {
    label: 'Flood',
    color: colors.primary,
    icon: 'water',
  },
  pest: {
    label: 'Pest',
    color: colors.error,
    icon: 'bug',
  },
};

export default function ReportStatusScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await farmerService.getReportHistory();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderReport = ({ item }) => {
    const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.flood;

    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => {/* Navigate to report details */}}
      >
        <View style={styles.reportHeader}>
          <View style={[styles.typebadge, { backgroundColor: typeConfig.color }]}>
            <MaterialCommunityIcons name={typeConfig.icon} size={20} color="#fff" />
            <Text style={styles.typeBadgeText}>{typeConfig.label}</Text>
          </View>
          <Text style={styles.reportDate}>{formatDate(item.created_at)}</Text>
        </View>

        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {item.severity && (
          <View style={styles.reportMeta}>
            <MaterialCommunityIcons name="alert" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>Severity: {item.severity}</Text>
          </View>
        )}

        <View style={styles.reportFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
            <MaterialCommunityIcons name={statusConfig.icon} size={16} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          
          {item.admin_notes && (
            <MaterialCommunityIcons name="message-text" size={20} color={colors.textSecondary} />
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
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>{reports.length} total reports</Text>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="file-document-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No reports yet</Text>
          <Text style={styles.emptySubtext}>Create your first report from the dashboard</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
  typebadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  reportDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  reportDescription: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
