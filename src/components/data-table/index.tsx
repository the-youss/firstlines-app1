'use client'
import { SearchIcon, XIcon } from 'lucide-react';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_DensityState,
  MRT_PaginationState,
  MRT_RowData,
  MRT_TableInstance,
  MRT_ToggleFullScreenButton,
  useMaterialReactTable
} from 'material-react-table';
import React, { forwardRef, Fragment, useImperativeHandle, useMemo, useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { DataTableFilterList } from './filter-list';
import { DataTableSortList } from './sort-list';
import { WithThemeProvider } from './theme';
import { DataTableViewOptions } from './view-options';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

const RenderTopToolbar = ({ table, toolbar }: { table: MRT_TableInstance<any>, toolbar?: DataTableProps<any>['toolbar'] }) => {
  const [localValue, setLocalValue] = useState('')
  const selectedRows = table.getSelectedRowModel().rows.length;
  const debounceCb = useDebouncedCallback((value: string) => table.setGlobalFilter(value), 500)
  const value = table.getState().globalFilter
  const { left, right, secondLeft, secondRight } = useMemo(() => {
    const left = toolbar?.filter(item => item.position === "left")
    const right = toolbar?.filter(item => item.position === "right")
    const secondLeft = toolbar?.filter(item => item.position === "2nd-left")
    const secondRight = toolbar?.filter(item => item.position === "2nd-right")
    return { left, right, secondLeft, secondRight }
  }, [toolbar])
  const isFullScreen = table.getState().isFullScreen
  return (
    <div className="flex w-full items-center justify-between py-4 px-4">
      <div className="flex items-center gap-3">
        {isFullScreen ? null : left?.map((item, index) => <React.Fragment key={index}>{item.node}</React.Fragment>)}
        {!isFullScreen && (
          <Fragment>
            {/* <DataTableViewOptions table={table} /> */}
            {/* <DataTableFilterList table={table} debounceMs={300} />
            <DataTableSortList table={table} /> */}
          </Fragment>
        )}
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput value={localValue} placeholder="Search..." onChange={(e) => {
            setLocalValue(e.target.value)
            debounceCb(e.target.value)
          }} />
          {localValue && (
            <InputGroupAddon align="inline-end" className='cursor-pointer' onClick={() => {
              setLocalValue('')
              table.setGlobalFilter('')
            }}>
              <XIcon />
            </InputGroupAddon>
          )}
        </InputGroup>
        {isFullScreen ? null : right?.map((item, index) => <React.Fragment key={index}>{item.node}</React.Fragment>)}
      </div>

      <div className="flex items-center gap-3">
        {isFullScreen ? null : secondLeft?.map((item, index) => <React.Fragment key={index}>{item.node}</React.Fragment>)}
        <MRT_ToggleFullScreenButton table={table} />
        {isFullScreen ? null : secondRight?.map((item, index) => <React.Fragment key={index}>{item.node}</React.Fragment>)}
      </div>
    </div>
  );
}

const RenderBottomToolbar = ({ table }: { table: MRT_TableInstance<any> }) => {
  const totalRows = table.getRowModel().rows.length;

  return (
    <div className="flex justify-between items-center px-4 py-2 text-sm text-primary">
      <div></div>
      {/* Right: total record count */}
      <div>
        {totalRows} record{totalRows !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

const defaultCalcHeight = '238px'

interface DataTableProps<TData extends MRT_RowData> {
  data: TData[],
  columns: MRT_ColumnDef<TData>[],
  loading?: boolean; // optional loading state
  calcHeight?: `${number}px`
  calcWidth?: `${number}px`
  toolbar?: Array<{ node: React.ReactNode, position?: "left" | "right" | "2nd-left" | "2nd-right" }>
  onRowSelectionChange?: () => void
  onPaginationChange?: () => void
  density?: MRT_DensityState
  count?: number;
  onGlobalFilterChange?: (value: string) => void
}

export type DataTableRef<TData extends MRT_RowData> = { table: MRT_TableInstance<TData> }
export const _DataTableBase = <TData extends MRT_RowData>(
  props: DataTableProps<TData>,
  ref: React.Ref<DataTableRef<TData>>
) => {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 20 });
  const columns = useMemo<MRT_ColumnDef<TData>[]>(
    () => props.columns,
    [props.columns],
  );

  const table = useMaterialReactTable<TData>({
    columns,
    data: props.data,
    enablePagination: true,
    enableMultiSort: true,
    enableSorting: true,
    enableGlobalFilter: true,
    enableTopToolbar: true,
    enableColumnActions: false,
    enableToolbarInternalActions: true,
    enableStickyHeader: true,
    enableHiding: false,
    enableColumnFilters: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableBottomToolbar: true,
    enableRowVirtualization: true,
    enableRowSelection: true,
    onPaginationChange: (state) => {
      setPagination(state);
      props.onPaginationChange?.();
    },
    onRowSelectionChange: (state) => {
      setRowSelection(state);
      props.onRowSelectionChange?.();
    },
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value);
      props.onGlobalFilterChange?.(value);
    },
    enableMultiRowSelection: true,
    initialState: {
      density: props.density || 'compact',
      showSkeletons: Boolean(props.loading),
    },
    state: {
      showSkeletons: Boolean(props.loading),
      rowSelection,
      pagination,
      globalFilter,
    },
    enableFilters: true,
    enableGlobalFilterRankedResults: false,
    renderTopToolbar: ({ table }) => <RenderTopToolbar table={table} toolbar={props.toolbar} />,
    // renderBottomToolbar: ({ table }) => <RenderBottomToolbar table={table} />,
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableEditing: true,
    columnFilterDisplayMode: 'popover',
    editDisplayMode: 'cell',
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: props.count || 0,
    // Tailwind/ShadCN styles for table
    muiTableContainerProps: ({ table }) => (
      {
        sx: {
          height: `calc(100vh - ${table.getState().isFullScreen ? '110px' : (props.calcHeight || defaultCalcHeight)})`,
          width: `calc(100vw - ${table.getState().isFullScreen ? 0 : (props.calcWidth)})`,
          overflowY: 'auto',
          overflowX: 'auto',
        },
      }
    ),
    muiTopToolbarProps: {
      sx: {
        width: '100%', // ensures full width in MUI system
        '& .MuiBox-root': {
          width: '100%',
          display: 'flex',
          flex: 1,
        },
      },
      className: 'bg-primary text-primary font-semibold w-full flex justify-between items-center',
    },
    muiTablePaperProps: { className: 'shadow-md rounded-lg border border-primary/20' },
    muiTableBodyProps: { className: 'divide-y divide-gray-200' },
    muiTableHeadCellProps: { className: 'bg-primary/10 text-primary font-semibold' },
    muiTableBodyCellProps: { className: 'py-2 px-4 text-gray-800' },
  });
  // expose table instance to parent
  useImperativeHandle(ref, () => ({
    table,
  }));

  return (
    <WithThemeProvider>
      <MaterialReactTable table={table} />
    </WithThemeProvider>
  );
};




const ForwardedDataTableBase = forwardRef(_DataTableBase) as <TData extends MRT_RowData>(
  props: DataTableProps<TData> & { ref?: React.Ref<{ table: MRT_TableInstance<TData> }> }
) => React.JSX.Element;




export const DataTable = ForwardedDataTableBase;