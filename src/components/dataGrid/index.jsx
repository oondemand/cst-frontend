import { Box, Table, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useMemo } from "react";
import { DebouncedInput } from "../DebouncedInput";
import { VisibilityControlDialog } from "../vibilityControlDialog";
import { ExportData } from "./exportData";
import { MemoizedTableBody } from "./memoizedTableBody";
import { Pagination } from "./pagination";
import { TableHeader } from "./tableHeader";
import { TableFooter } from "./tableFooter";

export const DataGrid = ({
  striped = true,
  TableBody = MemoizedTableBody,
  table: tableProps,
  rowCount,
  isDataLoading,
  data,
  form: Form,
  exportDataFn,
  importDataFn,
  title,
  onUpdateData,
}) => {
  const table = useReactTable({
    ...tableProps,
    data,
    rowCount,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: async (...props) => await onUpdateData(...props),
    },
  });

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes = {};
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <>
      <Box>
        <Flex
          w="full"
          alignItems="center"
          justifyContent="flex-start"
          pb="2"
          gap="4"
        >
          {title && (
            <Text fontSize="lg" fontWeight="semibold" color="gray.500">
              {title}
            </Text>
          )}
          {tableProps.globalFilter !== false && (
            <DebouncedInput
              value={tableProps.filters.searchTerm}
              debounce={700}
              onChange={(value) => {
                tableProps.setFilters((prev) => ({
                  ...prev,
                  searchTerm: value,
                  pageIndex: 0,
                }));
              }}
              size="sm"
              iconSize={18}
              startOffset="2px"
              color="gray.700"
            />
          )}
          <Button
            size="sm"
            variant="subtle"
            color="brand.500"
            fontWeight="semibold"
            onClick={tableProps.resetFilters}
            minW="32"
          >
            {isDataLoading && <Spinner size="md" />}
            {!isDataLoading && "Limpar filtros"}
          </Button>
          {Form && <Form />}

          {importDataFn && (
            <Button
              size="sm"
              variant="subtle"
              fontWeight="semibold"
              color="brand.500"
              _hover={{ backgroundColor: "gray.50" }}
            >
              Importar planilha
            </Button>
          )}

          {exportDataFn && (
            <>
              <ExportData
                label="Exportar modelo"
                columns={tableProps?.exportModel ?? tableProps?.columns}
                dataToExport={() => exportDataFn(1)}
              />
              <ExportData
                columns={tableProps?.exportModel ?? tableProps?.columns}
                dataToExport={exportDataFn}
              />
            </>
          )}

          <VisibilityControlDialog
            fields={tableProps?.columns.map((e) => ({
              label: e.header,
              accessorKey: e.accessorKey.replaceAll(".", "_"),
            }))}
            title="Ocultar colunas"
            setVisibilityState={table.setColumnVisibility}
            visibilityState={table.getState().columnVisibility}
          />
        </Flex>

        <Table.Root
          size="xs"
          overflowY="scroll"
          colorScheme="gray"
          {...columnSizeVars}
          width={`${table.getTotalSize()}px`}
          striped={striped}
        >
          <TableHeader
            filters={tableProps.filters}
            onFilterChange={tableProps.onFilterChange}
            table={table}
          />

          <TableBody
            data={table.options.data}
            columns={table.getVisibleLeafColumns()}
            rows={table.getRowModel().rows}
          />

          <TableFooter table={table} />
        </Table.Root>

        <Pagination table={table} />
      </Box>
    </>
  );
};
