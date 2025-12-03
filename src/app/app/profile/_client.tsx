'use client'
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
// import { Toggle } from "@/components/ui/toggle";
import { User, Activity, CreditCard, CheckCircle, UserPlus, MessageSquare, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

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

type TabKey = "profile" | "activity" | "billing";

export const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

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

  const toggleDay = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, "0")}:00 ${period}`;
  };

  const tabs = [
    { key: "profile" as TabKey, label: "Profile & Account", icon: User },
    { key: "activity" as TabKey, label: "Activity & Limits", icon: Activity },
    { key: "billing" as TabKey, label: "Billing", icon: CreditCard },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* LinkedIn Connection Card */}
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Connection</CardTitle>
          <CardDescription>Manage your connected LinkedIn account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">John Doe</p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="lg">
              Reconnect Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
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
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border">
            <div>
              <p className="text-sm text-muted-foreground">Your Plan</p>
              <p className="text-2xl font-bold">Pro</p>
              <p className="text-lg font-semibold text-primary">$29/mo</p>
            </div>
            <Button size="lg">Manage Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>Your current usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-sm text-muted-foreground">Connections Sent</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">3,567</p>
              <p className="text-sm text-muted-foreground">Messages Sent</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold">8,901</p>
              <p className="text-sm text-muted-foreground">Profile Visits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="lg:w-64 shrink-0">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "activity" && renderActivityTab()}
          {activeTab === "billing" && renderBillingTab()}
        </main>
      </div>
    </div>
  );
};
