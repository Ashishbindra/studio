export interface Worker {
  id: string;
  name: string;
  photoUrl: string;
  dailyWage: number;
  phoneNumber: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  workerId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent';
  checkIn?: Date;
  checkOut?: Date;
}

export interface Payment {
  id: string;
  workerId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  note?: string;
}
