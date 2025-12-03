import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, UserPlus, Linkedin, Compass } from "lucide-react";
import { useState } from "react";

interface ImportLeadsDialogProps {
  children: React.ReactNode;
}

export function ImportLeadsDialog({ children }: ImportLeadsDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Leads</DialogTitle>
          <DialogDescription>
            Add new leads to your database
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="linkedin">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="linkedin">From LinkedIn</TabsTrigger>
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          {/* LinkedIn Import Tab */}
          <TabsContent value="linkedin" className="space-y-4 pt-2">
            <div className="space-y-3">
              <button
                onClick={() => window.open('https://www.linkedin.com/search/results/people/', '_blank')}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Linkedin className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold text-foreground">LinkedIn Search Bar</span>
              </button>

              <button
                onClick={() => window.open('https://www.linkedin.com/sales/search/people', '_blank')}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Compass className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold text-foreground">Sales Navigator</span>
              </button>
            </div>

            <p className="text-sm text-muted-foreground text-center pt-2">
              To import leads, open LinkedIn or Sales Nav and click the Firstlines extension icon accordingly.
            </p>
          </TabsContent>

          {/* CSV Upload Tab */}
          <TabsContent value="csv" className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-name">Import to List</Label>
              <Input id="list-name" placeholder="Enter list name" />
            </div>
            <Button className="w-full">Upload & Import</Button>
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" placeholder="VP of Sales" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Acme Corp" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="list">Add to List</Label>
                <Input id="list" placeholder="Enter list name" />
              </div>
            </div>
            <Button className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
