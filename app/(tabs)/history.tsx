import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  mockAppointments,
  getUpcomingAppointments,
  getPastAppointments,
} from '../../data/mockAppointments';
import { mockDentalRecords, mockPrescriptions } from '../../data/mockDentalRecords';
import { aiCareReminders } from '../../data/mockUserProfile';
import { LinearGradient } from 'expo-linear-gradient';

type TabKey = 'appointments' | 'records' | 'prescriptions';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'appointments', label: 'นัดหมาย' },
  { key: 'records', label: 'ประวัติทำฟัน' },
  { key: 'prescriptions', label: 'ใบสั่งยา' },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { label: 'ยืนยันแล้ว', color: Colors.primary, bg: Colors.primaryLight };
    case 'completed':
      return { label: 'เสร็จสิ้น', color: Colors.success, bg: '#E8F5E9' };
    case 'cancelled':
      return { label: 'ยกเลิก', color: Colors.danger, bg: '#FFEBEE' };
    case 'waiting':
      return { label: 'รอยืนยัน', color: Colors.warning, bg: '#FFF3E0' };
    default:
      return { label: status, color: Colors.gray500, bg: Colors.gray100 };
  }
};

const getPrescriptionStatusConfig = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'รอจัดส่ง', color: Colors.warning, bg: '#FFF3E0' };
    case 'delivered':
      return { label: 'จัดส่งแล้ว', color: Colors.success, bg: '#E8F5E9' };
    case 'collected':
      return { label: 'รับแล้ว', color: Colors.primary, bg: Colors.primaryLight };
    default:
      return { label: status, color: Colors.gray500, bg: Colors.gray100 };
  }
};

const getDeliveryMethodLabel = (method: string | null) => {
  switch (method) {
    case 'home':
      return '🏠 จัดส่งถึงบ้าน';
    case 'clinic':
      return '🏥 รับที่คลินิก';
    case 'pharmacy':
      return '💊 รับที่ร้านยา';
    default:
      return '';
  }
};

