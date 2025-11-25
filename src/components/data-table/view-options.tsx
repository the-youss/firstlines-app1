'use client';

import { ChevronsUpDown, Settings2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { createHeading } from '@/lib/utils';
import { IconEye, IconEyeClosed } from '@tabler/icons-react';
import { MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { ignoreColumns } from './config';

interface DataTableViewOptionsProps<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>,
}

export function DataTableViewOptions<TData extends MRT_RowData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const columns = React.useMemo(
    () =>
      table.getAllColumns().filter(
        (col) => !ignoreColumns.includes(col.id)
      ),
    [table]
  );
  const toggleColumnVisiblity = React.useCallback(
    (columnIds: any[], isVisible: boolean) => {
      const currentVisibility = table.getState().columnVisibility;

      const newVisibility = { ...currentVisibility };
      columnIds.forEach((id) => {
        newVisibility[id] = isVisible;
      });

      table.setColumnVisibility(newVisibility);
    },
    [table]
  );


  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          aria-label='Toggle columns'
          variant='outline'
          role='combobox'
          size='sm'
          className='ml-auto hidden h-8 gap-2 focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0 lg:flex'
        >
          <Settings2 className='h-3 w-3' />
          {columns.filter((c) => c.getIsVisible()).length}/
          {columns.length} columns
          <ChevronsUpDown className='ml-auto h-3 w-3 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='w-48 p-1 '
        onCloseAutoFocus={() => triggerRef.current?.focus()}
      >
        <Command>
          <CommandList className='max-h-[400px]'>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => toggleColumnVisiblity(columns.map((c) => c.id).slice(1), true)}
              >
                <IconEye />
                <span>Show all columns</span>
              </CommandItem>
              <CommandItem
                onSelect={() => toggleColumnVisiblity(columns.map((c) => c.id).slice(1), false)}
              >
                <IconEyeClosed />
                <span>Hide all columns</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {columns.map((column) => {
                return (
                  <CommandItem key={column.id}>
                    <span className='truncate'>
                      {createHeading(column.id)}
                    </span>
                    <Switch
                      id={column.id}
                      checked={column.getIsVisible()}
                      onClick={() =>
                        toggleColumnVisiblity([column.id], !column.getIsVisible())
                      }
                      className='ml-auto shrink-0'
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
