export interface DentalRecord {
  id: string;
  date: string;
  treatment: string;
  treatmentEn: string;
  doctorName: string;
  tooth: string;
  notes: string;
  hasXray: boolean;
}

export const mockDentalRecords: DentalRecord[] = [
  {
    id: 'rec1',
    date: '2026-05-15',
    treatment: 'อุดฟัน (ฟันกรามล่างขวา)',
    treatmentEn: 'Filling (Lower Right Molar)',
    doctorName: 'ทพ. วิชัย สุขภาพดี',
    tooth: '#46',
    notes: 'อุดฟันผุด้วยคอมโพสิตสีเหมือนฟัน ผลการรักษาดี',
    hasXray: true,
  },
  {
    id: 'rec2',
    date: '2026-04-10',
    treatment: 'ตรวจสุขภาพฟัน + ขูดหินปูน',
    treatmentEn: 'Checkup + Scaling',
    doctorName: 'ทพญ. สมศรี รักษาฟัน',
    tooth: 'ทั้งปาก',
    notes: 'พบฟันผุซี่ 46 แนะนำอุดฟัน, หินปูนระดับปานกลาง',
    hasXray: true,
  },
  {
    id: 'rec3',
    date: '2025-10-20',
    treatment: 'ขูดหินปูน',
    treatmentEn: 'Scaling',
    doctorName: 'ทพญ. สมศรี รักษาฟัน',
    tooth: 'ทั้งปาก',
    notes: 'หินปูนเล็กน้อย ทำความสะอาดเรียบร้อย',
    hasXray: false,
  },
  {
    id: 'rec4',
    date: '2025-06-05',
    treatment: 'ผ่าฟันคุด',
    treatmentEn: 'Wisdom Tooth Extraction',
    doctorName: 'ทพ. วิชัย สุขภาพดี',
    tooth: '#48',
    notes: 'ผ่าฟันคุดล่างขวา ใช้เวลา 45 นาที ไม่มีภาวะแทรกซ้อน',
    hasXray: true,
  },
];

export interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  diagnosisEn: string;
  medications: Medication[];
  status: 'pending' | 'delivered' | 'collected';
  deliveryMethod: 'home' | 'clinic' | 'pharmacy' | null;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx1',
    date: '2026-05-15',
    doctorName: 'ทพ. วิชัย สุขภาพดี',
    diagnosis: 'อุดฟันผุซี่ 46',
    diagnosisEn: 'Filling Tooth #46',
    medications: [
      {
        name: 'Ibuprofen 400mg',
        dosage: '1 เม็ด',
        frequency: 'วันละ 3 ครั้ง หลังอาหาร',
        duration: '3 วัน',
        instructions: 'ทานเมื่อมีอาการปวด',
      },
      {
        name: 'Amoxicillin 500mg',
        dosage: '1 แคปซูล',
        frequency: 'วันละ 3 ครั้ง หลังอาหาร',
        duration: '5 วัน',
        instructions: 'ทานให้ครบตามที่กำหนด',
      },
    ],
    status: 'collected',
    deliveryMethod: 'clinic',
  },
  {
    id: 'rx2',
    date: '2025-06-05',
    doctorName: 'ทพ. วิชัย สุขภาพดี',
    diagnosis: 'ผ่าฟันคุดซี่ 48',
    diagnosisEn: 'Wisdom Tooth Extraction #48',
    medications: [
      {
        name: 'Mefenamic Acid 500mg',
        dosage: '1 เม็ด',
        frequency: 'วันละ 3 ครั้ง หลังอาหาร',
        duration: '5 วัน',
        instructions: 'ทานเมื่อมีอาการปวด',
      },
      {
        name: 'Amoxicillin 500mg',
        dosage: '1 แคปซูล',
        frequency: 'วันละ 3 ครั้ง หลังอาหาร',
        duration: '7 วัน',
        instructions: 'ทานให้ครบตามที่กำหนด ห้ามหยุดยาเอง',
      },
      {
        name: 'Chlorhexidine Mouthwash',
        dosage: '15 ml',
        frequency: 'วันละ 2 ครั้ง เช้า-เย็น',
        duration: '7 วัน',
        instructions: 'บ้วนปาก 30 วินาที ห้ามกลืน',
      },
    ],
    status: 'delivered',
    deliveryMethod: 'home',
  },
];
