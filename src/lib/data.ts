import type { Worker, Attendance, Payment } from './types';

export const workers: Worker[] = [
  {
    id: 'w1',
    name: 'Suresh Patel',
    photoUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    dailyWage: 600,
    phoneNumber: '9876543210',
  },
  {
    id: 'w2',
    name: 'Meena Kumari',
    photoUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    dailyWage: 550,
    phoneNumber: '9876543211',
  },
  {
    id: 'w3',
    name: 'Rajesh Singh',
    photoUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'male worker',
    dailyWage: 650,
    phoneNumber: '9876543212',
  },
  {
    id: 'w4',
    name: 'Anita Devi',
    photoUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'female worker',
    dailyWage: 550,
    phoneNumber: '9876543213',
  },
];

export const attendances: Attendance[] = [
  // Suresh's attendance
  { id: 'a1', workerId: 'w1', date: '2023-10-01', status: 'present' },
  { id: 'a2', workerId: 'w1', date: '2023-10-02', status: 'present' },
  { id: 'a3', workerId: 'w1', date: '2023-10-03', status: 'absent' },
  { id: 'a4', workerId: 'w1', date: '2023-10-04', status: 'present' },
  { id: 'a5', workerId: 'w1', date: '2023-10-05', status: 'present' },

  // Meena's attendance
  { id: 'a6', workerId: 'w2', date: '2023-10-01', status: 'present' },
  { id: 'a7', workerId: 'w2', date: '2023-10-02', status: 'present' },
  { id: 'a8', workerId: 'w2', date: '2023-10-03', status: 'present' },
  { id: 'a9', workerId: 'w2', date: '2023-10-04', status: 'present' },
  { id: 'a10', workerId: 'w2', date: '2023-10-05', status: 'absent' },

  // Rajesh's attendance
  { id: 'a11', workerId: 'w3', date: '2023-10-01', status: 'present' },
  { id: 'a12', workerId: 'w3', date: '2023-10-02', status: 'present' },
  { id: 'a13', workerId: 'w3', date: '2023-10-03', status: 'present' },
  { id: 'a14', workerId: 'w3', date: '2023-10-04', status: 'present' },
  { id: 'a15', workerId: 'w3', date: '2023-10-05', status: 'present' },
];

export const payments: Payment[] = [
  // Suresh's payments
  { id: 'p1', workerId: 'w1', date: '2023-10-05', amount: 2000 },
  
  // Meena's payments
  { id: 'p2', workerId: 'w2', date: '2023-10-05', amount: 2200 },

  // Rajesh's payments
  { id: 'p3', workerId: 'w3', date: '2023-10-05', amount: 300 },
];
