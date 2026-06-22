// AI Chatbot Simulation - Keyword-based NLP mock
// In production, this would connect to an actual NLP/LLM service

import { mockServices } from './mockServices';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'doctor';
  timestamp: Date;
  type: 'text' | 'appointment_card' | 'quick_replies' | 'image' | 'system';
  appointmentData?: AppointmentSuggestion;
  quickReplies?: string[];
  senderName?: string;
  senderAvatar?: string;
}

export interface AppointmentSuggestion {
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlots: string[];
  doctorName: string;
  duration: number;
  estimatedPrice: string;
}

interface KeywordPattern {
  keywords: string[];
  response: (input: string) => ChatMessage[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const today = new Date();
const getDateString = (daysAhead: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysAhead);
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  return `วัน${days[d.getDay()]}ที่ ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
};

const findNextSaturday = () => {
  const d = new Date(today);
  const day = d.getDay();
  const daysUntilSat = day === 6 ? 7 : 6 - day;
  d.setDate(d.getDate() + daysUntilSat);
  return d;
};

const patterns: KeywordPattern[] = [
  {
    keywords: ['ขูดหินปูน', 'หินปูน', 'scaling', 'ทำความสะอาด'],
    response: () => [
      {
        id: generateId(),
        text: '🦷 เข้าใจค่ะ คุณต้องการจองคิว "ขูดหินปูน" นะคะ\n\nขูดหินปูนใช้เวลาประมาณ 30 นาที ค่าบริการ 800 - 1,500 บาท\n\nดิฉันเลือกเวลาว่างที่ดีที่สุดให้แล้วค่ะ 👇',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'appointment_card',
        appointmentData: {
          serviceId: 'scaling',
          serviceName: 'ขูดหินปูน',
          date: getDateString(3),
          timeSlots: ['09:00', '10:30', '13:00', '14:30'],
          doctorName: 'ทพญ. สมศรี รักษาฟัน',
          duration: 30,
          estimatedPrice: '800 - 1,500 บาท',
        },
      },
    ],
  },
  {
    keywords: ['อุดฟัน', 'ฟันผุ', 'filling', 'ปวดฟัน'],
    response: () => [
      {
        id: generateId(),
        text: '🔧 รับทราบค่ะ คุณต้องการจองคิว "อุดฟัน" นะคะ\n\nการอุดฟันใช้เวลาประมาณ 45 นาที ค่าบริการ 800 - 2,500 บาท\n\nนี่คือเวลาว่างค่ะ 👇',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'appointment_card',
        appointmentData: {
          serviceId: 'filling',
          serviceName: 'อุดฟัน',
          date: getDateString(2),
          timeSlots: ['10:00', '11:00', '14:00', '15:30'],
          doctorName: 'ทพ. วิชัย สุขภาพดี',
          duration: 45,
          estimatedPrice: '800 - 2,500 บาท',
        },
      },
    ],
  },
  {
    keywords: ['ฟันคุด', 'ผ่าฟัน', 'extraction', 'ถอนฟัน'],
    response: () => [
      {
        id: generateId(),
        text: '🏥 รับทราบค่ะ คุณต้องการจองคิว "ผ่าฟันคุด" นะคะ\n\nผ่าฟันคุดใช้เวลาประมาณ 60 นาที ค่าบริการ 3,000 - 8,000 บาท\n\n⚠️ แนะนำนัดช่วงเช้าเพื่อให้มีเวลาพักฟื้นนะคะ',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'appointment_card',
        appointmentData: {
          serviceId: 'extraction',
          serviceName: 'ผ่าฟันคุด',
          date: getDateString(4),
          timeSlots: ['09:00', '10:30'],
          doctorName: 'ทพ. วิชัย สุขภาพดี',
          duration: 60,
          estimatedPrice: '3,000 - 8,000 บาท',
        },
      },
    ],
  },
  {
    keywords: ['เสาร์', 'วันเสาร์', 'saturday', 'สุดสัปดาห์', 'weekend'],
    response: (input: string) => {
      const service = mockServices.find((s) =>
        input.includes(s.name) || input.toLowerCase().includes(s.nameEn.toLowerCase())
      );
      const serviceName = service?.name || 'ตรวจสุขภาพฟัน';
      const serviceId = service?.id || 'checkup';
      const duration = service?.duration || 30;
      const price = service?.priceRange || '500 - 1,000';

      return [
        {
          id: generateId(),
          text: `📅 เข้าใจค่ะ! คุณอยากนัดวันเสาร์นี้นะคะ\n\nดิฉันเช็คคิวว่างวันเสาร์ให้แล้วค่ะ 👇`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        },
        {
          id: generateId(),
          text: '',
          sender: 'ai',
          timestamp: new Date(),
          type: 'appointment_card',
          appointmentData: {
            serviceId,
            serviceName,
            date: `วันเสาร์ที่ ${findNextSaturday().getDate()} ${['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][findNextSaturday().getMonth()]} ${findNextSaturday().getFullYear() + 543}`,
            timeSlots: ['09:00', '10:00', '11:00', '13:00', '14:00'],
            doctorName: 'ทพญ. สมศรี รักษาฟัน',
            duration,
            estimatedPrice: `${price} บาท`,
          },
        },
      ];
    },
  },
  {
    keywords: ['คิวว่าง', 'ว่างวันนี้', 'วันนี้', 'today', 'available'],
    response: () => [
      {
        id: generateId(),
        text: `📋 เช็คคิวว่างวันนี้ให้แล้วค่ะ!\n\nวันนี้ (${getDateString(0)}) ยังมีคิวว่างดังนี้:\n\n✅ 13:00 - ตรวจสุขภาพฟัน (ทพญ. สมศรี)\n✅ 14:00 - ขูดหินปูน (ทพญ. สมศรี)\n✅ 15:00 - อุดฟัน (ทพ. วิชัย)\n\nสนใจจองเวลาไหนคะ? 😊`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'quick_replies',
        quickReplies: ['จอง 13:00 ตรวจฟัน', 'จอง 14:00 ขูดหินปูน', 'จอง 15:00 อุดฟัน', 'ดูวันอื่น'],
      },
    ],
  },
  {
    keywords: ['เลื่อนนัด', 'เลื่อน', 'เปลี่ยนวัน', 'reschedule'],
    response: () => [
      {
        id: generateId(),
        text: '📅 คุณมีนัดหมายที่กำลังจะถึง:\n\n🦷 ขูดหินปูน\n👨‍⚕️ ทพญ. สมศรี รักษาฟัน\n📆 ' + getDateString(5) + ' เวลา 10:00 น.\n\nต้องการเลื่อนไปวันไหนคะ?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'quick_replies',
        quickReplies: ['เลื่อนไปสัปดาห์หน้า', 'เลือกวันเอง', 'ยกเลิกนัดหมาย'],
      },
    ],
  },
  {
    keywords: ['เจ้าหน้าที่', 'คุยกับคน', 'มนุษย์', 'staff', 'human', 'ปรึกษาหมอ', 'หมอ'],
    response: () => [
      {
        id: generateId(),
        text: '👨‍⚕️ รับทราบค่ะ! กำลังส่งต่อให้เจ้าหน้าที่/คุณหมอดูแลนะคะ\n\n🟢 ขณะนี้มี ทพญ. สมศรี รักษาฟัน พร้อมให้คำปรึกษาอยู่ค่ะ\n\nกดปุ่มด้านล่างเพื่อเข้าห้องปรึกษาได้เลยนะคะ',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'quick_replies',
        quickReplies: ['🩺 เข้าห้องปรึกษาหมอ', 'กลับเมนูหลัก'],
      },
    ],
  },
  {
    keywords: ['ฟอกสีฟัน', 'ฟอกฟัน', 'whitening', 'ฟันขาว'],
    response: () => [
      {
        id: generateId(),
        text: '✨ เข้าใจค่ะ คุณสนใจ "ฟอกสีฟัน" นะคะ!\n\nฟอกสีฟันใช้เวลาประมาณ 60 นาที ค่าบริการ 3,000 - 10,000 บาท\n\n💡 แนะนำ: ควรขูดหินปูนก่อนฟอกสีฟันเพื่อผลลัพธ์ที่ดีที่สุดค่ะ',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'appointment_card',
        appointmentData: {
          serviceId: 'whitening',
          serviceName: 'ฟอกสีฟัน',
          date: getDateString(5),
          timeSlots: ['10:00', '13:00', '15:00'],
          doctorName: 'ทพญ. นภา ยิ้มสวย',
          duration: 60,
          estimatedPrice: '3,000 - 10,000 บาท',
        },
      },
    ],
  },
  {
    keywords: ['จัดฟัน', 'เหล็กจัดฟัน', 'braces', 'orthodontic'],
    response: () => [
      {
        id: generateId(),
        text: '😁 สนใจจัดฟันนะคะ! ดีมากเลยค่ะ\n\n🦷 การจัดฟันมีหลายแบบ:\n• จัดฟันแบบโลหะ: 30,000 - 50,000 บาท\n• จัดฟันแบบเซรามิก: 40,000 - 60,000 บาท\n• จัดฟันแบบใส (Invisalign): 60,000 - 80,000 บาท\n\nขั้นตอนแรกคือนัดปรึกษาแพทย์ก่อนนะคะ (ฟรี!) 👇',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      },
      {
        id: generateId(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'appointment_card',
        appointmentData: {
          serviceId: 'braces',
          serviceName: 'ปรึกษาจัดฟัน (ฟรี)',
          date: getDateString(3),
          timeSlots: ['10:00', '14:00', '16:00'],
          doctorName: 'ทพญ. นภา ยิ้มสวย',
          duration: 45,
          estimatedPrice: 'ปรึกษาฟรี',
        },
      },
    ],
  },
];

