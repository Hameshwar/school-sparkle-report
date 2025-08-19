export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  rollNumber: string;
  dateOfBirth: string;
  parentContact: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}

export interface ClassStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageAttendance: number;
}