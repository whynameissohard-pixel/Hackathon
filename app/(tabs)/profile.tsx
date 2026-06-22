import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { mockUserProfile } from '../../data/mockUserProfile';
import { router } from 'expo-router';

interface SettingsItem {
  icon: string;
  label: string;
  labelEn: string;
  color?: string;
  isDestructive?: boolean;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const profile = mockUserProfile;
  const insurance = profile.insurance;

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;

  const settingsItems: SettingsItem[] = [
    {
      icon: '🔔',
      label: 'การแจ้งเตือน',
      labelEn: 'Notifications',
    },
    {
      icon: '🌐',
      label: 'ภาษา',
      labelEn: 'Language',
    },
    {
      icon: '🔒',
      label: 'ความเป็นส่วนตัว',
      labelEn: 'Privacy',
    },
    {
      icon: 'ℹ️',
      label: 'เกี่ยวกับแอป',
      labelEn: 'About',
    },
    {
      icon: '🚪',
      label: 'ออกจากระบบ',
      labelEn: 'Logout',
      isDestructive: true,
      onPress: () => {
        Alert.alert(
          'ออกจากระบบ',
          'คุณต้องการออกจากระบบหรือไม่?',
          [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'ออกจากระบบ', style: 'destructive' },
          ]
        );
      },
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={Colors.gradientBlue}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarInitials}>{initials}</Text>
          </LinearGradient>

          <Text style={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.profileNameEn}>
            {profile.firstNameEn} {profile.lastNameEn}
          </Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={14} color={Colors.gray500} />
            <Text style={styles.phoneText}>{profile.phone}</Text>
          </View>

          <TouchableOpacity style={styles.editProfileButton} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={16} color={Colors.primary} />
            <Text style={styles.editProfileText}>แก้ไขโปรไฟล์</Text>
          </TouchableOpacity>
        </View>

        {/* Insurance / Benefits Section */}
        {insurance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>สิทธิประโยชน์</Text>
            <View style={styles.insuranceCard}>
              <View style={styles.insuranceAccent} />
              <View style={styles.insuranceContent}>
                <View style={styles.insuranceHeader}>
                  <Text style={styles.insuranceType}>{insurance.typeName}</Text>
                  {insurance.isActive && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>ผูกแล้ว</Text>
                    </View>
                  )}
                </View>

                <View style={styles.insuranceDetailRow}>
                  <Text style={styles.insuranceLabel}>ผู้ให้บริการ</Text>
                  <Text style={styles.insuranceValue}>{insurance.provider}</Text>
                </View>
                <View style={styles.insuranceDetailRow}>
                  <Text style={styles.insuranceLabel}>เลขกรมธรรม์</Text>
                  <Text style={styles.insuranceValue}>{insurance.policyNumber}</Text>
                </View>
                <View style={styles.insuranceDetailRow}>
                  <Text style={styles.insuranceLabel}>ความคุ้มครอง</Text>
                  <Text style={styles.insuranceValue}>
                    {insurance.coverageAmount.toLocaleString()} บาท/ครั้ง
                  </Text>
                </View>
                <View style={styles.insuranceDetailRow}>
                  <Text style={styles.insuranceLabel}>วันหมดอายุ</Text>
                  <Text style={styles.insuranceValue}>{insurance.expiryDate}</Text>
                </View>

                <View style={styles.aiEstimateBox}>
                  <Text style={styles.aiEstimateText}>
                    🤖 AI ประมาณค่าใช้จ่าย: ขูดหินปูน ฟรี (ใช้สิทธิประกันสังคม)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Health Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ข้อมูลสุขภาพ</Text>
          <View style={styles.card}>
            {/* Blood Type */}
            <View style={styles.healthRow}>
              <Text style={styles.healthIcon}>🩸</Text>
              <Text style={styles.healthLabel}>หมู่เลือด:</Text>
              <View style={styles.healthValueContainer}>
                <View style={styles.bloodTypeBadge}>
                  <Text style={styles.bloodTypeText}>{profile.bloodType}</Text>
                </View>
              </View>
            </View>

            <View style={styles.healthDivider} />

            {/* Allergies */}
            <View style={styles.healthRow}>
              <Text style={styles.healthIcon}>⚠️</Text>
              <Text style={styles.healthLabel}>แพ้ยา:</Text>
              <View style={styles.healthValueContainer}>
                {profile.allergies.map((allergy, index) => (
                  <View key={index} style={styles.allergyTag}>
                    <Text style={styles.allergyTagText}>{allergy}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.healthDivider} />

            {/* Chronic Diseases */}
            <View style={styles.healthRow}>
              <Text style={styles.healthIcon}>🏥</Text>
              <Text style={styles.healthLabel}>โรคประจำตัว:</Text>
              <View style={styles.healthValueContainer}>
                {profile.chronicDiseases.map((disease, index) => (
                  <View key={index} style={styles.diseaseTag}>
                    <Text style={styles.diseaseTagText}>{disease}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>เมนูตั้งค่า</Text>
          <View style={styles.card}>
            {settingsItems.map((item, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.settingsRow}
                  activeOpacity={0.6}
                  onPress={item.onPress}
                >
                  <Text style={styles.settingsIcon}>{item.icon}</Text>
                  <View style={styles.settingsLabelContainer}>
                    <Text
                      style={[
                        styles.settingsLabel,
                        item.isDestructive && styles.settingsLabelDestructive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={styles.settingsLabelEn}>{item.labelEn}</Text>
                  </View>
                  {!item.isDestructive && (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={Colors.gray300}
                    />
                  )}
                </TouchableOpacity>
                {index < settingsItems.length - 1 && (
                  <View style={styles.settingsDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>DentAI v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Header ──────────────────────────────────────
  headerSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Layout.shadow.medium,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.white,
    letterSpacing: 1,
  },
  profileName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.gray900,
    marginBottom: 4,
  },
  profileNameEn: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  phoneText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.gray500,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Layout.buttonRadius,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  editProfileText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },

  // ── Sections ────────────────────────────────────
  section: {
    paddingHorizontal: Layout.screenPadding,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginBottom: 12,
  },

  // ── Insurance Card ──────────────────────────────
  insuranceCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Layout.shadow.small,
  },
  insuranceAccent: {
    width: 5,
    backgroundColor: Colors.primary,
  },
  insuranceContent: {
    flex: 1,
    padding: Layout.cardPadding,
  },
  insuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  insuranceType: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.gray900,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.success,
  },
  insuranceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  insuranceLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray500,
  },
  insuranceValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.gray800,
  },
  aiEstimateBox: {
    marginTop: 14,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  aiEstimateText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.primaryDark,
    lineHeight: 18,
  },

  // ── Health Info Card ────────────────────────────
  card: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    ...Layout.shadow.small,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  healthIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 1,
  },
  healthLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.gray800,
    marginRight: 10,
    marginTop: 3,
  },
  healthValueContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-end',
  },
  bloodTypeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
  },
  bloodTypeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.primary,
  },
  allergyTag: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  allergyTagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.danger,
  },
  diseaseTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  diseaseTagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.warning,
  },
  healthDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginHorizontal: 4,
  },

  // ── Settings ────────────────────────────────────
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  settingsLabelContainer: {
    flex: 1,
  },
  settingsLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.gray800,
  },
  settingsLabelDestructive: {
    color: Colors.danger,
  },
  settingsLabelEn: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 1,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginLeft: 40,
  },

  // ── Version ─────────────────────────────────────
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  versionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
  },
});
