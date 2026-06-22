import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { consultationPreScreenQuestions } from '../data/aiChatbot';

// ── Types ────────────────────────────────────────
interface ConsultMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'doctor' | 'system';
  timestamp: Date;
  type: 'text' | 'system' | 'action_card';
  actionType?: 'booking_link' | 'prescription';
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const DOCTOR_NAME = 'ทพญ. สมศรี รักษาฟัน';
const DOCTOR_AVATAR = '👩‍⚕️';

const mockPrescription: Medication[] = [
  {
    name: 'Amoxicillin 500mg',
    dosage: '1 แคปซูล',
    frequency: 'วันละ 3 ครั้ง หลังอาหาร',
    duration: '5 วัน',
  },
  {
    name: 'Ibuprofen 400mg',
    dosage: '1 เม็ด',
    frequency: 'วันละ 3 ครั้ง หลังอาหาร (เมื่อปวด)',
    duration: '3 วัน',
  },
  {
    name: 'Chlorhexidine Mouthwash',
    dosage: '15 ml',
    frequency: 'บ้วนปาก วันละ 2 ครั้ง',
    duration: '7 วัน',
  },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

// ── Component ────────────────────────────────────
export default function ConsultationScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [messages, setMessages] = useState<ConsultMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<'prescreening' | 'handoff' | 'doctor'>('prescreening');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionDelivery, setPrescriptionDelivery] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize with first pre-screening question
  useEffect(() => {
    const initMessages: ConsultMessage[] = [
      {
        id: generateId(),
        text: `สวัสดีค่ะ 🤖 ดิฉันเป็น AI ผู้ช่วยคัดกรองอาการเบื้องต้น\n\nก่อนที่คุณหมอจะเข้าร่วม ขอสอบถามอาการคุณสักครู่นะคะ`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: consultationPreScreenQuestions[0],
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
    ];
    setMessages(initMessages);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const addMessage = useCallback(
    (msg: ConsultMessage) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  const addMessages = useCallback(
    (msgs: ConsultMessage[]) => {
      setMessages((prev) => [...prev, ...msgs]);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  // Handle sending a message
  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const userMsg: ConsultMessage = {
      id: generateId(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };
    addMessage(userMsg);
    setInputText('');

    if (phase === 'prescreening') {
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < consultationPreScreenQuestions.length) {
        // Ask next question
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage({
            id: generateId(),
            text: consultationPreScreenQuestions[nextIndex],
            sender: 'ai',
            timestamp: new Date(),
            type: 'text',
          });
          setCurrentQuestionIndex(nextIndex);
        }, 800);
      } else {
        // All questions answered → handoff
        setPhase('handoff');
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          addMessage({
            id: generateId(),
            text: 'กำลังส่งข้อมูลให้คุณหมอ... 🔄',
            sender: 'system',
            timestamp: new Date(),
            type: 'system',
          });

          // Doctor joins after a brief delay
          setTimeout(() => {
            setPhase('doctor');
            addMessages([
              {
                id: generateId(),
                text: `${DOCTOR_NAME} เข้าร่วมการสนทนาแล้ว`,
                sender: 'system',
                timestamp: new Date(),
                type: 'system',
              },
              {
                id: generateId(),
                text: `สวัสดีค่ะคุณสมชาย ${DOCTOR_AVATAR}\n\nดิฉันได้รับข้อมูลเบื้องต้นจาก AI แล้วนะคะ\n\nจากอาการที่เล่ามา น่าจะเป็นอาการปวดฟันจากฟันผุที่ลึกถึงโพรงประสาทฟัน แนะนำให้มาตรวจที่คลินิกเพื่อ X-ray ดูเพิ่มเติมค่ะ`,
                sender: 'doctor',
                timestamp: new Date(),
                type: 'text',
              },
            ]);

            // Doctor sends action cards after a moment
            setTimeout(() => {
              addMessages([
                {
                  id: generateId(),
                  text: '📋 ส่งลิงก์นัดหมาย',
                  sender: 'doctor',
                  timestamp: new Date(),
                  type: 'action_card',
                  actionType: 'booking_link',
                },
                {
                  id: generateId(),
                  text: '💊 ออกใบสั่งยา',
                  sender: 'doctor',
                  timestamp: new Date(),
                  type: 'action_card',
                  actionType: 'prescription',
                },
              ]);
            }, 1500);
          }, 2000);
        }, 1000);
      }
    } else if (phase === 'doctor') {
      // Mock doctor response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage({
          id: generateId(),
          text: 'รับทราบค่ะ 😊 ถ้ามีอาการรุนแรงขึ้นก่อนวันนัด สามารถทักมาปรึกษาได้ตลอดนะคะ',
          sender: 'doctor',
          timestamp: new Date(),
          type: 'text',
        });
      }, 1500);
    }
  }, [inputText, phase, currentQuestionIndex, addMessage, addMessages]);

  const handleActionCard = useCallback(
    (actionType: string) => {
      if (actionType === 'booking_link') {
        Alert.alert(
          'นัดหมาย',
          'คุณหมอส่งลิงก์นัดหมายให้คุณแล้ว ต้องการไปจองเลยไหมคะ?',
          [
            { text: 'ภายหลัง', style: 'cancel' },
            {
              text: 'จองเลย',
              onPress: () => router.back(),
            },
          ]
        );
      } else if (actionType === 'prescription') {
        setShowPrescriptionModal(true);
      }
    },
    []
  );

  const handleDeliveryChoice = useCallback(
    (method: string) => {
      setPrescriptionDelivery(method);
      setTimeout(() => {
        setShowPrescriptionModal(false);
        setPrescriptionDelivery(null);
        addMessage({
          id: generateId(),
          text:
            method === 'home'
              ? '✅ เลือกส่งยาถึงบ้านเรียบร้อยค่ะ จะจัดส่งภายใน 2-3 ชั่วโมง'
              : '✅ เลือกรับยาที่คลินิก/ร้านยาเรียบร้อยค่ะ สามารถไปรับได้เลยนะคะ',
          sender: 'system',
          timestamp: new Date(),
          type: 'system',
        });
      }, 800);
    },
    [addMessage]
  );

  // ── Render helpers ──────────────────────────────
  const renderMessage = (msg: ConsultMessage) => {
    if (msg.type === 'system') {
      return (
        <View key={msg.id} style={styles.systemMessageContainer}>
          <View style={styles.systemMessageLine} />
          <Text style={styles.systemMessageText}>{msg.text}</Text>
          <View style={styles.systemMessageLine} />
        </View>
      );
    }

    if (msg.type === 'action_card') {
      return (
        <View key={msg.id} style={styles.actionCardRow}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.7}
            onPress={() => msg.actionType && handleActionCard(msg.actionType)}
          >
            <Text style={styles.actionCardText}>{msg.text}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      );
    }

    const isUser = msg.sender === 'user';
    const isDoctor = msg.sender === 'doctor';

    return (
      <View
        key={msg.id}
        style={[
          styles.messageBubbleRow,
          isUser ? styles.messageBubbleRowRight : styles.messageBubbleRowLeft,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>
              {isDoctor ? DOCTOR_AVATAR : '🤖'}
            </Text>
          </View>
        )}
        <View style={styles.messageColumn}>
          {!isUser && (
            <Text style={styles.senderName}>
              {isDoctor ? DOCTOR_NAME : 'AI ผู้ช่วย'}
            </Text>
          )}
          <View
            style={[
              styles.messageBubble,
              isUser
                ? styles.messageBubbleUser
                : isDoctor
                ? styles.messageBubbleDoctor
                : styles.messageBubbleAi,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isUser && styles.messageTextUser,
              ]}
            >
              {msg.text}
            </Text>
          </View>
          <Text
            style={[
              styles.messageTime,
              isUser && styles.messageTimeRight,
            ]}
          >
            {msg.timestamp.toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Custom Header ─────────────────────────── */}
      <LinearGradient
        colors={Colors.gradientBlue}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerDoctorRow}>
            <Text style={styles.headerDoctorIcon}>🩺</Text>
            <Text style={styles.headerDoctorName} numberOfLines={1}>
              {DOCTOR_NAME}
            </Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>ออนไลน์</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerVideoButton} activeOpacity={0.7}>
          <Ionicons name="videocam" size={22} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      {/* ── Security Banner ───────────────────────── */}
      <View style={styles.securityBanner}>
        <Text style={styles.securityText}>
          🔒 Encrypted Chat - การสนทนานี้ถูกเข้ารหัสเพื่อความปลอดภัย
        </Text>
      </View>

      {/* ── Disclaimer ────────────────────────────── */}
      <View style={styles.disclaimerBanner}>
        <Ionicons name="information-circle" size={16} color="#E65100" />
        <Text style={styles.disclaimerText}>
          การคุยออนไลน์นี้เป็นเพียงการให้คำแนะนำเบื้องต้นเท่านั้น
          ไม่ใช่การวินิจฉัยโรค และไม่สามารถทดแทนการมาตรวจที่คลินิกได้
        </Text>
      </View>

      {/* ── Chat Area ─────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatScrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}

          {/* Typing indicator */}
          {isTyping && (
            <View style={[styles.messageBubbleRow, styles.messageBubbleRowLeft]}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarSmallText}>
                  {phase === 'doctor' ? DOCTOR_AVATAR : '🤖'}
                </Text>
              </View>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Toolbar ──────────────────────────────── */}
        <View style={[styles.toolbar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity style={styles.toolbarIconButton} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={22} color={Colors.gray500} />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="พิมพ์ข้อความ..."
              placeholderTextColor={Colors.gray500}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
          </View>

          <TouchableOpacity style={styles.toolbarIconButton} activeOpacity={0.7}>
            <Ionicons name="videocam-outline" size={22} color={Colors.gray500} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            activeOpacity={0.7}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() ? Colors.white : Colors.gray300}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ── E-Prescription Modal ──────────────────── */}
      <Modal
        visible={showPrescriptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrescriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {/* Modal Header */}
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💊 ใบสั่งยา</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPrescriptionModal(false);
                  setPrescriptionDelivery(null);
                }}
              >
                <Ionicons name="close-circle" size={28} color={Colors.gray300} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              จาก {DOCTOR_NAME}
            </Text>

            {/* Medication List */}
            <ScrollView style={styles.prescriptionList} showsVerticalScrollIndicator={false}>
              {mockPrescription.map((med, index) => (
                <View key={index} style={styles.medicationCard}>
                  <View style={styles.medicationIndex}>
                    <Text style={styles.medicationIndexText}>{index + 1}</Text>
                  </View>
                  <View style={styles.medicationInfo}>
                    <Text style={styles.medicationName}>{med.name}</Text>
                    <Text style={styles.medicationDetail}>
                      💊 {med.dosage} • {med.frequency}
                    </Text>
                    <Text style={styles.medicationDuration}>
                      📅 ระยะเวลา: {med.duration}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Delivery Options */}
            {!prescriptionDelivery ? (
              <View style={styles.deliveryOptions}>
                <Text style={styles.deliveryTitle}>เลือกวิธีรับยา</Text>
                <TouchableOpacity
                  style={styles.deliveryButton}
                  activeOpacity={0.7}
                  onPress={() => handleDeliveryChoice('home')}
                >
                  <LinearGradient
                    colors={Colors.gradientBlue}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.deliveryButtonGradient}
                  >
                    <Text style={styles.deliveryButtonIcon}>🏠</Text>
                    <Text style={styles.deliveryButtonText}>ส่งยาถึงบ้าน</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deliveryButtonOutline}
                  activeOpacity={0.7}
                  onPress={() => handleDeliveryChoice('clinic')}
                >
                  <Text style={styles.deliveryButtonOutlineIcon}>🏪</Text>
                  <Text style={styles.deliveryButtonOutlineText}>
                    รับยาที่คลินิก/ร้านยา
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.confirmationBox}>
                <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
                <Text style={styles.confirmationTitle}>เรียบร้อยค่ะ!</Text>
                <Text style={styles.confirmationText}>
                  {prescriptionDelivery === 'home'
                    ? 'ยาจะจัดส่งถึงบ้านภายใน 2-3 ชั่วโมง'
                    : 'สามารถไปรับยาที่คลินิก/ร้านยาได้เลยค่ะ'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

// ── Styles ───────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },

  // ── Header ──────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerDoctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerDoctorIcon: {
    fontSize: 16,
  },
  headerDoctorName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#69F0AE',
  },
  onlineText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  headerVideoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Banners ─────────────────────────────────────
  securityBanner: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  securityText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.primaryDark,
  },
  disclaimerBanner: {
    backgroundColor: '#FFF8E1',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE082',
  },
  disclaimerText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#E65100',
    lineHeight: 16,
  },

  // ── Chat ────────────────────────────────────────
  chatArea: {
    flex: 1,
  },
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },

  // ── Message Bubbles ─────────────────────────────
  messageBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageBubbleRowLeft: {
    justifyContent: 'flex-start',
    marginRight: 48,
  },
  messageBubbleRowRight: {
    justifyContent: 'flex-end',
    marginLeft: 48,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  avatarSmallText: {
    fontSize: 16,
  },
  messageColumn: {
    flex: 1,
  },
  senderName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.gray500,
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  messageBubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  messageBubbleAi: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    ...Layout.shadow.small,
  },
  messageBubbleDoctor: {
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.gray900,
    lineHeight: 21,
  },
  messageTextUser: {
    color: Colors.white,
  },
  messageTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.gray500,
    marginTop: 4,
    marginLeft: 4,
  },
  messageTimeRight: {
    textAlign: 'right',
    marginLeft: 0,
    marginRight: 4,
  },

  // ── System Message ──────────────────────────────
  systemMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  systemMessageLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },
  systemMessageText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.gray500,
    textAlign: 'center',
  },

  // ── Action Cards ────────────────────────────────
  actionCardRow: {
    marginLeft: 40,
    marginRight: 48,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    ...Layout.shadow.small,
  },
  actionCardText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },

  // ── Typing Indicator ────────────────────────────
  typingBubble: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Layout.shadow.small,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.gray300,
  },
  typingDot1: {
    opacity: 1,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.3,
  },

  // ── Toolbar ─────────────────────────────────────
  toolbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    gap: 6,
  },
  toolbarIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.gray100,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxHeight: 100,
  },
  textInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.gray900,
    padding: 0,
    lineHeight: 22,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray100,
  },

  // ── Prescription Modal ──────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.gray900,
  },
  modalSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 4,
    marginBottom: 20,
  },
  prescriptionList: {
    maxHeight: 280,
  },
  medicationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.offWhite,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    alignItems: 'flex-start',
  },
  medicationIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicationIndexText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.primary,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.gray900,
    marginBottom: 4,
  },
  medicationDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray800,
    lineHeight: 18,
  },
  medicationDuration: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  deliveryOptions: {
    marginTop: 20,
    gap: 10,
  },
  deliveryTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.gray900,
    marginBottom: 4,
  },
  deliveryButton: {
    borderRadius: Layout.buttonRadius,
    overflow: 'hidden',
  },
  deliveryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderRadius: Layout.buttonRadius,
  },
  deliveryButtonIcon: {
    fontSize: 18,
  },
  deliveryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  deliveryButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: Layout.buttonRadius,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    gap: 8,
  },
  deliveryButtonOutlineIcon: {
    fontSize: 18,
  },
  deliveryButtonOutlineText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },

  // ── Confirmation ────────────────────────────────
  confirmationBox: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  confirmationTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.gray900,
    marginTop: 4,
  },
  confirmationText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
});
