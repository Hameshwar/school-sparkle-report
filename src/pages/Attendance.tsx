import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Save, Users, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { mockStudents, mockAttendanceRecords } from "@/data/mockData";
import { Student, AttendanceRecord } from "@/types/attendance";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, "present" | "absent" | "late" | "excused">>(() => {
    // Initialize with today's data if it exists
    const todayRecords = mockAttendanceRecords.filter(record => record.date === selectedDate);
    const initial: Record<string, "present" | "absent" | "late" | "excused"> = {};
    todayRecords.forEach(record => {
      initial[record.studentId] = record.status;
    });
    return initial;
  });

  const updateAttendance = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const getStatusIcon = (status?: "present" | "absent" | "late" | "excused") => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "late":
        return <Clock className="h-4 w-4 text-warning" />;
      case "excused":
        return <AlertCircle className="h-4 w-4 text-info" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  const getStatusBadge = (status?: "present" | "absent" | "late" | "excused") => {
    if (!status) return null;
    
    const variants = {
      present: "bg-success/10 text-success border-success/20",
      absent: "bg-destructive/10 text-destructive border-destructive/20",
      late: "bg-warning/10 text-warning border-warning/20",
      excused: "bg-info/10 text-info border-info/20"
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = {
    present: Object.values(attendanceData).filter(status => status === "present").length,
    absent: Object.values(attendanceData).filter(status => status === "absent").length,
    late: Object.values(attendanceData).filter(status => status === "late").length,
    excused: Object.values(attendanceData).filter(status => status === "excused").length,
  };

  const handleSave = () => {
    console.log("Saving attendance for", selectedDate, attendanceData);
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">
            Mark student attendance for {new Date(selectedDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-md text-sm bg-background"
            />
          </div>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-success">{stats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-warning">{stats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Excused</p>
                <p className="text-2xl font-bold text-info">{stats.excused}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Student Attendance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{student.firstName} {student.lastName}</p>
                    <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {getStatusBadge(attendanceData[student.id])}
                  <div className="flex space-x-2">
                    <Button
                      variant={attendanceData[student.id] === "present" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateAttendance(student.id, "present")}
                      className={attendanceData[student.id] === "present" ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      variant={attendanceData[student.id] === "absent" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateAttendance(student.id, "absent")}
                      className={attendanceData[student.id] === "absent" ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : ""}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                    <Button
                      variant={attendanceData[student.id] === "late" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateAttendance(student.id, "late")}
                      className={attendanceData[student.id] === "late" ? "bg-warning hover:bg-warning/90 text-warning-foreground" : ""}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Late
                    </Button>
                    <Button
                      variant={attendanceData[student.id] === "excused" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateAttendance(student.id, "excused")}
                      className={attendanceData[student.id] === "excused" ? "bg-info hover:bg-info/90 text-info-foreground" : ""}
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Excused
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}