import { useFilters } from "./useFilters";
import { useColumnVisibility } from "./useColumnVisibility";
import { useColumnSizing } from "./useColumnSizing";
import { sortByToState, stateToSortBy } from "../utils/sorting";

/*Hook responsável por criar as configurações comuns do data grid */
export const useDataGrid = ({ key, columns, exportModel, ...tableProps }) => {
  const { filters, resetFilters, setFilters } = useFilters({ key });
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    key,
  });

  const {
    columnSizing,
    columnSizingInfo,
    setColumnSizing,
    setColumnSizingInfo,
  } = useColumnSizing({
    key,
  });

  const onFilterChange = (value) => {
    setFilters((prev) => ({ ...prev, ...value, pageIndex: 0 }));
  };

  const pagination = {
    pageIndex: filters.pageIndex ?? 0,
    pageSize: filters.pageSize ?? 10,
  };

  const sorting = sortByToState(filters.sortBy);

  const table = {
    filters,
    resetFilters,
    setFilters,
    onFilterChange,
    columns,
    exportModel,
    state: {
      pagination,
      sorting,
      columnVisibility,
      columnSizing,
      columnSizingInfo,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: (updaterOrValue) => {
      return setFilters((prev) => ({
        ...prev,
        sortBy: stateToSortBy(updaterOrValue(sortingState)),
      }));
    },
    defaultColumn: {
      minSize: 50,
      maxSize: 800,
    },
    onPaginationChange: (pagination) => {
      setFilters(pagination);
    },
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnSizingInfoChange: setColumnSizingInfo,
    onColumnSizingChange: setColumnSizing,
    ...tableProps,
  };

  return { table, filters, onFilterChange, resetFilters };
};
