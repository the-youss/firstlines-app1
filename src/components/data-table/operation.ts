import type { ColumnType, ExtendedSortingState, Filter, FilterOperator } from "./types"
import { dataTableConfig } from './config'
import { toBoolean } from "@/lib/utils"


/**
 * Determine the default filter operator for a given column type.
 *
 * This function returns the most appropriate default filter operator based on the
 * column's data type. For text columns, it returns 'iLike' (case-insensitive like),
 * while for all other types, it returns 'eq' (equality).
 *
 * @param columnType - The type of the column (e.g., 'text', 'number', 'date', etc.).
 * @returns The default FilterOperator for the given column type.
 */
export function getDefaultFilterOperator(
  columnType: ColumnType
): FilterOperator {
  if (columnType === "between") {
    return "iLike"
  }

  return "eq"
}

/**
 * Retrieve the list of applicable filter operators for a given column type.
 *
 * This function returns an array of filter operators that are relevant and applicable
 * to the specified column type. It uses a predefined mapping of column types to
 * operator lists, falling back to text operators if an unknown column type is provided.
 *
 * @param columnType - The type of the column for which to get filter operators.
 * @returns An array of objects, each containing a label and value for a filter operator.
 */
export function getFilterOperators(columnType: ColumnType) {
  const operatorMap: Record<
    ColumnType,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    select: dataTableConfig.selectOperators,
    "multi-select": dataTableConfig.selectOperators,
    boolean: dataTableConfig.booleanOperators,
    date: dataTableConfig.dateOperators,
  }

  return operatorMap[columnType] ?? dataTableConfig.textOperators
}






export function filterArray<T>({
  data,
  filters,
  joinOperator,
}: {
  data: T[];
  filters: Filter<T>[];
  joinOperator: "and" | "or";
}): T[] {
  return data.filter((item) => {
    const conditions = filters.map((filter) => {
      const { id, operator, value: _value, type } = filter;
      const value = type === 'boolean' ? toBoolean(_value) : _value
      const itemValue = item[id]
      switch (operator) {
        case "eq":
          return Array.isArray(value)
            ? value.includes(itemValue)
            : itemValue === value;
        case "ne":
          return Array.isArray(value)
            ? !value.includes(itemValue)
            : itemValue !== value;
        case "iLike":
          return type === "text" && typeof itemValue === "string"
            ? itemValue.toLowerCase().includes(value.toLowerCase())
            : false;
        case "notILike":
          return type === "text" && typeof itemValue === "string"
            ? !itemValue.toLowerCase().includes(value.toLowerCase())
            : false;
        case "lt":
          return itemValue < value;
        case "lte":
          return itemValue <= value;
        case "gt":
          return itemValue > value;
        case "gte":
          return itemValue >= value;
        case "isBetween":
          return Array.isArray(value) && value.length === 2
            ? itemValue >= value[0] && itemValue <= value[1]
            : false;
        case "isEmpty":
          return itemValue == null || itemValue === "";
        case "isNotEmpty":
          return itemValue != null && itemValue !== "";
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    });

    // Combine conditions based on the join operator
    return joinOperator === "and"
      ? conditions.every((condition) => condition)
      : conditions.some((condition) => condition);
  });
}
export function getValidFilters<TData>(
  filters: Filter<TData>[]
): Filter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
        filter.value !== null &&
        filter.value !== undefined)
  )
}


export function sortArray<T>(
  data: T[],
  sortCriteria: ExtendedSortingState
): T[] {
  return data.sort((a, b) => {
    for (const { id, desc } of sortCriteria) {
      const aValue = a[id as keyof T];
      const bValue = b[id as keyof T];

      if (aValue < bValue) {
        return desc ? 1 : -1; // If descending, return 1 to place 'b' first
      }
      if (aValue > bValue) {
        return desc ? -1 : 1; // If descending, return -1 to place 'a' first
      }
    }
    return 0; // If all values are equal, keep the current order
  });
}