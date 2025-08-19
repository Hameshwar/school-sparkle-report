import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "@/components/MetricCard";
import { Users, Calendar, TrendingUp, Clock } from "lucide-react";
import { mockStudents, mockAttendanceRecords } from "@/data/mockData";
import { ClassStats } from "@/types/attendance";

export default function Dashboard() {
  const [stats, setStats] = useState<ClassStats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    averageAttendance: 0
  });

  useEffect(() => {
    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = mockAttendanceRecords.filter(record => record.date === today);
    
    const presentToday = todayRecords.filter(record => record.status === "present").length;
    const absentToday = todayRecords.filter(record => record.status === "absent").length;
    const lateToday = todayRecords.filter(record => record.status === "late").length;

    // Calculate average attendance over last 30 days
    const totalRecords = mockAttendanceRecords.length;
    const presentRecords = mockAttendanceRecords.filter(record => 
      record.status === "present" || record.status === "late"
    ).length;
    const averageAttendance = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

    setStats({
      totalStudents: mockStudents.length,
      presentToday,
      absentToday,
      lateToday,
      averageAttendance: Math.round(averageAttendance)
    });
  }, []);

  const recentActivity = [
    { student: "Emma Johnson", action: "Marked Present", time: "9:00 AM" },
    { student: "Liam Williams", action: "Marked Late", time: "9:15 AM" },
    { student: "Olivia Brown", action: "Marked Present", time: "8:55 AM" },
    { student: "Noah Davis", action: "Marked Absent", time: "10:00 AM" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of today's attendance and recent activity
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="h-4 w-4" />}
          description="Enrolled in Grade 10"
          variant="info"
        />
        <MetricCard
          title="Present Today"
          value={stats.presentToday}
          icon={<Calendar className="h-4 w-4" />}
          description={`${Math.round((stats.presentToday / stats.totalStudents) * 100)}% attendance rate`}
          variant="success"
        />
        <MetricCard
          title="Average Attendance"
          value={`${stats.averageAttendance}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Last 30 days"
          trend={{ value: 2.5, label: "vs last month" }}
          variant="default"
        />
        <MetricCard
          title="Late Arrivals"
          value={stats.lateToday}
          icon={<Clock className="h-4 w-4" />}
          description="Today"
          variant="warning"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Present</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success"
                      style={{ width: `${(stats.presentToday / stats.totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{stats.presentToday}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Absent</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-destructive"
                      style={{ width: `${(stats.absentToday / stats.totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{stats.absentToday}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Late</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-warning"
                      style={{ width: `${(stats.lateToday / stats.totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{stats.lateToday}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{activity.student}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}