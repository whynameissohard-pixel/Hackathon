export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  firstNameEn: string;
  lastNameEn: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  chronicDiseases: string[];
  insurance: Insurance | null;
}

export interface Insurance {
  type: 'social_security' | 'private' | 'government';
  typeName: string;
  typeNameEn: string;
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  expiryDate: string;
  isActive: boolean;
}

export const mockUserProfile: UserProfile = {
  id: 'user1',
  firstName: 'สมชาย',
  lastName: 'รักฟัน',
  firstNameEn: 'Somchai',
  lastNameEn: 'Rakfan',
  phone: '081-234-5678',
  email: 'somchai.r@email.com',
  dateOfBirth: '1990-05-15',
  bloodType: 'O',
  allergies: ['Penicillin', 'Aspirin'],
  chronicDiseases: ['ความดันโลหิตสูง'],
  insurance: {
    type: 'social_security',
    typeName: 'ประกันสังคม',
    typeNameEn: 'Social Security',
    provider: 'สำนักงานประกันสังคม',
    policyNumber: 'SSO-1234567890',
    coverageAmount: 900,
    expiryDate: '2027-03-31',
    isActive: true,
  },
};

export const aiCareReminders = [
  {
    id: 'rem1',
    title: 'ครบ 6 เดือนแล้ว!',
    titleEn: '6 months since last scaling!',
    message: 'ถึงเวลาขูดหินปูนอีกครั้ง เพื่อสุขภาพเหงือกที่ดี',
    messageEn: 'Time for another scaling for healthy gums',
    type: 'scaling_reminder' as const,
    icon: 'sparkles',
    priority: 'medium' as const,
    date: '2026-06-16',
  },
  {
    id: 'rem2',
    title: 'อาการหลังอุดฟันเป็นอย่างไร?',
    titleEn: 'How is your filling doing?',
    message: 'ผ่านมา 1 เดือนหลังอุดฟัน ยังมีอาการเสียวฟันไหม?',
    messageEn: "It's been 1 month since your filling. Any sensitivity?",
    type: 'follow_up' as const,
    icon: 'chatbubble-ellipses',
    priority: 'low' as const,
    date: '2026-06-15',
  },
  {
    id: 'rem3',
    title: 'นัดหมายใกล้ถึงแล้ว!',
    titleEn: 'Appointment coming up!',
    message: 'คุณมีนัดขูดหินปูนในอีก 5 วัน อย่าลืมนะ!',
    messageEn: 'You have a scaling appointment in 5 days!',
    type: 'appointment_reminder' as const,
    icon: 'alarm',
    priority: 'high' as const,
    date: '2026-06-16',
  },
];
