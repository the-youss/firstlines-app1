'use client'
import { Fragment, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
// import { Toggle } from "@/components/ui/toggle";
import { User, Activity, CreditCard, CheckCircle, UserPlus, MessageSquare, Eye, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkedInSessionStatus } from "@/components/linkedin-session-status";
import { useSession } from "@/lib/auth/client";
import { ProfileTab } from "./profile-tab";
import { ActivityTab } from "./activity-tab";
import { BillingTab } from "./billing-tab";

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
  const { data: session, isPending } = useSession()
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
                  "w-full flex items-center  cursor-pointer gap-3 px-4 py-3 rounded-lg text-left transition-colors",
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
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "activity" && <ActivityTab />}
          {activeTab === "billing" && <BillingTab />}
        </main>
      </div>
    </div>
  );
};
