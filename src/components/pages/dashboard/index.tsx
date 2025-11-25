
'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, UserPlus, CheckCircle2, MessageSquare, Reply } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Dashboard = () => {
  const metrics = [
    {
      title: "Connections Sent",
      value: "247",
      change: "+12.5%",
      trend: "up",
      icon: UserPlus,
    },
    {
      title: "Connections Accepted",
      value: "183",
      change: "+8.2%",
      trend: "up",
      icon: CheckCircle2,
    },
    {
      title: "Messages Sent",
      value: "156",
      change: "+15.3%",
      trend: "up",
      icon: MessageSquare,
    },
    {
      title: "Message Replies",
      value: "64",
      change: "-2.1%",
      trend: "down",
      icon: Reply,
    },
  ];


  const chartData = [
    { date: "Mon", sent: 35, accepted: 28 },
    { date: "Tue", sent: 42, accepted: 32 },
    { date: "Wed", sent: 38, accepted: 30 },
    { date: "Thu", sent: 45, accepted: 35 },
    { date: "Fri", sent: 40, accepted: 33 },
    { date: "Sat", sent: 25, accepted: 18 },
    { date: "Sun", sent: 22, accepted: 17 },
  ];

  const recentActivity = [
    { name: "Jane Doe", action: "accepted your connection request", time: "2 min ago", avatar: "JD" },
    { name: "Mike Smith", action: "replied to your message", time: "15 min ago", avatar: "MS" },
    { name: "Sarah Johnson", action: "viewed your profile", time: "1 hour ago", avatar: "SJ" },
    { name: "Tom Wilson", action: "accepted your connection request", time: "2 hours ago", avatar: "TW" },
    { name: "Emma Brown", action: "replied to your message", time: "3 hours ago", avatar: "EB" },
  ];


  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs">
                {metric.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                )}
                <span className={metric.trend === "up" ? "text-success" : "text-destructive"}>
                  {metric.change}
                </span>
                <span className="ml-1 text-muted-foreground">from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Activity Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sent"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Sent"
                />
                <Line
                  type="monotone"
                  dataKey="accepted"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  name="Accepted"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs">{activity.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.name}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

