'use client'
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Smile, ExternalLink } from "lucide-react";
import Link from "next/link";
import { appRoutes } from "@/app-routes";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isOutgoing: boolean;
}

interface Thread {
  id: string;
  leadId: string;
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  messages: Message[];
  campaignId: string;
  campaignName: string;
  sourceList: string;
  status: "replied" | "pending" | "connected";
}

const mockThreads: Thread[] = [
  {
    id: "1",
    leadId: "lead-1",
    leadName: "Sarah Jenkins",
    leadTitle: "VP of Sales",
    leadCompany: "TechCorp",
    lastMessage: "Thanks for reaching out! Can you share more details about pricing?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: true,
    campaignId: "camp-1",
    campaignName: "Tech Leaders Q1",
    sourceList: "Sales Nav Export",
    status: "replied",
    messages: [
      {
        id: "m1",
        senderId: "you",
        content: "Hi Sarah, I noticed you're leading the sales team at TechCorp. I'd love to share how we're helping similar companies scale their outreach.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isOutgoing: true,
      },
      {
        id: "m2",
        senderId: "lead-1",
        content: "Hi! Yes, I'd be interested to learn more. What does your solution offer?",
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
        isOutgoing: false,
      },
      {
        id: "m3",
        senderId: "you",
        content: "We help sales teams automate their LinkedIn outreach while maintaining personalization. Teams typically see 3x more qualified conversations.",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
        isOutgoing: true,
      },
      {
        id: "m4",
        senderId: "lead-1",
        content: "Thanks for reaching out! Can you share more details about pricing?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOutgoing: false,
      },
    ],
  },
  {
    id: "2",
    leadId: "lead-2",
    leadName: "Mike Ross",
    leadTitle: "Director of Marketing",
    leadCompany: "Growth Inc",
    lastMessage: "Not interested at the moment, but I'll keep you in mind.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unread: false,
    campaignId: "camp-1",
    campaignName: "Tech Leaders Q1",
    sourceList: "Sales Nav Export",
    status: "replied",
    messages: [
      {
        id: "m5",
        senderId: "you",
        content: "Hey Mike, saw your recent post about scaling marketing operations. We help marketing teams like yours automate outreach without losing the personal touch.",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        isOutgoing: true,
      },
      {
        id: "m6",
        senderId: "lead-2",
        content: "Not interested at the moment, but I'll keep you in mind.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isOutgoing: false,
      },
    ],
  },
  {
    id: "3",
    leadId: "lead-3",
    leadName: "Emma Wilson",
    leadTitle: "CEO",
    leadCompany: "StartupHub",
    lastMessage: "This sounds promising! When can we schedule a demo?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    unread: true,
    campaignId: "camp-2",
    campaignName: "Startup Founders",
    sourceList: "YC Directory",
    status: "replied",
    messages: [
      {
        id: "m7",
        senderId: "you",
        content: "Hi Emma, congrats on your recent funding round! I help founders like you build scalable outreach systems.",
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        isOutgoing: true,
      },
      {
        id: "m8",
        senderId: "lead-3",
        content: "Thanks! We're definitely looking for ways to scale our BD efforts. What does your platform do exactly?",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        isOutgoing: false,
      },
      {
        id: "m9",
        senderId: "you",
        content: "We automate LinkedIn outreach with personalized sequences. You can manage thousands of conversations while maintaining that personal touch.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isOutgoing: true,
      },
      {
        id: "m10",
        senderId: "lead-3",
        content: "This sounds promising! When can we schedule a demo?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isOutgoing: false,
      },
    ],
  },
  {
    id: "4",
    leadId: "lead-4",
    leadName: "David Chen",
    leadTitle: "Head of Business Development",
    leadCompany: "Enterprise Solutions",
    lastMessage: "We just sent a connection request!",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    unread: false,
    campaignId: "camp-1",
    campaignName: "Tech Leaders Q1",
    sourceList: "LinkedIn Search",
    status: "pending",
    messages: [
      {
        id: "m11",
        senderId: "you",
        content: "We just sent a connection request!",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isOutgoing: true,
      },
    ],
  },
];

const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${diffInDays}d`;
};

export default function Inbox() {
  const [selectedThread, setSelectedThread] = useState<Thread>(mockThreads[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [notes, setNotes] = useState("");

  const filteredThreads = mockThreads.filter((thread) =>
    thread.leadName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // Mock sending message
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "replied":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "connected":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Pane 1: Thread List */}
      <Card className="w-1/4 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${selectedThread.id === thread.id
                  ? "bg-primary/10 border-primary border"
                  : "hover:bg-muted"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {thread.leadName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm truncate">
                        {thread.leadName}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {getTimeAgo(thread.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate flex-1">
                        {thread.lastMessage}
                      </p>
                      {thread.unread && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Pane 2: Conversation View */}
      <Card className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">{selectedThread.leadName}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedThread.leadTitle} at {selectedThread.leadCompany}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View LinkedIn Profile
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {selectedThread.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOutgoing ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${message.isOutgoing
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${message.isOutgoing ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="min-h-[60px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-9 w-9" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Pane 3: CRM Context */}
      <Card className="w-1/4 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {selectedThread.leadName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{selectedThread.leadName}</h3>
              <p className="text-sm text-muted-foreground">{selectedThread.leadTitle}</p>
              <p className="text-sm text-muted-foreground">{selectedThread.leadCompany}</p>
            </div>

            {/* Context Details */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Campaign
                </label>
                <Link
                  href={appRoutes.appCampaignDetails.replace(":campaignId", selectedThread.campaignId)}
                  className="block mt-1 text-sm text-primary hover:underline"
                >
                  {selectedThread.campaignName}
                </Link>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Source List
                </label>
                <p className="mt-1 text-sm">{selectedThread.sourceList}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant="outline" className={getStatusColor(selectedThread.status)}>
                    {selectedThread.status.charAt(0).toUpperCase() +
                      selectedThread.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase mb-2 block">
                  Private Notes
                </label>
                <Textarea
                  placeholder="Add notes about this lead..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
