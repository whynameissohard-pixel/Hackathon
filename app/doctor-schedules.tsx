import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { mockDoctors, Doctor } from '../data/mockDoctors';
import { mockServices, Service } from '../data/mockServices';

const { width } = Dimensions.get('window');

export default function DoctorSchedulesScreen() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(mockDoctors[0]);
  const [selectedDay, setSelectedDay] = useState<string>(mockDoctors[0].availableDays[0] || 'เสาร์');
  const [selectedService, setSelectedService] = useState<Service>(mockServices[0]);

  // Update selected day when doctor changes if the previous selected day is not available for new doctor
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    if (doctor.availableDays.length > 0) {
      if (!doctor.availableDays.includes(selectedDay)) {
        setSelectedDay(doctor.availableDays[0]);
      }
    }
  };

  const handleTimeSlotPress = (timeSlot: string) => {
    const today = new Date();
    const targetDayIndex = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'].indexOf(selectedDay);
    const currentDayIndex = today.getDay();
    
    // Calculate days difference
    let diff = targetDayIndex - currentDayIndex;
    if (diff <= 0) diff += 7; // Next week if today or in past
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const formattedDate = `วัน${selectedDay}ที่ ${targetDate.getDate()} ${months[targetDate.getMonth()]} ${targetDate.getFullYear() + 543}`;

    Alert.alert(
      '✅ ยืนยันการนัดหมาย',
      `แพทย์: ${selectedDoctor.name}\nบริการ: ${selectedService.name}\nวันที่: ${formattedDate}\nเวลา: ${timeSlot} น.`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ยืนยันการจอง',
          onPress: () => {
            router.push({
              pathname: '/booking-confirm',
              params: {
                serviceName: selectedService.name,
                date: formattedDate,
                time: timeSlot,
                doctorName: selectedDoctor.name,
                duration: selectedService.duration.toString(),
                price: selectedService.priceRange,
              },
            });
          },
        },
      ]
    );
  };

  const daysOfWeek = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.gray800} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>ตารางทันตแพทย์</Text>
            <Text style={styles.headerSubtitle}>Doctor Schedules & Profiles</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Doctor Selector */}
          <Text style={styles.sectionTitle}>เลือกทันตแพทย์</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.doctorList}
          >
            {mockDoctors.map((doc) => {
              const isSelected = doc.id === selectedDoctor.id;
              return (
                <TouchableOpacity
                  key={doc.id}
                  style={[
                    styles.doctorCard,
                    isSelected && styles.doctorCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleDoctorSelect(doc)}
                >
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{doc.avatar}</Text>
                    {doc.isOnline && <View style={styles.onlineIndicator} />}
                  </View>
                  <Text style={[styles.docName, isSelected && styles.textWhite]}>
                    {doc.name.replace('ทพญ. ', '').replace('ทพ. ', '')}
                  </Text>
                  <Text style={[styles.docSpecialty, isSelected ? styles.textLightBlue : styles.textGray]}>
                    {doc.specialty}
                  </Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={isSelected ? '#FFF' : '#FFB300'} />
                    <Text style={[styles.ratingText, isSelected && styles.textWhite]}>{doc.rating}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Doctor Detail Card */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <View style={styles.detailAvatarBg}>
                <Text style={styles.detailAvatarEmoji}>{selectedDoctor.avatar}</Text>
              </View>
              <View style={styles.detailDocMeta}>
                <View style={styles.detailNameRow}>
                  <Text style={styles.detailDocName}>{selectedDoctor.name}</Text>
                  {selectedDoctor.isOnline && (
                    <View style={styles.onlineBadge}>
                      <Text style={styles.onlineBadgeText}>ออนไลน์</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.detailDocSub}>{selectedDoctor.nameEn}</Text>
                <Text style={styles.detailDocSpecialty}>🦷 {selectedDoctor.specialty} ({selectedDoctor.specialtyEn})</Text>
                <Text style={styles.detailDocExp}>⏳ ประสบการณ์ {selectedDoctor.experience} ปี</Text>
              </View>
            </View>

            <View style={styles.divider} />
            
            <Text style={styles.bioTitle}>ประวัติย่อ</Text>
            <Text style={styles.bioText}>{selectedDoctor.biography}</Text>
          </View>

          {/* Service Selector */}
          <Text style={styles.sectionTitle}>เลือกประเภทบริการเพื่อจอง</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScroll}
          >
            {mockServices.map((service) => {
              const isSelected = service.id === selectedService.id;
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceChip,
                    isSelected && styles.serviceChipSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedService(service)}
                >
                  <Ionicons
                    name={service.icon as any}
                    size={16}
                    color={isSelected ? '#FFF' : service.color}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.serviceChipText, isSelected && styles.textWhite]}>
                    {service.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Day Selector */}
          <Text style={styles.sectionTitle}>เลือกวันเข้าตรวจ</Text>
          <View style={styles.daySelectorContainer}>
            {daysOfWeek.map((day) => {
              const isAvailable = selectedDoctor.availableDays.includes(day);
              const isSelected = day === selectedDay;
              
              return (
                <TouchableOpacity
                  key={day}
                  disabled={!isAvailable}
                  style={[
                    styles.dayButton,
                    !isAvailable && styles.dayButtonDisabled,
                    isSelected && styles.dayButtonSelected,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      !isAvailable && styles.dayButtonTextDisabled,
                      isSelected && styles.dayButtonTextSelected,
                    ]}
                  >
                    {day.substring(0, 3)}
                  </Text>
                  <View
                    style={[
                      styles.dayDot,
                      isAvailable ? (isSelected ? styles.dayDotSelected : styles.dayDotAvailable) : styles.dayDotDisabled,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Available Slots */}
          <Text style={styles.sectionTitle}>เวลาว่างที่จองได้</Text>
          <View style={styles.slotsContainer}>
            {selectedDoctor.timeSlots[selectedDay] && selectedDoctor.timeSlots[selectedDay].length > 0 ? (
              <View style={styles.slotsGrid}>
                {selectedDoctor.timeSlots[selectedDay].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.timeSlotBtn}
                    activeOpacity={0.7}
                    onPress={() => handleTimeSlotPress(time)}
                  >
                    <Ionicons name="time-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.timeSlotText}>{time} น.</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noSlotsCard}>
                <Ionicons name="calendar-outline" size={32} color={Colors.gray500} />
                <Text style={styles.noSlotsText}>
                  คุณหมอไม่มีตารางตรวจในวัน{selectedDay}ค่ะ
                </Text>
                <Text style={styles.noSlotsSub}>กรุณาเลือกวันที่มีจุดสีน้ำเงินใต้ปุ่มวัน</Text>
              </View>
            )}
          </View>
          
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
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
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.gray900,
    marginTop: 20,
    marginBottom: 12,
  },
  
  // Doctor List Carousel
  doctorList: {
    paddingRight: 16,
  },
  doctorCard: {
    width: width * 0.32,
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.gray300,
    ...Layout.shadow.small,
  },
  doctorCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 32,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  docName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.gray900,
    textAlign: 'center',
    marginBottom: 2,
  },
  docSpecialty: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.gray800,
  },
  
  // Doctor Detail Card
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.gray300,
    ...Layout.shadow.medium,
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailAvatarBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailAvatarEmoji: {
    fontSize: 36,
  },
  detailDocMeta: {
    flex: 1,
  },
  detailNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailDocName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.gray900,
  },
  onlineBadge: {
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  onlineBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.success,
  },
  detailDocSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 4,
  },
  detailDocSpecialty: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.primary,
    marginBottom: 2,
  },
  detailDocExp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray300,
    marginVertical: 12,
  },
  bioTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.gray900,
    marginBottom: 4,
  },
  bioText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray800,
    lineHeight: 18,
  },

  // Services Carousel
  servicesScroll: {
    paddingRight: 16,
    marginBottom: 4,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  serviceChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  serviceChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.gray800,
  },
  
  // Day Selector
  daySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: Layout.cardRadius,
    borderWidth: 1,
    borderColor: Colors.gray300,
    ...Layout.shadow.small,
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  dayButtonDisabled: {
    opacity: 0.3,
  },
  dayButtonSelected: {
    backgroundColor: Colors.primaryLight,
  },
  dayButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.gray800,
    marginBottom: 4,
  },
  dayButtonTextDisabled: {
    color: Colors.gray500,
  },
  dayButtonTextSelected: {
    color: Colors.primary,
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dayDotAvailable: {
    backgroundColor: Colors.primary,
  },
  dayDotSelected: {
    backgroundColor: Colors.primary,
  },
  dayDotDisabled: {
    backgroundColor: 'transparent',
  },

  // Available Slots Grid
  slotsContainer: {
    marginTop: 4,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 12,
    paddingVertical: 12,
    width: (width - 44) / 3,
    ...Layout.shadow.small,
  },
  timeSlotText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.gray800,
  },
  noSlotsCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray300,
    ...Layout.shadow.small,
  },
  noSlotsText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.gray800,
    marginTop: 8,
    textAlign: 'center',
  },
  noSlotsSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },
  
  // Helpers
  textWhite: {
    color: '#FFF',
  },
  textLightBlue: {
    color: '#E8F0FE',
  },
  textGray: {
    color: Colors.gray500,
  },
});
