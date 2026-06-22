import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';

export default function BookingConfirmScreen() {
  const params = useLocalSearchParams<{
    serviceName?: string;
    date?: string;
    time?: string;
    doctorName?: string;
    duration?: string;
    price?: string;
  }>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(checkAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Success Animation */}
          <Animated.View
            style={[
              styles.successCircle,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#00C853', '#009624']}
              style={styles.successGradient}
            >
              <Animated.View
                style={{ transform: [{ scale: checkAnim }] }}
              >
                <Ionicons name="checkmark" size={48} color="#fff" />
              </Animated.View>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.successTitle}>จองคิวสำเร็จ! 🎉</Text>
            <Text style={styles.successSubtitle}>Booking Confirmed</Text>

            {/* Booking Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="medical" size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>บริการ</Text>
                  <Text style={styles.detailValue}>
                    {params.serviceName || 'ขูดหินปูน'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="calendar" size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>วันที่</Text>
                  <Text style={styles.detailValue}>
                    {params.date || 'วันเสาร์ที่ 21 มิ.ย. 2569'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>เวลา</Text>
                  <Text style={styles.detailValue}>
                    {params.time || '10:00'} น. ({params.duration || '30'} นาที)
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="person" size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>ทันตแพทย์</Text>
                  <Text style={styles.detailValue}>
                    {params.doctorName || 'ทพญ. สมศรี รักษาฟัน'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="location" size={18} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>สถานที่</Text>
                  <Text style={styles.detailValue}>DentAI Clinic สาขาสยาม</Text>
                  <Text style={styles.detailSubvalue}>
                    123 ถ.พระราม 1 ปทุมวัน กรุงเทพฯ
                  </Text>
                </View>
              </View>

              {params.price && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Ionicons name="wallet" size={18} color={Colors.primary} />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>ค่าบริการประเมิน</Text>
                      <Text style={styles.detailValue}>{params.price}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Reminder Info */}
            <View style={styles.reminderBox}>
              <Ionicons name="notifications" size={18} color={Colors.primary} />
              <Text style={styles.reminderText}>
                ระบบจะส่งแจ้งเตือนให้คุณก่อนถึงวันนัดหมาย 1 วัน และ 2 ชั่วโมง
              </Text>
            </View>
          </Animated.View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.primaryBtnText}>กลับหน้าแรก</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.replace('/(tabs)/history')}
            >
              <Text style={styles.secondaryBtnText}>ดูนัดหมายทั้งหมด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    marginBottom: 24,
  },
  successGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.gray900,
    textAlign: 'center',
    marginBottom: 4,
  },
  successSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.gray500,
    textAlign: 'center',
    marginBottom: 28,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 20,
    ...Layout.shadow.medium,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.gray900,
  },
  detailSubvalue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray100,
  },
  reminderBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 28,
  },
  reminderText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 18,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  secondaryBtn: {
    backgroundColor: Colors.white,
    borderRadius: Layout.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.gray300,
  },
  secondaryBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.gray800,
  },
});
