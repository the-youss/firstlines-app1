import { appRoutes } from "@/app-routes";
import { CSVUpload } from "@/components/csv-upload";
import { ListComboBox } from "@/components/list-combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsSchema } from "@/lib/lead.utils";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { Compass, Download, Linkedin, Loader2, Upload, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ImportLeadsDialogProps {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (state: boolean) => void;
}

export function ImportLeadsDialog({ children, open, setOpen }: ImportLeadsDialogProps) {
  // Local state fallback if no parent state is provided
  const [internalOpen, setInternalOpen] = useState<boolean>(open ?? false);

  // When parent changes `open`, update internal state
  useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [open]);

  // Wrapper so dialog updates BOTH internal state + parent
  const handleOpenChange = (val: boolean) => {
    setInternalOpen(val);
    setOpen?.(val); // update parent if provided
  };

  return (
    <Dialog open={internalOpen} onOpenChange={handleOpenChange}>
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

          {/* LinkedIn Import */}
          <TabsContent value="linkedin" className="space-y-4 pt-2">
            <LinkedInImport />
          </TabsContent>

          {/* CSV Tab */}
          <TabsContent value="csv" className="space-y-4">
            <CSVImport />
          </TabsContent>

          {/* Manual Entry */}
          <TabsContent value="manual" className="space-y-4">
            <ManualEntry />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
function CSVImport() {
  const trpc = useTRPC()
  const router = useRouter()
  const [leads, setLeads] = useState<LeadsSchema>([])
  const [listName, setListName] = useState('')
  const { mutate, isPending } = useMutation(trpc.list.importLeads.mutationOptions({
    onSuccess(data, variables, onMutateResult, context) {
      router.push(`${appRoutes.appLeads}?listId=${data?.listId}`)
    },
  }))
  const _importLeads = useCallback(() => {
    mutate({ leads, listName })

  }, [leads, listName])
  return (
    <Card>
      <CardContent className="text-center">
        <a href={appRoutes.sampleCsv} target="_blank" className="text-primary hover:underline text-sm inline-flex justify-center items-center gap-x-2">
          <Download className="size-4" />Download Sample
        </a>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <CSVUpload onImport={(leads) => setLeads(leads)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="list-name">Import to List</Label>
          <Input onChange={e => setListName(e.currentTarget.value)} value={listName} id="list-name" placeholder="Enter list name" />
        </div>

        <Button className="w-full mt-4" onClick={_importLeads} disabled={isPending || !listName || leads.length === 0}>{isPending ? 'Please wait...' : "Import"}</Button>
      </CardContent>
    </Card>
  )
}

function ManualEntry() {
  const trpc = useTRPC();
  const router = useRouter()
  const { mutate, isPending } = useMutation(trpc.list.importSingleLead.mutationOptions({
    onSuccess(data, variables, onMutateResult, context) {
      router.push(`${appRoutes.appLeads}?listId=${data?.listId}`)
    },
  }))
  const [list, setList] = useState({ listId: '', isNew: false })

  const _onCreate = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const linkedin = formData.get('linkedin') as string;
    const title = formData.get('title') as string;
    const company = formData.get('company') as string;
    // mutate({ name, linkedin, title, company, listId: list.listId });
  }, [list])

  return (
    <Card>
      <CardContent>
        <form onSubmit={_onCreate}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/..." required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" placeholder="VP of Sales" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" placeholder="Acme Corp" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="list">Add to List</Label>
              <ListComboBox onSelect={setList} />
            </div>
          </div>

          <Button className="w-full mt-2" disabled={isPending} type="submit">
            <UserPlus className="mr-2 h-4 w-4" />
            {isPending ? "Please wait..." : "Add Lead"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function LinkedInImport() {
  return (
    <Card>
      <CardContent className="px-2">
        <div className="space-y-3">
          <a
            href='https://www.linkedin.com/search/results/people/'
            target="_blank"
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors text-left"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Linkedin className="h-6 w-6 text-blue-600" />
            </div>
            <span className="font-semibold text-foreground">
              LinkedIn Search Bar
            </span>
          </a>

          <a
            href="https://www.linkedin.com/sales/search/people"
            target="_blank"
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors text-left"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Compass className="h-6 w-6 text-blue-600" />
            </div>
            <span className="font-semibold text-foreground">
              Sales Navigator
            </span>
          </a>
        </div>

        <p className="text-sm text-muted-foreground text-center pt-2">
          To import leads, open LinkedIn or Sales Nav and click the Firstlines extension icon.
        </p>
      </CardContent>
    </Card>
  )
}