const defaultResponse: ChatMessage[] = [
  {
    id: generateId(),
    text: '🤖 ขอบคุณที่ส่งข้อความมานะคะ!\n\nดิฉันช่วยคุณได้หลายเรื่องค่ะ:\n• จองคิวทำฟัน\n• เช็คคิวว่าง\n• เลื่อนนัดหมาย\n• ปรึกษาหมอฟัน\n\nลองพิมพ์สิ่งที่ต้องการได้เลยค่ะ เช่น "อยากจองขูดหินปูน" หรือ "เช็คคิวว่างวันนี้" 😊',
    sender: 'ai',
    timestamp: new Date(),
    type: 'text',
  },
  {
    id: generateId(),
    text: '',
    sender: 'ai',
    timestamp: new Date(),
    type: 'quick_replies',
    quickReplies: ['ขูดหินปูน', 'อุดฟัน', 'ฟอกสีฟัน', 'เช็คคิวว่างวันนี้'],
  },
];

export const getWelcomeMessages = (): ChatMessage[] => [
  {
    id: 'welcome1',
    text: '🦷 สวัสดีค่ะ! ยินดีต้อนรับสู่ DentAI\n\nดิฉันเป็นผู้ช่วย AI ที่จะช่วยจองคิวทำฟันให้คุณอย่างสะดวกรวดเร็วค่ะ\n\nบอกดิฉันได้เลยว่าต้องการอะไร เช่น:\n💬 "อยากจองขูดหินปูนวันเสาร์นี้"\n💬 "เช็คคิวว่างวันนี้"\n💬 "อยากปรึกษาหมอฟัน"',
    sender: 'ai',
    timestamp: new Date(),
    type: 'text',
    senderName: 'DentAI Assistant',
    senderAvatar: '🤖',
  },
  {
    id: 'welcome2',
    text: '',
    sender: 'ai',
    timestamp: new Date(),
    type: 'quick_replies',
    quickReplies: ['จองคิวใหม่', 'เช็คคิวว่างวันนี้', 'เลื่อนนัดหมาย', 'ปรึกษาหมอฟัน'],
  },
];

export const getAIResponse = (userMessage: string): ChatMessage[] => {
  const lowerMessage = userMessage.toLowerCase();

  for (const pattern of patterns) {
    if (pattern.keywords.some((keyword) => lowerMessage.includes(keyword.toLowerCase()))) {
      return pattern.response(lowerMessage);
    }
  }

  return defaultResponse;
};

export const consultationPreScreenQuestions = [
  'ปวดฟันมานานกี่วันแล้วคะ?',
  'ปวดตอนเคี้ยวหรือปวดตลอดเวลาคะ?',
  'มีไข้ร่วมด้วยไหมคะ?',
  'เหงือกบวมหรือมีเลือดออกไหมคะ?',
  'เคยมีอาการแบบนี้มาก่อนไหมคะ?',
];
