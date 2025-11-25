'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  UserCheck,
  MessageCircle,
  Reply,
  Plus,
  Trash2,
  Clock,
  MessageSquare,
  UserPlus,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

type StepType = "connection" | "wait" | "message";

interface SequenceStep {
  id: string;
  type: StepType;
  content?: string;
  days?: number;
}

export const CampaignDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("stats");
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedList, setSelectedList] = useState("1");
  const [excludeActive, setExcludeActive] = useState(true);
  const [sequenceSteps, setSequenceSteps] = useState<SequenceStep[]>([
    { id: "1", type: "connection", content: "Hi {{firstName}}, I'd love to connect!" },
    { id: "2", type: "wait", days: 2 },
    { id: "3", type: "message", content: "Thanks for connecting! I wanted to reach out about..." },
  ]);
  const [timezone, setTimezone] = useState("America/New_York");
  const [dailyLimit, setDailyLimit] = useState([25]);

  // Mock campaign data
  const campaign = {
    id: parseInt(id || "1"),
    name: "Tech Leaders Outreach",
    status: "Active" as const,
    totalLeads: 2450,
    leadsContacted: 1593,
    connectionsAccepted: 1179,
    replies: 484,
  };

  // Mock pipeline data
  const pipelineStages = [
    { step: "Connection Request", count: 872, icon: UserPlus },
    { step: "Wait 2 days", count: 456, icon: Clock },
    { step: "Follow-up Message", count: 265, icon: MessageSquare },
  ];

  // Mock upcoming actions
  const upcomingActions = [
    { id: 1, icon: MessageSquare, action: "Message 1", leadName: "Sarah White", timeRemaining: "in 17 min" },
    { id: 2, icon: UserPlus, action: "Connection Request", leadName: "Michael Chen", timeRemaining: "in 42 min" },
    { id: 3, icon: MessageSquare, action: "Message 2", leadName: "Emily Rodriguez", timeRemaining: "in 1h 15min" },
    { id: 4, icon: UserPlus, action: "Connection Request", leadName: "David Park", timeRemaining: "in 2h 8min" },
    { id: 5, icon: MessageSquare, action: "Follow-up", leadName: "Jessica Thompson", timeRemaining: "in 3h 45min" },
  ];

  const lists = [
    { id: "1", name: "Q1 Prospects", count: 124 },
    { id: "2", name: "Tech Executives", count: 89 },
    { id: "3", name: "Marketing Directors", count: 67 },
  ];

  const mockProspects = [
    { name: "Sarah Johnson", title: "VP Sales", company: "TechCorp", avatar: "SJ" },
    { name: "Mike Chen", title: "CMO", company: "Growth Labs", avatar: "MC" },
    { name: "Emily Rodriguez", title: "CEO", company: "Startup XYZ", avatar: "ER" },
  ];

  const wizardSteps = [
    { number: 1, title: "Leads", description: "Select your target list" },
    { number: 2, title: "Sequence", description: "Build your campaign steps" },
    { number: 3, title: "Schedule", description: "Configure timing" },
    { number: 4, title: "Preview", description: "Review & launch" },
  ];

  const addStep = (type: StepType) => {
    const newStep: SequenceStep = {
      id: Date.now().toString(),
      type,
      ...(type === "wait" ? { days: 2 } : { content: "" }),
    };
    setSequenceSteps([...sequenceSteps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSequenceSteps(sequenceSteps.filter((step) => step.id !== stepId));
  };

  const updateStep = (stepId: string, field: keyof SequenceStep, value: string | number) => {
    setSequenceSteps(
      sequenceSteps.map((step) => (step.id === stepId ? { ...step, [field]: value } : step))
    );
  };

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case "connection":
        return <UserPlus className="h-4 w-4" />;
      case "wait":
        return <Clock className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-success/10 text-success border-success/20",
      Paused: "bg-amber-100 text-amber-700 border-amber-200",
      Draft: "bg-muted text-muted-foreground border-border",
      Completed: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return variants[status as keyof typeof variants] || "";
  };

  return (

    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">{campaign.name}</h1>
          <Badge variant="outline" className={getStatusBadge(campaign.status)}>
            {campaign.status}
          </Badge>
        </div>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <Tabs value={currentTab} className="w-full">
        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.totalLeads.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Contacted</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.leadsContacted.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((campaign.leadsContacted / campaign.totalLeads) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connections Accepted</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.connectionsAccepted.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((campaign.connectionsAccepted / campaign.leadsContacted) * 100)}% acceptance rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Replies</CardTitle>
                <Reply className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.replies.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((campaign.replies / campaign.connectionsAccepted) * 100)}% reply rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pipeline Visualizer */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Visualizer</CardTitle>
                <CardDescription>Leads waiting at each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pipelineStages.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                          <stage.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{stage.step}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-base px-3 py-1">
                        {stage.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Activity Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Actions</CardTitle>
                <CardDescription>Next 5 scheduled tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingActions.map((action) => (
                    <div key={action.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <action.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {action.action} to {action.leadName}
                        </p>
                        <p className="text-xs text-muted-foreground">{action.timeRemaining}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Edit Tab */}
        <TabsContent value="edit" className="space-y-6">
          {/* Alert Banner for Active Campaigns */}
          {campaign.status === "Active" && (
            <Alert className="border-amber-200 bg-amber-50 text-amber-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You must pause the campaign to edit steps or settings.
              </AlertDescription>
            </Alert>
          )}

          {/* Campaign Wizard Content */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex justify-between">
              {wizardSteps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${wizardStep >= step.number
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                        }`}
                    >
                      {step.number}
                    </div>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <div className="mx-4 h-0.5 flex-1 bg-border" />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {wizardStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Lead List</CardTitle>
                  <CardDescription>Choose which prospects to include in this campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Target List</Label>
                    <Select value={selectedList} onValueChange={setSelectedList}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a list" />
                      </SelectTrigger>
                      <SelectContent>
                        {lists.map((list) => (
                          <SelectItem key={list.id} value={list.id}>
                            {list.name} ({list.count} leads)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label>Exclude leads active in other campaigns</Label>
                      <p className="text-sm text-muted-foreground">
                        Prevent duplicate outreach to the same prospects
                      </p>
                    </div>
                    <Switch checked={excludeActive} onCheckedChange={setExcludeActive} />
                  </div>
                </CardContent>
              </Card>
            )}

            {wizardStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Build Campaign Sequence</CardTitle>
                  <CardDescription>Create a multi-step outreach workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {sequenceSteps.map((step, index) => (
                      <div key={step.id} className="relative flex gap-4">
                        {index < sequenceSteps.length - 1 && (
                          <div className="absolute left-5 top-12 h-full w-0.5 bg-border" />
                        )}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                          {getStepIcon(step.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {step.type === "connection"
                                ? "Connection Request"
                                : step.type === "wait"
                                  ? "Wait"
                                  : "Message"}
                            </Badge>
                            {sequenceSteps.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStep(step.id)}
                                className="h-7 px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          {step.type === "wait" ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={step.days}
                                onChange={(e) => updateStep(step.id, "days", parseInt(e.target.value))}
                                className="w-20"
                                min="1"
                              />
                              <span className="text-sm text-muted-foreground">days</span>
                            </div>
                          ) : (
                            <Textarea
                              value={step.content}
                              onChange={(e) => updateStep(step.id, "content", e.target.value)}
                              placeholder={
                                step.type === "connection"
                                  ? "Enter connection request message..."
                                  : "Enter follow-up message..."
                              }
                              className="resize-none"
                              rows={3}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => addStep("connection")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Connection
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addStep("wait")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Wait
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addStep("message")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {wizardStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Settings</CardTitle>
                  <CardDescription>Configure when and how often to send connections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Daily Connection Limit</Label>
                      <span className="text-sm font-medium">{dailyLimit[0]} per day</span>
                    </div>
                    <Slider
                      value={dailyLimit}
                      onValueChange={setDailyLimit}
                      min={1}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      LinkedIn safe limit: 20-25 connections per day
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {wizardStep === 4 && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Prospects</CardTitle>
                    <CardDescription>
                      {selectedList ? lists.find((l) => l.id === selectedList)?.count : 0} leads
                      selected
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockProspects.map((prospect, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-sm">
                              {prospect.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{prospect.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {prospect.title} at {prospect.company}
                            </p>
                          </div>
                        </div>
                      ))}
                      <p className="text-center text-sm text-muted-foreground">
                        + {(lists.find((l) => l.id === selectedList)?.count || 0) - 3} more leads
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sequence Preview</CardTitle>
                    <CardDescription>{sequenceSteps.length} steps configured</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sequenceSteps.map((step, index) => (
                        <div key={step.id} className="rounded-lg border p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              Step {index + 1}
                            </Badge>
                            <span className="text-sm font-medium">
                              {step.type === "connection"
                                ? "Connection Request"
                                : step.type === "wait"
                                  ? `Wait ${step.days} days`
                                  : "Follow-up Message"}
                            </span>
                          </div>
                          {step.type !== "wait" && (
                            <p className="text-sm text-muted-foreground">{step.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
                disabled={wizardStep === 1}
              >
                Previous
              </Button>
              {wizardStep < 4 ? (
                <Button onClick={() => setWizardStep(Math.min(4, wizardStep + 1))}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => router.push("/campaigns")} className="bg-success hover:bg-success/90">
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

