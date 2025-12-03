'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Clock, MessageSquare, UserPlus, ArrowRight, Network, Send, LayoutTemplate, PenLine } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImportLeadsDialog } from "../leads/import-leads-dialog";

type StepType = "connection" | "wait" | "message";

interface SequenceStep {
  id: string;
  type: StepType;
  content?: string;
  days?: number;
}

export const CampaignWizard = () => {
  const { id } = useParams();
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedList, setSelectedList] = useState("");
  const [excludeActive, setExcludeActive] = useState(true);
  const [hasSelectedTemplate, setHasSelectedTemplate] = useState(false);
  const [sequenceSteps, setSequenceSteps] = useState<SequenceStep[]>([]);
  const [timezone, setTimezone] = useState("America/New_York");
  const [dailyLimit, setDailyLimit] = useState([25]);
  const [selectedLead, setSelectedLead] = useState<typeof mockProspects[0] | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const steps = [
    { number: 1, title: "Leads", description: "Select your target list" },
    { number: 2, title: "Sequence", description: "Build your campaign steps" },
    { number: 3, title: "Schedule", description: "Configure timing" },
    { number: 4, title: "Preview", description: "Review & launch" },
  ];

  const lists = [
    { id: "1", name: "Q1 Prospects", count: 124 },
    { id: "2", name: "Tech Executives", count: 89 },
    { id: "3", name: "Marketing Directors", count: 67 },
  ];

  const mockProspects = [
    { firstName: "Sarah", name: "Sarah Johnson", title: "VP Sales", company: "TechCorp", avatar: "SJ" },
    { firstName: "Mike", name: "Mike Chen", title: "CMO", company: "Growth Labs", avatar: "MC" },
    { firstName: "Emily", name: "Emily Rodriguez", title: "CEO", company: "Startup XYZ", avatar: "ER" },
  ];

  const addStep = (type: StepType) => {
    const newStep: SequenceStep = {
      id: Date.now().toString(),
      type,
      ...(type === "wait" ? { days: 2 } : { content: "" }),
    };
    setSequenceSteps([...sequenceSteps, newStep]);
  };

  const removeStep = (id: string) => {
    setSequenceSteps(sequenceSteps.filter((step) => step.id !== id));
  };

  const updateStep = (id: string, field: keyof SequenceStep, value: string | number) => {
    setSequenceSteps(
      sequenceSteps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
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

  const replaceVariables = (text: string, lead: typeof mockProspects[0]) => {
    return text
      .replace(/\{\{firstName\}\}/g, lead.firstName)
      .replace(/\{\{company\}\}/g, lead.company);
  };

  const templates = [
    {
      id: "grow-network",
      icon: Network,
      title: "Grow Network",
      description: "Send connection requests to expand your network",
      steps: [{ id: Date.now().toString(), type: "connection" as StepType, content: "Hi {{firstName}}, I'm currently growing my network and would love to be connected." }],
    },
    {
      id: "standard-outreach",
      icon: LayoutTemplate,
      title: "Standard Outreach",
      description: "Connection request, wait, then follow-up message",
      steps: [
        { id: Date.now().toString(), type: "connection" as StepType, content: "Hi {{firstName}}, I'd love to connect with you!" },
        { id: (Date.now() + 1).toString(), type: "wait" as StepType, days: 2 },
        { id: (Date.now() + 2).toString(), type: "message" as StepType, content: "Hi {{firstName}}, great to connect. Is there something you need help with at {{company}}? I'd love to discuss how we can help your team." },
      ],
    },
    {
      id: "message-only",
      icon: Send,
      title: "Message Only",
      description: "Send a direct message to existing connections",
      steps: [{ id: Date.now().toString(), type: "message" as StepType, content: "Hi {{firstName}}, are you free for a quick 10/15min chat to talk about achieving your goals at {{company}}?" }],
    },
    {
      id: "scratch",
      icon: PenLine,
      title: "Start from Scratch",
      description: "Build your own custom sequence from the ground up",
      steps: [],
    },
  ];

  const selectTemplate = (templateSteps: SequenceStep[]) => {
    const stepsWithUniqueIds = templateSteps.map((step, index) => ({
      ...step,
      id: (Date.now() + index).toString(),
    }));
    setSequenceSteps(stepsWithUniqueIds);
    setHasSelectedTemplate(true);
  };

  // Default to selecting the first lead when reaching step 4
  useEffect(() => {
    if (currentStep === 4 && !selectedLead && mockProspects.length > 0) {
      setSelectedLead(mockProspects[0]);
    }
  }, [currentStep]);

  const handleLaunch = () => {
    // In a real app, this would save and activate the campaign
    router.push("/campaigns");
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${currentStep >= step.number
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
            {index < steps.length - 1 && (
              <div className="mx-4 h-0.5 flex-1 bg-border" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Lead List</CardTitle>
            <CardDescription>Choose which prospects to include in this campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Target List</Label>
              <Select
                value={selectedList}
                onValueChange={(value) => {
                  if (value === "import-new") {
                    setIsImportDialogOpen(true);
                  } else {
                    setSelectedList(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import-new" className="text-blue-600 font-medium" onClick={() => setIsImportDialogOpen(true)}>
                    + Import New Leads
                  </SelectItem>
                  <Separator className="my-1" />
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name} ({list.count} leads)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ImportLeadsDialog children={null} open={isImportDialogOpen} setOpen={setIsImportDialogOpen} />

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

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{hasSelectedTemplate ? "Build Campaign Sequence" : "Choose a Template"}</CardTitle>
                <CardDescription>
                  {hasSelectedTemplate
                    ? "Create a multi-step outreach workflow"
                    : "Select a starting point for your campaign sequence"}
                </CardDescription>
              </div>
              {hasSelectedTemplate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHasSelectedTemplate(false)}
                >
                  Change Template
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasSelectedTemplate ? (
              /* Template Selection Grid */
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => selectTemplate(template.steps)}
                    className="group cursor-pointer rounded-lg border-2 border-border bg-secondary/20 p-6 transition-all hover:border-primary hover:bg-secondary/40"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <template.icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{template.title}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Sequence Builder */
              <>
                {/* Timeline */}
                <div className="space-y-4">
                  {sequenceSteps.map((step, index) => (
                    <div key={step.id} className="relative flex gap-4">
                      {/* Timeline line */}
                      {index < sequenceSteps.length - 1 && (
                        <div className="absolute left-5 top-12 h-full w-0.5 bg-border" />
                      )}

                      {/* Step icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                        {getStepIcon(step.type)}
                      </div>

                      {/* Step content */}
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
                        {step.type !== "wait" && (
                          <p className="text-xs text-muted-foreground">
                            {step.content?.length || 0} characters
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Step Buttons */}
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
              </>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
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

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Campaign</CardTitle>
            <CardDescription>
              Select a lead to preview how the sequence will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Selectable Lead List */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Campaign Leads ({mockProspects.length})</Label>
                <div className="space-y-2 rounded-lg border p-2">
                  {mockProspects.map((prospect, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedLead(prospect)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent ${selectedLead?.name === prospect.name ? "border-primary bg-primary/5" : ""
                        }`}
                    >
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
                </div>
                <p className="text-center text-sm text-muted-foreground pt-2">
                  + {(lists.find((l) => l.id === selectedList)?.count || 0) - 3} more leads
                </p>
              </div>

              {/* Right Column - Dynamic Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Sequence Preview {selectedLead && `- ${selectedLead.firstName}`}
                </Label>
                <div className="rounded-lg border p-4">
                  {selectedLead ? (
                    <div className="space-y-4">
                      {sequenceSteps.map((step, index) => (
                        <div key={step.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
                              {getStepIcon(step.type)}
                            </div>
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
                          {step.type !== "wait" && step.content && (
                            <div className="ml-10 rounded-lg bg-muted p-3">
                              <p className="text-sm">
                                {replaceVariables(step.content, selectedLead)}
                              </p>
                            </div>
                          )}
                          {index < sequenceSteps.length - 1 && (
                            <div className="ml-4 h-4 w-0.5 bg-border" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center py-12">
                      <p className="text-sm text-muted-foreground">
                        Select a lead from the list to preview the sequence
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        {currentStep < 4 ? (
          <Button onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleLaunch} className="bg-success hover:bg-success/90">
            Launch Campaign
          </Button>
        )}
      </div>
    </div>
  );
};

