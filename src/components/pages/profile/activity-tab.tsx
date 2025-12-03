'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
// import { Toggle } from "@/components/ui/toggle";
import { useSession } from "@/lib/auth/client";
import { Eye, MessageSquare, UserPlus } from "lucide-react";

const TIMEZONES = [
  { value: "America/New_York", label: "(UTC-05:00) Eastern Time" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time" },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time" },
  { value: "Europe/London", label: "(UTC+00:00) London" },
  { value: "Europe/Paris", label: "(UTC+01:00) Paris" },
  { value: "Europe/Berlin", label: "(UTC+01:00) Berlin" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo" },
  { value: "Asia/Singapore", label: "(UTC+08:00) Singapore" },
  { value: "Australia/Sydney", label: "(UTC+11:00) Sydney" },
];

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];
const formatTime = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour.toString().padStart(2, "0")}:00 ${period}`;
};
export const ActivityTab = () => {
  const { data: session, isPending } = useSession()

  // Profile & Account state
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Activity & Limits state
  const [timezone, setTimezone] = useState("America/New_York");
  const [workingDays, setWorkingDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
  const [workingHours, setWorkingHours] = useState([9, 17]);
  const [connectionLimit, setConnectionLimit] = useState(20);
  const [messageLimit, setMessageLimit] = useState(50);
  const [profileVisitLimit, setProfileVisitLimit] = useState(100);
  return <div className="space-y-6">
    {/* Timezone */}
    <Card>
      <CardHeader>
        <CardTitle>Timezone</CardTitle>
        <CardDescription>Set your local timezone for scheduling</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>

    {/* Working Days */}
    <Card>
      <CardHeader>
        <CardTitle>Working Days</CardTitle>
        <CardDescription>Select which days campaigns should be active</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <Toggle
                key={day.key}
                pressed={workingDays.includes(day.key)}
                onPressedChange={() => toggleDay(day.key)}
                variant="outline"
                className={cn(
                  "w-14 h-10 font-medium",
                  workingDays.includes(day.key) && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                )}
              >
                {day.label}
              </Toggle>
            ))}
          </div> */}
      </CardContent>
    </Card>

    {/* Working Hours */}
    <Card>
      <CardHeader>
        <CardTitle>Working Hours</CardTitle>
        <CardDescription>Set the time range for daily activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="px-2">
          <Slider
            value={workingHours}
            onValueChange={setWorkingHours}
            min={0}
            max={24}
            step={1}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>00:00</span>
          <span className="font-semibold text-foreground">
            {formatTime(workingHours[0])} - {formatTime(workingHours[1])}
          </span>
          <span>24:00</span>
        </div>
      </CardContent>
    </Card>

    {/* Daily Limits */}
    <Card>
      <CardHeader>
        <CardTitle>Daily Limits</CardTitle>
        <CardDescription>Set maximum actions per day to stay safe</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Connection Requests</p>
                <Input
                  type="number"
                  value={connectionLimit}
                  onChange={(e) => setConnectionLimit(Number(e.target.value))}
                  className="w-20 text-center text-lg font-bold"
                  min={1}
                  max={100}
                />
                <p className="text-xs text-muted-foreground">Max per day</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <Input
                  type="number"
                  value={messageLimit}
                  onChange={(e) => setMessageLimit(Number(e.target.value))}
                  className="w-20 text-center text-lg font-bold"
                  min={1}
                  max={200}
                />
                <p className="text-xs text-muted-foreground">Max per day</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Profile Visits</p>
                <Input
                  type="number"
                  value={profileVisitLimit}
                  onChange={(e) => setProfileVisitLimit(Number(e.target.value))}
                  className="w-20 text-center text-lg font-bold"
                  min={1}
                  max={500}
                />
                <p className="text-xs text-muted-foreground">Max per day</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
};