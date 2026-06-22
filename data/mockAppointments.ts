export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled' | 'waiting';

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceNameEn: string;
  doctorId: string;
  doctorName: string;
  date: string; // ISO date string
  time: string; // HH:mm
  duration: number; // minutes
  status: AppointmentStatus;
  clinicName: string;
  clinicAddress: string;
  notes?: string;
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 5);
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);
const twoMonthsAgo = new Date(today);
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

const formatDate = (d: Date) => d.toISOString().split('T')[0];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    serviceId: 'scaling',
    serviceName: 'ขูดหินปูน',
    serviceNameEn: 'Scaling',
    doctorId: 'dr1',
    doctorName: 'ทพญ. สมศรี รักษาฟัน',
    date: formatDate(nextWeek),
    time: '10:00',
    duration: 30,
    status: 'confirmed',
    clinicName: 'DentAI Clinic สาขาสยาม',
    clinicAddress: '123 ถ.พระราม 1 ปทุมวัน กรุงเทพฯ 10330',
    notes: 'ขูดหินปูนครบ 6 เดือน',
  },
  {
    id: 'apt2',
    serviceId: 'filling',
    serviceName: 'อุดฟัน',
    serviceNameEn: 'Filling',
    doctorId: 'dr2',
    doctorName: 'ทพ. วิชัย สุขภาพดี',
    date: formatDate(lastMonth),
    time: '14:00',
    duration: 45,
    status: 'completed',
    clinicName: 'DentAI Clinic สาขาสยาม',
    clinicAddress: '123 ถ.พระราม 1 ปทุมวัน กรุงเทพฯ 10330',
  },
  {
    id: 'apt3',
    serviceId: 'checkup',
    serviceName: 'ตรวจสุขภาพฟัน',
    serviceNameEn: 'Dental Checkup',
    doctorId: 'dr1',
    doctorName: 'ทพญ. สมศรี รักษาฟัน',
    date: formatDate(twoMonthsAgo),
    time: '09:30',
    duration: 30,
    status: 'completed',
    clinicName: 'DentAI Clinic สาขาสยาม',
    clinicAddress: '123 ถ.พระราม 1 ปทุมวัน กรุงเทพฯ 10330',
  },
  {
    id: 'apt4',
    serviceId: 'whitening',
    serviceName: 'ฟอกสีฟัน',
    serviceNameEn: 'Teeth Whitening',
    doctorId: 'dr3',
    doctorName: 'ทพญ. นภา ยิ้มสวย',
    date: formatDate(twoMonthsAgo),
    time: '11:00',
    duration: 60,
    status: 'cancelled',
    clinicName: 'DentAI Clinic สาขาสยาม',
    clinicAddress: '123 ถ.พระราม 1 ปทุมวัน กรุงเทพฯ 10330',
    notes: 'คนไข้ยกเลิกเนื่องจากติดธุระ',
  },
];

export const getUpcomingAppointments = () =>
  mockAppointments.filter(
    (apt) => apt.status === 'confirmed' && new Date(apt.date) >= today
  );

export const getPastAppointments = () =>
  mockAppointments.filter(
    (apt) => apt.status === 'completed' || apt.status === 'cancelled'
  );

export const getNextAppointment = () => {
  const upcoming = getUpcomingAppointments();
  return upcoming.length > 0 ? upcoming[0] : null;
};
