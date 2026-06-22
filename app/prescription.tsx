import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { mockPrescriptions } from '../data/mockDentalRecords';

export default function PrescriptionScreen() {
  const params = useLocalSearchParams<{ prescriptionId?: string }>();
  const prescription =
    mockPrescriptions.find((p) => p.id === params.prescriptionId) ||
    mockPrescriptions[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning;
      case 'delivered':
        return Colors.success;
      case 'collected':
        return Colors.primary;
      default:
        return Colors.gray500;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'รอรับยา';
      case 'delivered':
        return 'จัดส่งแล้ว';
      case 'collected':
        return 'รับยาแล้ว';
      default:
        return status;
    }
  };

  const getDeliveryText = (method: string | null) => {
    switch (method) {
      case 'home':
        return '🏠 ส่งยาถึงบ้าน';
      case 'clinic':
        return '🏥 รับยาที่คลินิก';
      case 'pharmacy':
        return '🏪 รับยาที่ร้านยา';
      default:
        return 'ยังไม่ได้เลือก';
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.gray800} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>ใบสั่งยา</Text>
            <Text style={styles.headerSubtitle}>E-Prescription</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Prescription Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>วันที่ออกใบสั่งยา</Text>
              <Text style={styles.infoValue}>{prescription.date}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ทันตแพทย์</Text>
              <Text style={styles.infoValue}>{prescription.doctorName}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>การวินิจฉัย</Text>
              <Text style={styles.infoValue}>{prescription.diagnosis}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>สถานะ</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(prescription.status) + '15' },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(prescription.status) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(prescription.status) },
                  ]}
                >
                  {getStatusText(prescription.status)}
                </Text>
              </View>
            </View>
            {prescription.deliveryMethod && (
              <>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>วิธีรับยา</Text>
                  <Text style={styles.infoValue}>
                    {getDeliveryText(prescription.deliveryMethod)}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Medications */}
          <Text style={styles.sectionTitle}>💊 รายการยา ({prescription.medications.length} รายการ)</Text>

          {prescription.medications.map((med, index) => (
            <View key={index} style={styles.medCard}>
              <View style={styles.medHeader}>
                <View style={styles.medIconWrap}>
                  <Ionicons name="medkit" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.medName}>{med.name}</Text>
              </View>

              <View style={styles.medDetails}>
                <View style={styles.medDetailRow}>
                  <Ionicons name="flask" size={14} color={Colors.gray500} />
                  <Text style={styles.medDetailLabel}>ขนาดยา:</Text>
                  <Text style={styles.medDetailValue}>{med.dosage}</Text>
                </View>
                <View style={styles.medDetailRow}>
                  <Ionicons name="repeat" size={14} color={Colors.gray500} />
                  <Text style={styles.medDetailLabel}>ความถี่:</Text>
                  <Text style={styles.medDetailValue}>{med.frequency}</Text>
                </View>
                <View style={styles.medDetailRow}>
                  <Ionicons name="calendar" size={14} color={Colors.gray500} />
                  <Text style={styles.medDetailLabel}>ระยะเวลา:</Text>
                  <Text style={styles.medDetailValue}>{med.duration}</Text>
                </View>
              </View>

              <View style={styles.medInstructions}>
                <Ionicons name="information-circle" size={14} color={Colors.warning} />
                <Text style={styles.medInstructionsText}>{med.instructions}</Text>
              </View>
            </View>
          ))}

          {/* Delivery Options (if pending) */}
          {prescription.status === 'pending' && (
            <View style={styles.deliverySection}>
              <Text style={styles.sectionTitle}>📦 เลือกวิธีรับยา</Text>
              <TouchableOpacity
                style={styles.deliveryOption}
                onPress={() => Alert.alert('สำเร็จ', 'ระบบจะจัดส่งยาไปที่บ้านของคุณ')}
              >
                <View style={styles.deliveryIconWrap}>
                  <Text style={styles.deliveryEmoji}>🏠</Text>
                </View>
                <View style={styles.deliveryContent}>
                  <Text style={styles.deliveryTitle}>ส่งยาถึงบ้าน</Text>
                  <Text style={styles.deliveryDesc}>
                    จัดส่งภายใน 2-3 ชั่วโมง (ค่าส่ง 50 บาท)
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray300} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deliveryOption}
                onPress={() =>
                  Alert.alert('สำเร็จ', 'คุณสามารถรับยาที่คลินิก/ร้านยาใกล้บ้าน')
                }
              >
                <View style={styles.deliveryIconWrap}>
                  <Text style={styles.deliveryEmoji}>🏪</Text>
                </View>
                <View style={styles.deliveryContent}>
                  <Text style={styles.deliveryTitle}>รับยาที่คลินิก/ร้านยา</Text>
                  <Text style={styles.deliveryDesc}>
                    รับได้ทันทีที่คลินิก หรือร้านยาใกล้บ้าน
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray300} />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.gray900,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 20,
  },

  // Info Card
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 18,
    marginBottom: 24,
    ...Layout.shadow.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.gray500,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.gray900,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },

  // Section
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.gray900,
    marginBottom: 14,
  },

  // Medication Card
  medCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 16,
    marginBottom: 10,
    ...Layout.shadow.small,
  },
  medHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  medName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.gray900,
    flex: 1,
  },
  medDetails: {
    gap: 6,
    marginBottom: 10,
  },
  medDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medDetailLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray500,
  },
  medDetailValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.gray800,
  },
  medInstructions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warning + '10',
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  medInstructionsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.warning,
    flex: 1,
    lineHeight: 18,
  },

  // Delivery
  deliverySection: {
    marginTop: 12,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 16,
    marginBottom: 10,
    ...Layout.shadow.small,
  },
  deliveryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deliveryEmoji: {
    fontSize: 22,
  },
  deliveryContent: {
    flex: 1,
  },
  deliveryTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.gray900,
  },
  deliveryDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
});
