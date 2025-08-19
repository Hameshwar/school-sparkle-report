import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";
import { mockStudents, mockAttendanceRecords } from "@/data/mockData";
import { AttendanceStats } from "@/types/attendance";

export default function Reports() {
  const [studentStats, setStudentStats] = useState<(AttendanceStats & { student: any })[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalDays: 30,
    averageAttendance: 0,
    perfectAttendance: 0,
    belowThreshold: 0,
  });

  useEffect(() => {
    // Calculate individual student stats
    const stats = mockStudents.map(student => {
      const studentRecords = mockAttendanceRecords.filter(record => record.studentId === student.id);
      const totalDays = studentRecords.length;
      const presentDays = studentRecords.filter(record => 
        record.status === "present" || record.status === "late"
      ).length;
      const absentDays = studentRecords.filter(record => record.status === "absent").length;
      const lateDays = studentRecords.filter(record => record.status === "late").length;
      const excusedDays = studentRecords.filter(record => record.status === "excused").length;
      const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        student,
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        excusedDays,
        attendanceRate
      };
    });

    setStudentStats(stats);

    // Calculate overall stats
    const averageAttendance = stats.reduce((sum, stat) => sum + stat.attendanceRate, 0) / stats.length;
    const perfectAttendance = stats.filter(stat => stat.attendanceRate === 100).length;
    const belowThreshold = stats.filter(stat => stat.attendanceRate < 85).length;

    setOverallStats({
      totalDays: 30,
      averageAttendance: Math.round(averageAttendance),
      perfectAttendance,
      belowThreshold,
    });
  }, []);

  // Chart data
  const chartData = studentStats.map(stat => ({
    name: `${stat.student.firstName} ${stat.student.lastName}`,
    attendance: Math.round(stat.attendanceRate),
    present: stat.presentDays,
    absent: stat.absentDays,
    late: stat.lateDays,
  }));

  const pieData = [
    { name: "Present", value: studentStats.reduce((sum, stat) => sum + stat.presentDays, 0), color: "#22c55e" },
    { name: "Absent", value: studentStats.reduce((sum, stat) => sum + stat.absentDays, 0), color: "#ef4444" },
    { name: "Late", value: studentStats.reduce((sum, stat) => sum + stat.lateDays, 0), color: "#f59e0b" },
    { name: "Excused", value: studentStats.reduce((sum, stat) => sum + stat.excusedDays, 0), color: "#3b82f6" },
  ];

  // Generate trend data for the last 7 days
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayRecords = mockAttendanceRecords.filter(record => record.date === dateStr);
    const presentCount = dayRecords.filter(record => 
      record.status === "present" || record.status === "late"
    ).length;
    const attendanceRate = dayRecords.length > 0 ? (presentCount / dayRecords.length) * 100 : 0;

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      attendance: Math.round(attendanceRate),
    };
  });

  const handleDownloadReport = () => {
    // In a real application, this would generate and download a PDF report
    console.log("Downloading attendance report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Final Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive attendance analysis and statistics
          </p>
        </div>
        <Button onClick={handleDownloadReport} className="bg-primary hover:bg-primary/90">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-info/20 bg-info/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{mockStudents.length}</p>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
                <p className="text-2xl font-bold text-foreground">{overallStats.averageAttendance}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Perfect Attendance</p>
                <p className="text-2xl font-bold text-foreground">{overallStats.perfectAttendance}</p>
              </div>
              <Award className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Below 85%</p>
                <p className="text-2xl font-bold text-foreground">{overallStats.belowThreshold}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Individual Student Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Student Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, "Attendance Rate"]} />
              <Bar dataKey="attendance" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Student Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Student Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">Roll Number</th>
                  <th className="text-left p-3 font-medium">Present Days</th>
                  <th className="text-left p-3 font-medium">Absent Days</th>
                  <th className="text-left p-3 font-medium">Late Days</th>
                  <th className="text-left p-3 font-medium">Attendance Rate</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentStats.map((stat) => (
                  <tr key={stat.student.id} className="border-b border-border/50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {stat.student.firstName.charAt(0)}{stat.student.lastName.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">
                          {stat.student.firstName} {stat.student.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{stat.student.rollNumber}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {stat.presentDays}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        {stat.absentDays}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        {stat.lateDays}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">{Math.round(stat.attendanceRate)}%</span>
                    </td>
                    <td className="p-3">
                      {stat.attendanceRate >= 95 ? (
                        <Badge className="bg-success/10 text-success border-success/20">Excellent</Badge>
                      ) : stat.attendanceRate >= 85 ? (
                        <Badge className="bg-info/10 text-info border-info/20">Good</Badge>
                      ) : stat.attendanceRate >= 75 ? (
                        <Badge className="bg-warning/10 text-warning border-warning/20">Fair</Badge>
                      ) : (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">Needs Attention</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}