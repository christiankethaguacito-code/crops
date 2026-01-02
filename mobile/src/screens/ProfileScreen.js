import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import Input from '../components/Input';
import { farmerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, fontSize, borderRadius, shadows } from '../utils/theme';

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await farmerService.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await farmerService.updateProfile(formData);
      setProfile(formData);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout(), style: 'destructive' },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const InfoRow = ({ icon, label, value, editable = false, field, keyboardType }) => (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {editing && editable ? (
          <Input
            value={formData[field]}
            onChangeText={(text) => setFormData({ ...formData, [field]: text })}
            keyboardType={keyboardType}
            style={styles.infoInput}
          />
        ) : (
          <Text style={styles.infoValue}>{value || 'Not set'}</Text>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={48} color="#fff" />
        </View>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.role}>Farmer</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <MaterialCommunityIcons name="pencil" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.card}>
          <InfoRow icon="email" label="Email" value={profile?.email} />
          <InfoRow
            icon="phone"
            label="Phone"
            value={profile?.phone}
            editable
            field="phone"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farm Information</Text>
        <View style={styles.card}>
          <InfoRow
            icon="barn"
            label="Farm Name"
            value={profile?.farm_name}
            editable
            field="farm_name"
          />
          <InfoRow
            icon="texture-box"
            label="Farm Size"
            value={profile?.farm_size ? `${profile.farm_size} hectares` : 'Not set'}
            editable
            field="farm_size"
            keyboardType="decimal-pad"
          />
          <InfoRow
            icon="map-marker"
            label="Location"
            value={`${profile?.barangay}, ${profile?.municipality}`}
            editable
            field="barangay"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="file-document" size={32} color={colors.primary} />
            <Text style={styles.statValue}>{profile?.total_reports || 0}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="check-circle" size={32} color={colors.success} />
            <Text style={styles.statValue}>{profile?.resolved_reports || 0}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>
      </View>

      {editing ? (
        <>
          <Button title="Save Changes" onPress={handleSave} />
          <Button
            title="Cancel"
            onPress={() => {
              setEditing(false);
              setFormData(profile);
            }}
            variant="outline"
            style={styles.button}
          />
        </>
      ) : (
        <>
          <Button
            title="View Report History"
            onPress={() => navigation.navigate('ReportStatus')}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={[styles.button, styles.logoutButton]}
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
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  role: {
    fontSize: fontSize.md,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
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
  infoInput: {
    marginTop: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  button: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  logoutButton: {
    borderColor: colors.error,
  },
});