const formatThaiDate = (dateStr: string) => {
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
};

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('appointments');

  const upcomingAppointments = useMemo(() => getUpcomingAppointments(), []);
  const pastAppointments = useMemo(() => getPastAppointments(), []);

  // Get highest priority AI care reminder
  const topReminder = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sorted = [...aiCareReminders].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    return sorted[0] || null;
  }, []);

  const renderAICareBanner = () => {
    if (!topReminder) return null;

    return (
      <LinearGradient
        colors={Colors.gradientBlue}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.careBanner}
      >
        <View style={styles.careBannerContent}>
          <View style={styles.careBannerIconWrap}>
            <Ionicons
              name={(topReminder.icon as any) || 'sparkles'}
              size={24}
              color={Colors.white}
            />
          </View>
          <View style={styles.careBannerTextWrap}>
            <Text style={styles.careBannerTitle}>{topReminder.title}</Text>
            <Text style={styles.careBannerMessage}>{topReminder.message}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.careBannerBtn} activeOpacity={0.8}>
          <Text style={styles.careBannerBtnText}>ดูเพิ่มเติม</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  const renderSegmentControl = () => (
    <View style={styles.segmentContainer}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.segmentTab, isActive && styles.segmentTabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderAppointmentCard = (apt: (typeof mockAppointments)[0]) => {
    const statusConfig = getStatusConfig(apt.status);

    return (
      <View key={apt.id} style={styles.appointmentCard}>
        <View style={styles.appointmentCardLeft}>
          <View style={styles.dateBox}>
            <Text style={styles.dateBoxDay}>
              {new Date(apt.date).getDate()}
            </Text>
            <Text style={styles.dateBoxMonth}>
              {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][new Date(apt.date).getMonth()]}
            </Text>
          </View>
        </View>
        <View style={styles.appointmentCardRight}>
          <View style={styles.appointmentCardHeader}>
            <Text style={styles.appointmentServiceName}>{apt.serviceName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
          <View style={styles.appointmentInfoRow}>
            <Ionicons name="time-outline" size={14} color={Colors.gray500} />
            <Text style={styles.appointmentInfoText}>
              {apt.time} น. ({apt.duration} นาที)
            </Text>
          </View>
          <View style={styles.appointmentInfoRow}>
            <Ionicons name="person-outline" size={14} color={Colors.gray500} />
            <Text style={styles.appointmentInfoText}>{apt.doctorName}</Text>
          </View>
          <View style={styles.appointmentInfoRow}>
            <Ionicons name="location-outline" size={14} color={Colors.gray500} />
            <Text style={styles.appointmentInfoText} numberOfLines={1}>
              {apt.clinicName}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAppointmentsTab = () => (
    <View>
      {upcomingAppointments.length > 0 && (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.sectionTitle}>กำลังจะถึง</Text>
            <Text style={styles.sectionCount}>{upcomingAppointments.length}</Text>
          </View>
          {upcomingAppointments.map(renderAppointmentCard)}
        </View>
      )}

      {pastAppointments.length > 0 && (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionDot, { backgroundColor: Colors.gray500 }]} />
            <Text style={styles.sectionTitle}>ที่ผ่านมา</Text>
            <Text style={styles.sectionCount}>{pastAppointments.length}</Text>
          </View>
          {pastAppointments.map(renderAppointmentCard)}
        </View>
      )}

      {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color={Colors.gray300} />
          <Text style={styles.emptyStateText}>ยังไม่มีนัดหมาย</Text>
        </View>
      )}
    </View>
  );

  const renderRecordsTab = () => (
    <View style={styles.timelineContainer}>
      {mockDentalRecords.map((record, index) => {
        const isLast = index === mockDentalRecords.length - 1;
        return (
          <View key={record.id} style={styles.timelineItem}>
            {/* Vertical line */}
            <View style={styles.timelineLeft}>
              <View style={styles.timelineDot} />
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            {/* Content */}
            <View style={styles.timelineContent}>
              <Text style={styles.timelineDate}>{formatThaiDate(record.date)}</Text>
              <View style={styles.timelineCard}>
                <Text style={styles.timelineTreatment}>{record.treatment}</Text>
                <Text style={styles.timelineTreatmentEn}>{record.treatmentEn}</Text>

                <View style={styles.timelineDetailRow}>
                  <Ionicons name="person-outline" size={14} color={Colors.gray500} />
                  <Text style={styles.timelineDetailText}>{record.doctorName}</Text>
                </View>

                <View style={styles.timelineDetailRow}>
                  <Ionicons name="medical-outline" size={14} color={Colors.gray500} />
                  <Text style={styles.timelineDetailText}>ซี่ฟัน: {record.tooth}</Text>
                </View>

                <Text style={styles.timelineNotes}>{record.notes}</Text>

                {record.hasXray && (
                  <TouchableOpacity style={styles.xrayButton} activeOpacity={0.7}>
                    <Text style={styles.xrayButtonText}>📷 ดูฟิล์ม X-ray</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderPrescriptionsTab = () => (
    <View>
      {mockPrescriptions.map((rx) => {
        const statusConfig = getPrescriptionStatusConfig(rx.status);
        return (
          <View key={rx.id} style={styles.prescriptionCard}>
            <View style={styles.prescriptionHeader}>
              <View>
                <Text style={styles.prescriptionDate}>{formatThaiDate(rx.date)}</Text>
                <Text style={styles.prescriptionDoctor}>{rx.doctorName}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            <View style={styles.prescriptionDiagnosis}>
              <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
              <Text style={styles.prescriptionDiagnosisText}>{rx.diagnosis}</Text>
            </View>

            <View style={styles.prescriptionMedsInfo}>
              <Ionicons name="medkit-outline" size={14} color={Colors.gray500} />
              <Text style={styles.prescriptionMedsCount}>
                {rx.medications.length} รายการยา
              </Text>
            </View>

            {rx.medications.map((med, i) => (
              <View key={i} style={styles.medicationItem}>
                <View style={styles.medDot} />
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDetail}>
                    {med.dosage} | {med.frequency} | {med.duration}
                  </Text>
                </View>
              </View>
            ))}

            {rx.deliveryMethod && (
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryText}>
                  {getDeliveryMethodLabel(rx.deliveryMethod)}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      {mockPrescriptions.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color={Colors.gray300} />
          <Text style={styles.emptyStateText}>ยังไม่มีใบสั่งยา</Text>
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return renderAppointmentsTab();
      case 'records':
        return renderRecordsTab();
      case 'prescriptions':
        return renderPrescriptionsTab();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ประวัติและการดูแล</Text>
        <Text style={styles.headerSubtitle}>History & Care</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Care Banner */}
        {renderAICareBanner()}

        {/* Segment Control */}
        {renderSegmentControl()}

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.gray900,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 2,
  },

  // AI Care Banner
  careBanner: {
    marginHorizontal: Layout.screenPadding,
    marginTop: 16,
    borderRadius: Layout.cardRadius,
    padding: 18,
    ...Layout.shadow.medium,
  },
  careBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  careBannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  careBannerTextWrap: {
    flex: 1,
  },
  careBannerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 4,
  },
  careBannerMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  careBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
    gap: 4,
  },
  careBannerBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },

  // Segment Control
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: Layout.screenPadding,
    marginTop: 20,
    marginBottom: 16,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    padding: 3,
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentTabActive: {
    backgroundColor: Colors.primary,
    ...Layout.shadow.small,
  },
  segmentText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.gray500,
  },
  segmentTextActive: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
  },

  // Section
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPadding,
    marginBottom: 12,
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    flex: 1,
  },
  sectionCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.gray500,
    backgroundColor: Colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Appointment Card
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Layout.screenPadding,
    marginBottom: 10,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    ...Layout.shadow.small,
  },
  appointmentCardLeft: {
    marginRight: 14,
  },
  dateBox: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 8,
  },
  dateBoxDay: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.primary,
  },
  dateBoxMonth: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.primary,
    marginTop: 1,
  },
  appointmentCardRight: {
    flex: 1,
  },
  appointmentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appointmentServiceName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.gray900,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  appointmentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  appointmentInfoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray500,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.gray500,
  },

  // Timeline (Records)
  timelineContainer: {
    paddingHorizontal: Layout.screenPadding,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.gray300,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineDate: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 6,
  },
  timelineCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    ...Layout.shadow.small,
  },
  timelineTreatment: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.gray900,
    marginBottom: 2,
  },
  timelineTreatmentEn: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 10,
  },
  timelineDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  timelineDetailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray500,
  },
  timelineNotes: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray800,
    marginTop: 8,
    lineHeight: 19,
    backgroundColor: Colors.offWhite,
    padding: 10,
    borderRadius: 8,
  },
  xrayButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  xrayButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.primary,
  },

  // Prescriptions
  prescriptionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.screenPadding,
    marginBottom: 12,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    ...Layout.shadow.small,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  prescriptionDate: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.gray900,
  },
  prescriptionDoctor: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 2,
  },
  prescriptionDiagnosis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  prescriptionDiagnosisText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.primary,
    flex: 1,
  },
  prescriptionMedsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  prescriptionMedsCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.gray500,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 4,
    marginBottom: 8,
    gap: 10,
  },
  medDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.gray900,
  },
  medicationDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
    lineHeight: 17,
  },
  deliveryRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  deliveryText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.gray800,
  },
});
