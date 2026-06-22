export interface Service {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  duration: number; // minutes
  priceRange: string;
  description: string;
  color: string;
}

export const mockServices: Service[] = [
  {
    id: 'checkup',
    name: 'ตรวจสุขภาพฟัน',
    nameEn: 'Dental Checkup',
    icon: 'search',
    duration: 30,
    priceRange: '500 - 1,000',
    description: 'ตรวจสุขภาพช่องปากและฟันโดยละเอียด',
    color: '#4FC3F7',
  },
  {
    id: 'scaling',
    name: 'ขูดหินปูน',
    nameEn: 'Scaling',
    icon: 'sparkles',
    duration: 30,
    priceRange: '800 - 1,500',
    description: 'ทำความสะอาดฟันและขูดหินปูนออก',
    color: '#1A73E8',
  },
  {
    id: 'filling',
    name: 'อุดฟัน',
    nameEn: 'Filling',
    icon: 'build',
    duration: 45,
    priceRange: '800 - 2,500',
    description: 'อุดฟันผุด้วยวัสดุคุณภาพสูง',
    color: '#0D47A1',
  },
  {
    id: 'extraction',
    name: 'ผ่าฟันคุด',
    nameEn: 'Wisdom Tooth Extraction',
    icon: 'medkit',
    duration: 60,
    priceRange: '3,000 - 8,000',
    description: 'ผ่าตัดเอาฟันคุดออกอย่างปลอดภัย',
    color: '#FF5252',
  },
  {
    id: 'whitening',
    name: 'ฟอกสีฟัน',
    nameEn: 'Teeth Whitening',
    icon: 'sunny',
    duration: 60,
    priceRange: '3,000 - 10,000',
    description: 'ฟอกสีฟันให้ขาวสว่างอย่างเป็นธรรมชาติ',
    color: '#FF9800',
  },
  {
    id: 'braces',
    name: 'จัดฟัน',
    nameEn: 'Orthodontics',
    icon: 'happy',
    duration: 45,
    priceRange: '30,000 - 80,000',
    description: 'จัดฟันเพื่อการเรียงตัวของฟันที่สวยงาม',
    color: '#00C853',
  },
  {
    id: 'rootcanal',
    name: 'รักษารากฟัน',
    nameEn: 'Root Canal',
    icon: 'pulse',
    duration: 90,
    priceRange: '5,000 - 15,000',
    description: 'รักษารากฟันอักเสบหรือติดเชื้อ',
    color: '#9C27B0',
  },
  {
    id: 'crown',
    name: 'ครอบฟัน',
    nameEn: 'Crown',
    icon: 'shield-checkmark',
    duration: 60,
    priceRange: '8,000 - 20,000',
    description: 'ครอบฟันเพื่อปกป้องและฟื้นฟูรูปร่างฟัน',
    color: '#607D8B',
  },
];
