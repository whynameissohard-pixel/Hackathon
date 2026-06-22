import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { getNextAppointment } from '../../data/mockAppointments';
import { mockServices } from '../../data/mockServices';
import { mockDoctors } from '../../data/mockDoctors';
import { aiCareReminders } from '../../data/mockUserProfile';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const nextAppointment = getNextAppointment();
  const onlineDoctors = mockDoctors.filter((d) => d.isOnline);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardSlide = useRef(new Animated.Value(50)).current;
  const cardFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(cardSlide, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(cardFade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const formatThaiDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return `วัน${days[date.getDay()]}ที่ ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View>
            <Text style={styles.logo}>
              Dent<Text style={styles.logoAccent}>AI</Text>
            </Text>
            <Text style={styles.subtitle}>ทันตกรรมอัจฉริยะ</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.gray800} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Next Appointment E-Card */}
        <Animated.View
          style={{
            opacity: cardFade,
            transform: [{ translateY: cardSlide }],
          }}
        >
          {nextAppointment ? (
            <TouchableOpacity activeOpacity={0.9}>
              <LinearGradient
                colors={['#1A73E8', '#0D47A1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.appointmentCard}
              >
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentBadge}>
                    <Ionicons name="calendar" size={14} color={Colors.primary} />
                    <Text style={styles.appointmentBadgeText}>นัดหมายครั้งถัดไป</Text>
                  </View>
                  <Text style={styles.eCardLabel}>E-CARD</Text>
                </View>

                <Text style={styles.appointmentService}>
                  {nextAppointment.serviceName}
                </Text>
                <Text style={styles.appointmentServiceEn}>
                  {nextAppointment.serviceNameEn}
                </Text>

                <View style={styles.appointmentDetails}>
                  <View style={styles.appointmentDetailRow}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.appointmentDetailText}>
                      {formatThaiDate(nextAppointment.date)}
                    </Text>
                  </View>
                  <View style={styles.appointmentDetailRow}>
                    <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.appointmentDetailText}>
                      {nextAppointment.time} น. ({nextAppointment.duration} นาที)
                    </Text>
                  </View>
                  <View style={styles.appointmentDetailRow}>
                    <Ionicons name="person-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.appointmentDetailText}>
                      {nextAppointment.doctorName}
                    </Text>
                  </View>
                  <View style={styles.appointmentDetailRow}>
                    <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.appointmentDetailText}>
                      {nextAppointment.clinicName}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentActions}>
                  <TouchableOpacity
                    style={styles.appointmentActionBtn}
                    onPress={() => Alert.alert('นำทาง', 'เปิด Google Maps ไปยังคลินิก')}
                  >
                    <Ionicons name="navigate" size={16} color={Colors.primary} />
                    <Text style={styles.appointmentActionText}>นำทาง</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.appointmentActionBtn, styles.appointmentActionOutline]}
                    onPress={() => Alert.alert('เลื่อนนัด', 'ไปที่แชทเพื่อเลื่อนนัดหมาย')}
                  >
                    <Ionicons name="swap-horizontal" size={16} color="#fff" />
                    <Text style={[styles.appointmentActionText, { color: '#fff' }]}>
                      เลื่อนนัด
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.noAppointmentCard}>
              <Ionicons name="calendar-outline" size={48} color={Colors.gray300} />
              <Text style={styles.noAppointmentText}>ยังไม่มีนัดหมาย</Text>
              <Text style={styles.noAppointmentSubtext}>
                กดปุ่มด้านล่างเพื่อจองคิวทำฟันกับ AI
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionPrimary}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <LinearGradient
              colors={['#1A73E8', '#0D47A1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.quickActionGradient}
            >
              <View style={styles.quickActionIconWrap}>
                <Ionicons name="sparkles" size={24} color="#fff" />
              </View>
              <View style={styles.quickActionTextWrap}>
                <Text style={styles.quickActionTitle}>จองคิวใหม่ด้วย AI</Text>
                <Text style={styles.quickActionSubtitle}>AI Booking</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionSecondary}
            activeOpacity={0.85}
            onPress={() => router.push('/consultation')}
          >
            <View style={styles.quickActionSecondaryInner}>
              <View style={[styles.quickActionIconWrap, styles.quickActionIconSecondary]}>
                <Ionicons name="medical" size={24} color={Colors.primary} />
              </View>
              <View style={styles.quickActionTextWrap}>
                <Text style={styles.quickActionTitleSecondary}>ปรึกษาหมอฟันด่วน</Text>
                <View style={styles.doctorOnlineStatus}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>
                    มีหมอออนไลน์ {onlineDoctors.length} ท่าน (พร้อมคุยใน 5 นาที)
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray500} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionSecondary}
            activeOpacity={0.85}
            onPress={() => router.push('/doctor-schedules')}
          >
            <View style={styles.quickActionSecondaryInner}>
              <View style={[styles.quickActionIconWrap, styles.quickActionIconCalendar]}>
                <Ionicons name="calendar-number" size={24} color="#FF9800" />
              </View>
              <View style={styles.quickActionTextWrap}>
                <Text style={styles.quickActionTitleSecondary}>ตารางทันตแพทย์</Text>
                <View style={styles.doctorOnlineStatus}>
                  <Text style={styles.onlineText}>
                    เลือกจองคิวกับแพทย์ที่ท่านต้องการโดยตรง
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray500} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>บริการยอดนิยม</Text>
            <Text style={styles.sectionSubtitle}>Popular Services</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScroll}
          >
            {mockServices.slice(0, 6).map((service, index) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/chat')}
              >
                <View
                  style={[styles.serviceIconWrap, { backgroundColor: service.color + '15' }]}
                >
                  <Ionicons
                    name={service.icon as any}
                    size={24}
                    color={service.color}
                  />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceNameEn}>{service.nameEn}</Text>
                <View style={styles.serviceInfo}>
                  <Ionicons name="time-outline" size={12} color={Colors.gray500} />
                  <Text style={styles.serviceInfoText}>{service.duration} นาที</Text>
                </View>
                <Text style={styles.servicePrice}>฿{service.priceRange}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Care Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🤖 AI แจ้งเตือนดูแลสุขภาพ</Text>
            <Text style={styles.sectionSubtitle}>AI Care Reminders</Text>
          </View>
          {aiCareReminders.map((reminder) => (
            <TouchableOpacity key={reminder.id} style={styles.reminderCard} activeOpacity={0.85}>
              <View
                style={[
                  styles.reminderIconWrap,
                  {
                    backgroundColor:
                      reminder.priority === 'high'
                        ? Colors.danger + '15'
                        : reminder.priority === 'medium'
                        ? Colors.warning + '15'
                        : Colors.primaryLight,
                  },
                ]}
              >
                <Ionicons
                  name={reminder.icon as any}
                  size={20}
                  color={
                    reminder.priority === 'high'
                      ? Colors.danger
                      : reminder.priority === 'medium'
                      ? Colors.warning
                      : Colors.primary
                  }
                />
              </View>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderMessage}>{reminder.message}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.gray300} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
  logo: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.gray900,
  },
  logoAccent: {
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow.medium,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#fff',
  },

  // Appointment Card
  appointmentCard: {
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding + 4,
    marginBottom: 20,
    ...Layout.shadow.large,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  appointmentBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.primary,
  },
  eCardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  appointmentService: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: '#fff',
    marginBottom: 2,
  },
  appointmentServiceEn: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  appointmentDetails: {
    gap: 8,
    marginBottom: 16,
  },
  appointmentDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appointmentDetailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  appointmentActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: Layout.buttonRadius,
    gap: 6,
  },
  appointmentActionOutline: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appointmentActionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },

  // No Appointment
  noAppointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    ...Layout.shadow.small,
  },
  noAppointmentText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.gray800,
    marginTop: 12,
  },
  noAppointmentSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 4,
  },

  // Quick Actions
  quickActions: {
    gap: 12,
    marginBottom: 28,
  },
  quickActionPrimary: {
    borderRadius: Layout.cardRadius,
    overflow: 'hidden',
    ...Layout.shadow.medium,
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: Layout.cardRadius,
  },
  quickActionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIconSecondary: {
    backgroundColor: Colors.primaryLight,
  },
  quickActionIconCalendar: {
    backgroundColor: '#FFF3E0', // light orange
  },
  quickActionTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  quickActionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: '#fff',
  },
  quickActionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  quickActionSecondary: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    ...Layout.shadow.small,
  },
  quickActionSecondaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  quickActionTitleSecondary: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.gray900,
  },
  doctorOnlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.success,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.gray900,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },

  // Service Cards
  servicesScroll: {
    paddingRight: 20,
    gap: 12,
  },
  serviceCard: {
    width: 140,
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 14,
    ...Layout.shadow.small,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.gray900,
    marginBottom: 2,
  },
  serviceNameEn: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.gray500,
    marginBottom: 8,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  serviceInfoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.gray500,
  },
  servicePrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.primary,
  },

  // Reminder Cards
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 14,
    marginBottom: 8,
    ...Layout.shadow.small,
  },
  reminderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  reminderTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.gray900,
  },
  reminderMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
});
