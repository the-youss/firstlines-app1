"use client";

import { Fragment, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useFileUpload, type FileUploadProgress } from "@/hooks/use-file-upload";
import { csvBufferToJson } from "@/lib/sheet";
import { LeadSchema, LeadsSchema } from "@/lib/lead.utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { DataTable } from "./data-table";
import { MRT_Column, MRT_ColumnDef } from "material-react-table";
import { createHeading } from "@/lib/utils";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/app-routes";

interface FileUploadZoneProps {
  className?: string;
  onImport: (leads: LeadSchema) => void
}


const columns: MRT_ColumnDef<LeadSchema>[] = Object.keys(LeadSchema.shape).map(key => ({
  id: key,
  header: createHeading(key),
  accessorKey: key,
}))


export function CSVUpload({
  className = "",
  onImport
}: FileUploadZoneProps) {

  const [dialogOpen, setDialogOpen] = useState(false)
  const [leads, setLeads] = useState<LeadsSchema>([])

  const onDrop = useCallback(
    async (files: File[]) => {
      setLeads([])
      const file = files.length > 0 ? files[0] : null;
      if (file) {
        const rows = csvBufferToJson(Buffer.from(await file.arrayBuffer()));
        const validateRows = rows.filter(row => LeadSchema.safeParse(row).success);
        setLeads(validateRows)
        setDialogOpen(true)
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt"],
    },
    multiple: false
  });




  return (
    <div className={`${className}`}>
      {/* Upload Drop Zone */}
      <Card
        {...getRootProps()}
        className={`
          transition-colors cursor-pointer border-2 border-dashed
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
          hover:border-primary/50
        `}
      >
        <CardContent className="p-6 text-center">

          {leads.length > 0 ? (
            <div className=" flex-col flex items-center gap-2">
              <h1>Found {leads.length} leads</h1>
              <Button onClick={() => setLeads([])} variant='destructive' size='sm'><X />Remove</Button>
            </div>
          ) : (
            <Fragment>
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />

              {isDragActive ? (
                <p className="text-primary font-medium">
                  Drop files here to upload
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV OR TXTfiles
                  </p>
                </div>
              )}
            </Fragment>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[1000px]">
          <DialogHeader>
            <DialogTitle>Import Leads</DialogTitle>
            <DialogDescription>
              Add new leads to your database
            </DialogDescription>
          </DialogHeader>
          <DataTable calcHeight="600px" columns={columns} data={leads} count={leads.length}>


          </DataTable>
          <DialogFooter>
            <Button variant={'outline'} onClick={() => {
              setDialogOpen(false)
              setLeads([])
            }}>Cancel</Button>
            <Button onClick={() => {
              onImport(leads);
              setDialogOpen(false)
            }}> Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


