import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import Ionicons from '@react-native-vector-icons/ionicons';
import { getWelcomeMessages, getAIResponse, ChatMessage } from '../../data/aiChatbot';
import { mockDoctors, Doctor } from '../../data/mockDoctors';

const generateId = () => Math.random().toString(36).substring(2, 9);

// Typing indicator component with animated dots
const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createDotAnimation = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

    const anim1 = createDotAnimation(dot1, 0);
    const anim2 = createDotAnimation(dot2, 150);
    const anim3 = createDotAnimation(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3]);

  const dotStyle = (dot: Animated.Value) => ({
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
    opacity: dot.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  });

  return (
    <View style={styles.typingContainer}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarEmoji}>🤖</Text>
      </View>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
        <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
        <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
      </View>
    </View>
  );
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(getWelcomeMessages());
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<{[messageId: string]: string}>({});
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponses = getAIResponse(trimmed);
      setMessages((prev) => [...prev, ...aiResponses]);
      setIsTyping(false);
    }, 1000);
  }, [inputText]);

  const handleQuickReply = useCallback((text: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponses = getAIResponse(text);
      setMessages((prev) => [...prev, ...aiResponses]);
      setIsTyping(false);
    }, 1000);
  }, []);

  const handleTimeSlotPress = useCallback(
    (serviceName: string, time: string, date: string, doctorName: string) => {
      Alert.alert(
        '✅ ยืนยันการจอง',
        `บริการ: ${serviceName}\nวันที่: ${date}\nเวลา: ${time} น.\nทันตแพทย์: ${doctorName}\n\nต้องการจองนัดหมายนี้ใช่ไหมคะ?`,
        [
          { text: 'ยกเลิก', style: 'cancel' },
          {
            text: 'ยืนยัน',
            onPress: () => {
              const confirmMessage: ChatMessage = {
                id: generateId(),
                text: `🎉 จองสำเร็จแล้วค่ะ!\n\n📋 สรุปนัดหมาย:\n🦷 ${serviceName}\n📅 ${date}\n⏰ ${time} น.\n👨‍⚕️ ${doctorName}\n\nระบบจะส่งการแจ้งเตือนก่อนนัดหมาย 1 วันค่ะ 💙`,
                sender: 'ai',
                timestamp: new Date(),
                type: 'text',
              };
              setMessages((prev) => [...prev, confirmMessage]);
            },
          },
        ]
      );
    },
    []
  );

  const handleRichMenuAction = useCallback(
    (action: string) => {
      handleQuickReply(action);
    },
    [handleQuickReply]
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const renderAppointmentCard = (msg: ChatMessage) => {
    const data = msg.appointmentData;
    if (!data) return null;

    const selectedDoctorId = selectedDoctors[msg.id];
    const activeDoctor = selectedDoctorId
      ? mockDoctors.find((d) => d.id === selectedDoctorId) || mockDoctors[0]
      : mockDoctors.find((d) => d.name === data.doctorName) || mockDoctors[0];

    const getDayFromDateString = (dateStr: string): string => {
      const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
      for (const d of days) {
        if (dateStr.includes(d)) return d;
      }
      return 'เสาร์';
    };

    const day = getDayFromDateString(data.date);
    const slots = activeDoctor.timeSlots[day] || [];

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentCardHeader}>
          <View style={styles.appointmentServiceBadge}>
            <Text style={styles.appointmentServiceBadgeText}>🦷 {data.serviceName}</Text>
          </View>
        </View>

        <View style={styles.appointmentDetail}>
          <Ionicons name="calendar-outline" size={16} color={Colors.gray500} />
          <Text style={styles.appointmentDetailText}>{data.date}</Text>
        </View>

        <View style={styles.appointmentDetail}>
          <Ionicons name="person-outline" size={16} color={Colors.gray500} />
          <Text style={styles.appointmentDetailText}>{activeDoctor.name} ({activeDoctor.specialty})</Text>
        </View>

        <View style={styles.appointmentDetail}>
          <Ionicons name="time-outline" size={16} color={Colors.gray500} />
          <Text style={styles.appointmentDetailText}>{data.duration} นาที</Text>
        </View>

        <View style={styles.appointmentDetail}>
          <Ionicons name="wallet-outline" size={16} color={Colors.gray500} />
          <Text style={styles.appointmentDetailText}>{data.estimatedPrice}</Text>
        </View>

        {/* Doctor Selector */}
        <Text style={styles.doctorSelectorLabel}>เลือกทันตแพทย์:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardDoctorScroll}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
          {mockDoctors.map((doc) => {
            const isSelected = activeDoctor.id === doc.id;
            return (
              <TouchableOpacity
                key={doc.id}
                style={[
                  styles.cardDoctorChip,
                  isSelected && styles.cardDoctorChipSelected,
                ]}
                onPress={() => setSelectedDoctors((prev) => ({ ...prev, [msg.id]: doc.id }))}
                activeOpacity={0.8}
              >
                <Text style={styles.cardDoctorAvatar}>{doc.avatar}</Text>
                <View>
                  <Text style={[styles.cardDoctorName, isSelected && styles.textWhite]}>
                    {doc.name.replace('ทพญ. ', '').replace('ทพ. ', '')}
                  </Text>
                  <Text style={[styles.cardDoctorSub, isSelected ? styles.textLightBlue : styles.textGray]}>
                    ⭐ {doc.rating} ({doc.experience}ปี)
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.timeSlotsLabel}>เลือกเวลาที่ต้องการ:</Text>
        {slots.length > 0 ? (
          <View style={styles.timeSlotsRow}>
            {slots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={styles.timeSlotChip}
                onPress={() =>
                  handleTimeSlotPress(data.serviceName, slot, data.date, activeDoctor.name)
                }
                activeOpacity={0.7}
              >
                <Text style={styles.timeSlotChipText}>{slot} น.</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.noSlotsContainer}>
            <Text style={styles.noSlotsText}>คุณหมอไม่มีคิวว่างในวัน{day}ค่ะ</Text>
          </View>
        )}
      </View>
    );
  };

  const renderQuickReplies = (msg: ChatMessage) => {
    if (!msg.quickReplies) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickRepliesScroll}
        contentContainerStyle={styles.quickRepliesContent}
      >
        {msg.quickReplies.map((reply, index) => (
          <TouchableOpacity
            key={`${msg.id}-qr-${index}`}
            style={styles.quickReplyPill}
            onPress={() => handleQuickReply(reply)}
            activeOpacity={0.7}
          >
            <Text style={styles.quickReplyText}>{reply}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';

    if (item.type === 'quick_replies') {
      return renderQuickReplies(item);
    }

    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAI]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🤖</Text>
          </View>
        )}

        <View style={styles.messageContentWrapper}>
          {item.type === 'text' && (
            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
                {item.text}
              </Text>
            </View>
          )}

          {item.type === 'appointment_card' && renderAppointmentCard(item)}

          <Text
            style={[
              styles.messageTime,
              isUser ? styles.messageTimeUser : styles.messageTimeAI,
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.headerAvatarWrapper}>
                <Text style={styles.headerAvatar}>🤖</Text>
                <View style={styles.onlineDot} />
              </View>
              <View>
                <Text style={styles.headerTitle}>DentAI Assistant</Text>
                <Text style={styles.headerSubtitle}>ออนไลน์อยู่</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Ionicons name="call-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Ionicons name="ellipsis-vertical" size={20} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.disclaimerBar}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.warning} />
            <Text style={styles.disclaimerText}>
              การคุยออนไลน์นี้เป็นเพียงการให้คำแนะนำเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยโรค
            </Text>
          </View>
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Rich Menu Bar */}
        <View style={styles.richMenu}>
          <TouchableOpacity
            style={styles.richMenuBtn}
            onPress={() => handleRichMenuAction('เช็คคิวว่างวันนี้')}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            <Text style={styles.richMenuText}>เช็คคิวว่าง</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.richMenuBtn}
            onPress={() => handleRichMenuAction('เลื่อนนัดหมาย')}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-horizontal-outline" size={18} color={Colors.primary} />
            <Text style={styles.richMenuText}>เลื่อนนัดหมาย</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.richMenuBtn}
            onPress={() => handleRichMenuAction('คุยกับเจ้าหน้าที่')}
            activeOpacity={0.7}
          >
            <Ionicons name="people-outline" size={18} color={Colors.primary} />
            <Text style={styles.richMenuText}>คุยกับเจ้าหน้าที่</Text>
          </TouchableOpacity>
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputIconBtn} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={24} color={Colors.gray500} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inputIconBtn} activeOpacity={0.7}>
            <Ionicons name="image-outline" size={24} color={Colors.gray500} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="พิมพ์ข้อความ เช่น อยากจองขูดหินปูน..."
              placeholderTextColor={Colors.gray500}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : null]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? Colors.white : Colors.gray300}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },

  // Header
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    ...Layout.shadow.small,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatarWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    fontSize: 22,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    color: Colors.gray900,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.success,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  disclaimerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#8D6E00',
    flex: 1,
    lineHeight: 16,
  },

  // Chat Content
  chatContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  // Message Row
  messageRow: {
    flexDirection: 'row',
    marginBottom: 8,
    maxWidth: '85%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    alignSelf: 'flex-start',
  },

  // Avatar
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  avatarEmoji: {
    fontSize: 18,
  },

  messageContentWrapper: {
    flex: 1,
    maxWidth: '100%',
  },

  // Bubbles
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    ...Layout.shadow.small,
  },
  messageText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: Colors.white,
  },
  aiText: {
    color: Colors.gray900,
  },
  messageTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 4,
  },
  messageTimeUser: {
    textAlign: 'right',
  },
  messageTimeAI: {
    textAlign: 'left',
    marginLeft: 4,
  },

  // Appointment Card
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    ...Layout.shadow.medium,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  appointmentCardHeader: {
    marginBottom: 12,
  },
  appointmentServiceBadge: {
    backgroundColor: Colors.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  appointmentServiceBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },
  appointmentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  appointmentDetailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.gray800,
  },
  timeSlotsLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 10,
    marginBottom: 8,
  },
  timeSlotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeSlotChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
  },

  // Card Doctor Selector
  doctorSelectorLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.gray500,
    marginTop: 12,
    marginBottom: 6,
  },
  cardDoctorScroll: {
    marginBottom: 8,
  },
  cardDoctorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.gray300,
    gap: 6,
  },
  cardDoctorChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cardDoctorAvatar: {
    fontSize: 16,
  },
  cardDoctorName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.gray900,
  },
  cardDoctorSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  noSlotsContainer: {
    backgroundColor: Colors.gray100,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  noSlotsText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.gray500,
  },
  textWhite: {
    color: Colors.white,
  },
  textLightBlue: {
    color: Colors.primaryLight,
  },
  textGray: {
    color: Colors.gray500,
  },

  // Quick Replies
  quickRepliesScroll: {
    marginBottom: 8,
    marginLeft: 40,
  },
  quickRepliesContent: {
    paddingRight: 12,
    gap: 8,
  },
  quickReplyPill: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickReplyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.primary,
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    gap: 4,
    ...Layout.shadow.small,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray500,
  },

  // Rich Menu
  richMenu: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  richMenuBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 4,
  },
  richMenuText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.primary,
  },

  // Input Bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    gap: 4,
  },
  inputIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.gray100,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
    maxHeight: 100,
  },
  textInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.gray900,
    maxHeight: 80,
    paddingTop: Platform.OS === 'ios' ? 0 : 6,
    paddingBottom: Platform.OS === 'ios' ? 0 : 6,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
  },
});
