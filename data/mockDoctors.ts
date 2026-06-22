export interface Doctor {
  id: string;
  name: string;
  nameEn: string;
  specialty: string;
  specialtyEn: string;
  avatar: string;
  rating: number;
  experience: number; // years
  isOnline: boolean;
  availableIn: number; // minutes
  availableDays: string[];
  timeSlots: { [day: string]: string[] };
  biography: string;
}

export const mockDoctors: Doctor[] = [
  {
    id: 'dr1',
    name: 'ทพญ. สมศรี รักษาฟัน',
    nameEn: 'Dr. Somsri Raksafan',
    specialty: 'ทันตกรรมทั่วไป',
    specialtyEn: 'General Dentistry',
    avatar: '👩‍⚕️',
    rating: 4.9,
    experience: 12,
    isOnline: true,
    availableIn: 5,
    availableDays: ['จันทร์', 'พุธ', 'ศุกร์', 'เสาร์'],
    timeSlots: {
      'จันทร์': ['09:00', '10:30', '13:00', '14:30'],
      'พุธ': ['09:00', '10:30', '15:00'],
      'ศุกร์': ['13:00', '14:30', '16:00'],
      'เสาร์': ['09:00', '10:30', '13:00', '14:30'],
    },
    biography: 'เชี่ยวชาญด้านการขูดหินปูน อุดฟัน ถอนฟัน และการดูแลทันตกรรมทั่วไปสำหรับเด็กและผู้ใหญ่ ประสบการณ์กว่า 12 ปี ยินดีให้คำปรึกษาด้วยความเป็นกันเองค่ะ',
  },
  {
    id: 'dr2',
    name: 'ทพ. วิชัย สุขภาพดี',
    nameEn: 'Dr. Wichai Sukhapdee',
    specialty: 'ศัลยกรรมช่องปาก',
    specialtyEn: 'Oral Surgery',
    avatar: '👨‍⚕️',
    rating: 4.8,
    experience: 15,
    isOnline: true,
    availableIn: 10,
    availableDays: ['อังคาร', 'พฤหัสบดี', 'เสาร์'],
    timeSlots: {
      'อังคาร': ['10:00', '11:00', '14:00', '15:30'],
      'พฤหัสบดี': ['10:00', '11:00', '13:00', '15:30'],
      'เสาร์': ['10:00', '11:00', '14:00', '15:30'],
    },
    biography: 'ผู้เชี่ยวชาญด้านการผ่าฟันคุด รากเทียม และการผ่าตัดในช่องปาก มุ่งเน้นการรักษาที่รวดเร็ว เจ็บน้อยที่สุด และปลอดภัยสูงสุด',
  },
  {
    id: 'dr3',
    name: 'ทพญ. นภา ยิ้มสวย',
    nameEn: 'Dr. Napa Yimsuay',
    specialty: 'ทันตกรรมจัดฟัน',
    specialtyEn: 'Orthodontics',
    avatar: '👩‍⚕️',
    rating: 4.9,
    experience: 10,
    isOnline: false,
    availableIn: 0,
    availableDays: ['พุธ', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    timeSlots: {
      'พุธ': ['10:00', '13:00', '15:00'],
      'ศุกร์': ['10:00', '13:00', '15:00'],
      'เสาร์': ['10:00', '13:00', '15:00', '16:30'],
      'อาทิตย์': ['09:00', '11:00', '13:30'],
    },
    biography: 'ดูแลการจัดฟันทุกรูปแบบ ทั้งจัดฟันโลหะ จัดฟันใส (Invisalign) และการปรับโครงสร้างขากรรไกร เพื่อรอยยิ้มที่มั่นใจและสุขภาพฟันที่ดีในระยะยาว',
  },
  {
    id: 'dr4',
    name: 'ทพ. ธนา เชี่ยวชาญ',
    nameEn: 'Dr. Thana Chiewchan',
    specialty: 'ทันตกรรมประดิษฐ์',
    specialtyEn: 'Prosthodontics',
    avatar: '👨‍⚕️',
    rating: 4.7,
    experience: 8,
    isOnline: false,
    availableIn: 0,
    availableDays: ['จันทร์', 'อังคาร', 'พฤหัสบดี'],
    timeSlots: {
      'จันทร์': ['09:30', '11:00', '14:00'],
      'อังคาร': ['09:30', '11:00', '14:00'],
      'พฤหัสบดี': ['13:00', '15:00', '16:30'],
    },
    biography: 'เชี่ยวชาญการทำฟันปลอม ครอบฟัน สะพานฟัน และวีเนียร์เพื่อความสวยงามและการบดเคี้ยวที่มีประสิทธิภาพเสมือนฟันธรรมชาติ',
  },
];
