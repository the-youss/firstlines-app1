'use client';
import {
  ArrowDownUpIcon,
  Check,
  ChevronsUpDown,
  GripVertical,
  Trash2Icon,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from '@/components/ui/sortable';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { cn, toSentenceCase } from '@/lib/utils';
import { MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { dataTableConfig, ignoreColumns } from './config';
import { type ExtendedSortingState } from './types';



interface DataTableSortListProps<TData extends MRT_RowData> {
  debounceMs?: number;
  table: MRT_TableInstance<TData>,
  onSortChange?: (sorting: ExtendedSortingState) => void,
}

export function DataTableSortList<TData extends MRT_RowData>({
  debounceMs = 300,
  table,
  onSortChange,
}: DataTableSortListProps<TData>) {
  const [sorting, setSorting] = React.useState<ExtendedSortingState>([])
  const id = React.useId();
  const initialSorting =
    [] as any[]
  const uniqueSorting = React.useMemo(
    () =>
      sorting.filter(
        (sort, index, self) => index === self.findIndex((t) => t.id === sort.id)
      ),
    [sorting]
  );

  const debouncedSetSorting = useDebouncedCallback(setSorting, debounceMs);

  const sortableColumns = React.useMemo(
    () =>
      table.getAllColumns().filter(
        (col) => !ignoreColumns.includes(col.id)
      )
        .filter(
          (column) =>
            (column.columnDef.meta as { sortable?: boolean })?.sortable !== false
        )
        .map((column) => ({
          id: column.id,
          label: column.columnDef.header,
          selected: false,
        })) ?? [],
    [sorting, table]
  );
  const addSort = React.useCallback(() => {
    const firstAvailableColumn = sortableColumns.find(
      (column) => !sorting.some((s) => s.id === column.id)
    );
    if (!firstAvailableColumn) return;

    void setSorting([
      ...sorting,
      {
        id: firstAvailableColumn.id,
        desc: false,
      },
    ]);
  }, [sortableColumns, sorting]);

  const updateSort = React.useCallback(
    ({
      id,
      field,
      debounced = false,
    }: {
      id: string;
      field: Pick<ExtendedSortingState[number], 'id'> & { desc?: boolean };
      debounced?: boolean;
    }) => {
      const updateFunction = debounced ? debouncedSetSorting : setSorting;
      const sort = (prevSorting: ExtendedSortingState) => {
        if (!prevSorting) return prevSorting;

        const updatedSorting = prevSorting.map((sort) =>
          sort.id === id ? { ...sort, ...field } : sort
        );
        return updatedSorting;
      };
      updateFunction(sort(sorting));
    },
    [sorting]
  );

  const removeSort = React.useCallback(
    (id: string) => {
      void setSorting(sorting.filter((item) => item.id !== id));
    },
    [sorting]
  );
  React.useEffect(() => {
    if (onSortChange) {
      onSortChange(sorting)
    }
    table.setSorting(sorting)
  }, [sorting, onSortChange])
  return (
    <Sortable
      value={sorting}
      onValueChange={setSorting}
      overlay={
        <div className='flex items-center gap-2'>
          <div className='h-8 w-45 rounded-sm bg-primary/10' />
          <div className='h-8 w-24 rounded-sm bg-primary/10' />
          <div className='size-8 shrink-0 rounded-sm bg-primary/10' />
          <div className='size-8 shrink-0 rounded-sm bg-primary/10' />
        </div>
      }
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            aria-label='Open sorting'
            aria-controls={`${id}-sort-dialog`}
            className='relative'
          >
            <ArrowDownUpIcon className='h-3 w-3' aria-hidden='true' />
            {uniqueSorting.length > 0 && (
              <Badge
                variant='secondary'
                className='absolute top-0  -right-2  h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono text-[0.65rem] font-normal'
              >
                {uniqueSorting.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id={`${id}-sort-dialog`}
          align='start'
          collisionPadding={16}
          className={cn(
            'flex w-[calc(100vw-(--spacing(20)))] min-w-72 max-w-100 origin-(--radix-popover-content-transform-origin) flex-col p-4 sm:w-100',
            sorting.length > 0 ? 'gap-3.5' : 'gap-2'
          )}
        >
          {uniqueSorting.length > 0 ? (
            <h4 className='font-medium leading-none'>Sort by</h4>
          ) : (
            <div className='flex flex-col gap-1'>
              <h4 className='font-medium leading-none'>No sorting applied</h4>
              <p className='text-sm text-muted-foreground'>
                Add sorting to organize your results.
              </p>
            </div>
          )}
          <div className='flex max-h-44 flex-col gap-2 overflow-y-auto p-0.5'>
            <div className='flex w-full flex-col gap-2'>
              {uniqueSorting.map((sort) => {
                const sortId = `${id}-sort-${sort.id}`;
                const fieldListboxId = `${sortId}-field-listbox`;
                const fieldTriggerId = `${sortId}-field-trigger`;
                const directionListboxId = `${sortId}-direction-listbox`;

                return (
                  <SortableItem key={sort.id} value={sort.id} asChild>
                    <div className='flex items-center gap-2'>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <Button
                            id={fieldTriggerId}
                            variant='outline'
                            size='sm'
                            role='combobox'
                            className='h-8 w-44 justify-between gap-2 rounded focus:outline-none focus:ring-1 focus:ring-ring'
                            aria-controls={fieldListboxId}
                          >
                            <span className='truncate'>
                              {toSentenceCase(sort.id)}
                            </span>
                            <div className='ml-auto flex items-center gap-1'>
                              {initialSorting.length === 1 &&
                                initialSorting[0]?.id === sort.id ? (
                                <Badge
                                  variant='secondary'
                                  className='h-4.5 rounded px-1 font-mono text-[0.65rem] font-normal'
                                >
                                  Default
                                </Badge>
                              ) : null}
                              <ChevronsUpDown
                                className='h-4 w-4 shrink-0 opacity-50'
                                aria-hidden='true'
                              />
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          id={fieldListboxId}
                          className='w-(--radix-popover-trigger-width) p-0'
                          onCloseAutoFocus={() =>
                            document.getElementById(fieldTriggerId)?.focus()
                          }
                        >
                          <Command>
                            <CommandInput placeholder='Search fields...' />
                            <CommandList>
                              <CommandEmpty>No fields found.</CommandEmpty>
                              <CommandGroup>
                                {sortableColumns.map((column) => (
                                  <CommandItem
                                    key={column.id}
                                    value={column.id}
                                    onSelect={(value) => {
                                      const newFieldTriggerId = `${id}-sort-${value}-field-trigger`;

                                      updateSort({
                                        id: sort.id,
                                        field: {
                                          id: value,
                                        },
                                      });

                                      requestAnimationFrame(() => {
                                        document
                                          .getElementById(newFieldTriggerId)
                                          ?.focus();
                                      });
                                    }}
                                  >
                                    <span className='mr-1.5 truncate'>
                                      {column.label}
                                    </span>
                                    <Check
                                      className={cn(
                                        'ml-auto h-4 w-4 shrink-0',
                                        column.id === sort.id
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                      aria-hidden='true'
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Select
                        value={sort.desc ? 'desc' : 'asc'}
                        onValueChange={(value: 'asc' | 'desc') =>
                          updateSort({
                            id: sort.id,
                            field: {
                              id: sort.id as any,
                              desc: value === 'desc',
                            },
                          })
                        }
                      >
                        <SelectTrigger
                          aria-label='Select sort direction'
                          aria-controls={directionListboxId}
                          className='h-8 w-24 rounded'
                        >
                          <div className='truncate'>
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent
                          id={directionListboxId}
                          className='min-w-(--radix-select-trigger-width)'
                        >
                          {dataTableConfig.sortOrders.map((order) => (
                            <SelectItem key={order.value} value={order.value}>
                              {order.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant='outline'
                        size='icon'
                        aria-label={`Remove sort ${sort.id}`}
                        className='size-8 shrink-0 rounded'
                        onClick={() => removeSort(sort.id)}
                      >
                        <Trash2Icon
                          className='h-5 w-5 text-red-400'
                          aria-hidden='true'
                        />
                      </Button>
                      <SortableDragHandle
                        variant='outline'
                        size='icon'
                        className='size-8 shrink-0 rounded'
                      >
                        <GripVertical className='h-5 w-5' aria-hidden='true' />
                      </SortableDragHandle>
                    </div>
                  </SortableItem>
                );
              })}
            </div>
          </div>
          <div className='flex w-full items-center gap-2'>
            <Button
              size='sm'
              className='h-[1.85rem] rounded'
              onClick={addSort}
              disabled={sorting.length >= sortableColumns.length}
            >
              Add sort
            </Button>
            {sorting.length > 0 ? (
              <Button
                size='sm'
                variant='outline'
                className='rounded'
                onClick={() => setSorting([])}
              >
                Reset sorting
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </Sortable>
  );
}
