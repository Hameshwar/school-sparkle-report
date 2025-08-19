import { Student, AttendanceRecord } from "@/types/attendance";

export const mockStudents: Student[] = [
  {
    id: "1",
    firstName: "Emma",
    lastName: "Johnson",
    email: "emma.johnson@school.edu",
    grade: "10",
    rollNumber: "2024001",
    dateOfBirth: "2008-03-15",
    parentContact: "+1-555-0123"
  },
  {
    id: "2",
    firstName: "Liam",
    lastName: "Williams",
    email: "liam.williams@school.edu",
    grade: "10",
    rollNumber: "2024002",
    dateOfBirth: "2008-07-22",
    parentContact: "+1-555-0124"
  },
  {
    id: "3",
    firstName: "Olivia",
    lastName: "Brown",
    email: "olivia.brown@school.edu",
    grade: "10",
    rollNumber: "2024003",
    dateOfBirth: "2008-11-08",
    parentContact: "+1-555-0125"
  },
  {
    id: "4",
    firstName: "Noah",
    lastName: "Davis",
    email: "noah.davis@school.edu",
    grade: "10",
    rollNumber: "2024004",
    dateOfBirth: "2008-01-30",
    parentContact: "+1-555-0126"
  },
  {
    id: "5",
    firstName: "Ava",
    lastName: "Miller",
    email: "ava.miller@school.edu",
    grade: "10",
    rollNumber: "2024005",
    dateOfBirth: "2008-09-12",
    parentContact: "+1-555-0127"
  },
  {
    id: "6",
    firstName: "Ethan",
    lastName: "Wilson",
    email: "ethan.wilson@school.edu",
    grade: "10",
    rollNumber: "2024006",
    dateOfBirth: "2008-05-18",
    parentContact: "+1-555-0128"
  }
];

// Generate mock attendance data for the last 30 days
export const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: ("present" | "absent" | "late" | "excused")[] = ["present", "absent", "late", "excused"];
  const weights = [0.85, 0.08, 0.05, 0.02]; // Present: 85%, Absent: 8%, Late: 5%, Excused: 2%

  for (let day = 0; day < 30; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString().split('T')[0];

    mockStudents.forEach(student => {
      const random = Math.random();
      let status: "present" | "absent" | "late" | "excused" = "present";
      let cumulative = 0;
      
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) {
          status = statuses[i];
          break;
        }
      }

      records.push({
        id: `${student.id}-${dateStr}`,
        studentId: student.id,
        date: dateStr,
        status,
        remarks: status === "late" ? "Arrived 15 minutes late" : 
                status === "excused" ? "Doctor's appointment" : 
                status === "absent" ? "No reason provided" : undefined
      });
    });
  }

  return records;
};

export const mockAttendanceRecords = generateMockAttendance();