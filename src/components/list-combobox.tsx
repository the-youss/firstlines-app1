"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"


interface ListComboBox {
  onSelect: (args: { listId: string, isNew: boolean }) => void
}

export function ListComboBox({ onSelect }: ListComboBox) {
  const trpc = useTRPC();
  const { data: lists = [], isLoading } = useQuery(trpc.list.getLists.queryOptions(undefined, {
    select(data) {
      return data.map(d => ({ label: d.name, value: d.id }))
    },
  }))
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? value
            : "Select list..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup heading="Where do you want to save this lead?">
              <CommandItem className="cursor-pointer" onSelect={() => {
                if (window.prompt) {
                  const name = window.prompt("Enter list name");
                  if (name) {
                    onSelect({ listId: name, isNew: true });
                    setValue(name)
                  }
                  setOpen(false)
                }
              }}>
                <Plus />
                <span>New list</span>
              </CommandItem>
              <CommandSeparator />
              {lists.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onSelect({ listId: currentValue, isNew: false })
                    setValue(lists.find((list) => list.value === currentValue)?.label || "")
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
