'use client';

import {
  Check,
  ChevronsUpDown,
  Filter as FilterIcon,
  GripVertical,
  Trash2Icon
} from 'lucide-react';
import { customAlphabet } from 'nanoid';
import * as React from 'react';
import {
  Filter,
  FilterOperator,
  JoinOperator
} from './types';

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
import { Input } from '@/components/ui/input';
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
import { cn, createHeading, toSentenceCase } from '@/lib/utils';
import { MRT_ColumnFilterFnsState, MRT_ColumnFiltersState, MRT_FilterFn, MRT_FilterFns, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { ignoreColumns } from './config';


interface DataTableFilterListProps<TData extends MRT_RowData> {
  debounceMs?: number;
  table: MRT_TableInstance<TData>,
  onFiltersChange?: (filters: Filter<TData>[], joinOperator: JoinOperator) => void,
}

export function DataTableFilterList<TData extends MRT_RowData>({
  table,
  onFiltersChange,
  debounceMs = 300,
}: DataTableFilterListProps<TData>) {
  const filterFields = React.useMemo(
    () =>
      table.getAllColumns().filter(
        (col) => !ignoreColumns.includes(col.id)
      )
        .filter(
          (column) =>
            (column.columnDef.meta as { filterable?: boolean })?.filterable !== false
        )
        .map((column) => ({
          id: column.id,
          label: column.columnDef.header,
          type: (column.columnDef.meta as { type?: MRT_FilterFn<any> })?.type || ('contains' as MRT_FilterFn<any>),
          placeholder: `Filter ${toSentenceCase(column.columnDef.header)}`,
          options: (column.columnDef.meta as { options?: Array<{ label: string, value: string }> })?.options || [],
        })),
    [table]
  );
  const [filters, setFilters] = React.useState<Filter<TData>[]>([]);
  const [joinOperator, setJoinOperator] = React.useState<JoinOperator>(JoinOperator.AND);
  const id = React.useId();
  const debouncedSetFilters = useDebouncedCallback(setFilters, debounceMs);
  React.useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters, joinOperator);
    }
    const activeFilters = filters.filter(f => f.value !== '');
    // console.log("activeFilters", );
    table.setColumnFilters(activeFilters.map(f => ({ id: f.id, value: f.value })) as MRT_ColumnFiltersState);
    table.setColumnFilterFns({
      ...filters.reduce((acc, filter) => ({
        ...acc,
        [filter.id]: filter.operator,
      }), {} as MRT_ColumnFilterFnsState),
    })
  }, [table, filters]);
  function addFilter() {
    const filterField = filterFields[0];
    if (!filterField) return;

    void setFilters([
      ...filters,
      {
        id: filterField.id,
        value: '',
        type: filterField.type,
        operator: filterField.type,
        rowId: customAlphabet(
          '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
          6
        )(),
      } as Filter<TData>,
    ]);
  }

  function updateFilter({
    rowId,
    field,
    debounced = false,
  }: {
    rowId: string;
    field: Omit<Partial<Filter<TData>>, 'rowId'>;
    debounced?: boolean;
  }) {
    const updateFunction = debounced ? debouncedSetFilters : setFilters;
    const updatedFilters = filters.map<Filter<TData>>((filter) => {
      if (filter.rowId === rowId) {
        return { ...filter, ...field };
      }
      return filter;
    });
    updateFunction(updatedFilters);
  }

  function removeFilter(rowId: string) {
    const updatedFilters = filters.filter((filter) => filter.rowId !== rowId);
    void setFilters(updatedFilters);
  }

  function moveFilter(activeIndex: number, overIndex: number) {
    const move = (prevFilters: Filter<any>[]) => {
      const newFilters = [...filters];
      const [removed] = newFilters.splice(activeIndex, 1);
      if (!removed) return prevFilters;
      newFilters.splice(overIndex, 0, removed);
      return newFilters;
    };
    void setFilters(move(filters));
  }

  function renderFilterInput({
    filter,
    inputId,
  }: {
    filter: Filter<TData>;
    inputId: string;
  }) {
    const filterField = filterFields.find((f) => f.id === filter.id);

    if (!filterField) return null;

    if (filter.operator === 'isEmpty' || filter.operator === 'isNotEmpty') {
      return (
        <div
          id={inputId}
          role='status'
          aria-live='polite'
          aria-label={`${filterField.label} filter is ${filter.operator === 'isEmpty' ? 'empty' : 'not empty'
            }`}
          className='h-8 w-full rounded border border-dashed'
        />
      );
    }

    switch (filter.type) {
      default:
        return <Input
          id={inputId}
          type={filter.type}
          aria-label={`${filterField.label} filter value`}
          aria-describedby={`${inputId}-description`}
          placeholder={filterField.placeholder ?? 'Enter a value...'}
          className='h-8 w-full rounded'
          defaultValue={
            typeof filter.value === 'string' ? filter.value : undefined
          }
          onChange={(event) =>
            updateFilter({
              rowId: filter.rowId,
              field: { value: event.target.value },
              debounced: true,
            })
          }
        />
    }
  }

  return (

    <Sortable
      value={filters.map((item) => ({ id: item.rowId }))}
      onMove={({ activeIndex, overIndex }) =>
        moveFilter(activeIndex, overIndex)
      }
      overlay={
        <div className='flex items-center gap-2'>
          <div className='h-8 min-w-18 rounded-sm bg-primary/10' />
          <div className='h-8 w-32 rounded-sm bg-primary/10' />
          <div className='h-8 w-32 rounded-sm bg-primary/10' />
          <div className='h-8 min-w-36 flex-1 rounded-sm bg-primary/10' />
          <div className='size-8 shrink-0 rounded-sm bg-primary/10' />
          <div className='size-8 shrink-0 rounded-sm bg-primary/10' />
        </div>
      }
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            aria-label='Open filters'
            aria-controls={`${id}-filter-dialog`}
            className='relative'
          >
            <FilterIcon className='h-3 w-3' aria-hidden='true' />
            {filters.length > 0 && (
              <Badge
                variant='secondary'
                className='absolute top-0  -right-2  h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono text-[0.65rem] font-normal'
              >
                {filters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id={`${id}-filter-dialog`}
          align='start'
          collisionPadding={16}
          className={cn(
            'flex w-[calc(100vw-(--spacing(12)))] min-w-60 origin-(--radix-popover-content-transform-origin) flex-col p-4 sm:w-xl',
            filters.length > 0 ? 'gap-3.5' : 'gap-2'
          )}
        >
          {filters.length > 0 ? (
            <h4 className='font-medium leading-none'>Filters</h4>
          ) : (
            <div className='flex flex-col gap-1'>
              <h4 className='font-medium leading-none'>No filters applied</h4>
              <p className='text-sm text-muted-foreground'>
                Add filters to refine your results.
              </p>
            </div>
          )}
          <div className='flex max-h-40 flex-col gap-2 py-0.5 pr-1'>
            {filters.map((filter, index) => {
              const filterId = `${id}-filter-${filter.rowId}`;
              const joinOperatorListboxId = `${filterId}-join-operator-listbox`;
              const fieldListboxId = `${filterId}-field-listbox`;
              const fieldTriggerId = `${filterId}-field-trigger`;
              const operatorListboxId = `${filterId}-operator-listbox`;
              const inputId = `${filterId}-input`;

              return (
                <SortableItem key={filter.rowId} value={filter.rowId} asChild>
                  <div className='flex items-center gap-2'>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          id={fieldTriggerId}
                          variant='outline'
                          size='sm'
                          role='combobox'
                          aria-label='Select filter field'
                          aria-controls={fieldListboxId}
                          className='h-8 w-32 justify-between gap-2 rounded focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0'
                        >
                          <span className='truncate'>
                            {filterFields.find(
                              (field) => field.id === filter.id
                            )?.label ?? 'Select field'}
                          </span>
                          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id={fieldListboxId}
                        align='start'
                        className='w-40 p-0'
                        onCloseAutoFocus={() =>
                          document.getElementById(fieldTriggerId)?.focus({
                            preventScroll: true,
                          })
                        }
                      >
                        <Command>
                          <CommandInput placeholder='Search fields...' />
                          <CommandList>
                            <CommandEmpty>No fields found.</CommandEmpty>
                            <CommandGroup>
                              {filterFields.map((field) => (
                                <CommandItem
                                  key={field.id}
                                  value={field.id}
                                  onSelect={(value) => {
                                    const filterField = filterFields.find(
                                      (col) => col.id === value
                                    );

                                    if (!filterField) return;

                                    updateFilter({
                                      rowId: filter.rowId,
                                      field: {
                                        id: value as string,
                                        type: filter.type!,
                                        operator: filter.operator!,
                                        value: '',
                                      },
                                    });

                                    document
                                      .getElementById(fieldTriggerId)
                                      ?.click();
                                  }}
                                >
                                  <span className='mr-1.5 truncate'>
                                    {field.label}
                                  </span>
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4 shrink-0',
                                      field.id === filter.id
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Select
                      value={filter.operator}
                      onValueChange={(value: FilterOperator) =>
                        updateFilter({
                          rowId: filter.rowId,
                          field: {
                            operator: value,
                            value:
                              value === 'isEmpty' || value === 'isNotEmpty'
                                ? ''
                                : filter.value,
                          },
                        })
                      }
                    >
                      <SelectTrigger
                        aria-label='Select filter operator'
                        aria-controls={operatorListboxId}
                        className='h-8 w-32 rounded'
                      >
                        <div className='truncate'>
                          <SelectValue placeholder={filter.operator} />
                        </div>
                      </SelectTrigger>
                      <SelectContent id={operatorListboxId}>
                        {Object.keys(MRT_FilterFns).filter((op) => ['equals', 'contains', 'endsWith', 'startsWith', 'notEmpty', 'empty'].includes(op)).map((op) => (
                          <SelectItem key={op} value={op}>
                            {createHeading(op)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className='min-w-36 flex-1'>
                      {renderFilterInput({ filter, inputId })}
                    </div>
                    <Button
                      variant='outline'
                      size='icon'
                      aria-label={`Remove filter ${index + 1}`}
                      className='size-8 shrink-0 rounded'
                      onClick={() => removeFilter(filter.rowId)}
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
          <div className='flex w-full items-center gap-2'>
            <Button
              size='sm'
              className='h-[1.85rem] rounded'
              onClick={addFilter}
            >
              Add filter
            </Button>
            {filters.length > 0 ? (
              <Button
                size='sm'
                variant='outline'
                className='rounded'
                onClick={() => {
                  void setFilters([]);
                  void setJoinOperator(JoinOperator.AND);
                }}
              >
                Reset filters
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </Sortable>
  );
}
