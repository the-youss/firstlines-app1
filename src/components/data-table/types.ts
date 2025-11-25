import { MRT_FilterFns } from 'material-react-table'
import { type DataTableConfig } from './config'
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type StringKeyOf<TData> = Extract<keyof TData, string>

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}


export type ColumnType = keyof typeof MRT_FilterFns

export type FilterOperator = DataTableConfig["globalOperators"][number]


export interface DataTableFilterField<TData> {
  id: string
  label: string
  placeholder?: string
  options?: Option[]
}

export interface DataTableAdvancedFilterField<TData>
  extends DataTableFilterField<TData> {
  type: ColumnType
}

export type Filter<T> = {
  id: keyof T;
  operator: string;
  value: any;
  type: ColumnType;
  rowId: string
};

export interface DataTableRowAction<TData> {
  // row: Row<TData>
  type: "update" | "delete"
}


export enum JoinOperator {
  AND = 'and',
  OR = 'or'
}
export type ColumnSort = { id: string, desc: boolean }
export interface ExtendedColumnSort extends Omit<ColumnSort, "id"> {
  id: string
}
export type ExtendedSortingState = ExtendedColumnSort[]