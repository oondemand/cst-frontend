import React, { useMemo } from "react";

import { Flex, Spinner, Box, Button, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { DebouncedInput } from "../../components/DebouncedInput";
import { DataGrid } from "../../components/dataGrid";
import { useFilters } from "../../hooks/useFilters";
import { sortByToState, stateToSortBy } from "../../utils/sorting";
import { useColumnVisibility } from "../../hooks/useColumnVisibility";
import { useColumnSizing } from "../../hooks/useColumnSizing";

import { makeAssistenteConfigDynamicColumns } from "./columns";

import { toaster } from "../../components/ui/toaster";
import { queryClient } from "../../config/react-query";

import { VisibilityControlDialog } from "../../components/vibilityControlDialog";
import { AssistenteConfigDialog } from "./dialog";
import { AssistantConfigService } from "../../service/assistant-config";

export const AssistenteConfigPage = () => {
  const { filters, resetFilters, setFilters } = useFilters({
    key: "ASSISTENTE_CONFIG",
  });

  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    key: "ASSISTENTE_CONFIG",
  });

  const {
    columnSizing,
    columnSizingInfo,
    setColumnSizing,
    setColumnSizingInfo,
  } = useColumnSizing({
    key: "ASSISTENTE_CONFIG",
  });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-assistente-config", { filters }],
    queryFn: async () =>
      await AssistantConfigService.listarAssistenteConfig({ filters }),
    placeholderData: keepPreviousData,
  });

  const paginationState = {
    pageIndex: filters.pageIndex ?? 0,
    pageSize: filters.pageSize ?? 10,
  };

  const sortingState = sortByToState(filters.sortBy);
  const columns = useMemo(() => makeAssistenteConfigDynamicColumns({}), []);

  const { mutateAsync: updateAssistenteConfigMutation } = useMutation({
    mutationFn: async ({ id, data }) =>
      await AssistantConfigService.alterarAssistenteConfig({ body: data, id }),
    onSuccess() {
      queryClient.refetchQueries(["listar-assistente-config", { filters }]);
      toaster.create({
        title: "Assistente atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o assistente",
        type: "error",
      });
    },
  });

  return (
    <Flex
      flex="1"
      py="8"
      px="6"
      pb="2"
      itens="center"
      overflow="auto"
      scrollbarWidth="thin"
      bg="#F8F9FA"
    >
      <Box>
        <Text fontSize="lg" color="gray.700" fontWeight="semibold">
          Assistentes
        </Text>
        <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
          <Flex
            w="full"
            alignItems="center"
            justifyContent="flex-start"
            pb="2"
            gap="4"
          >
            <DebouncedInput
              value={filters.searchTerm}
              debounce={700}
              onChange={(value) => {
                setFilters((prev) => ({
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
            <Button
              size="sm"
              variant="subtle"
              color="brand.500"
              fontWeight="semibold"
              onClick={resetFilters}
              minW="32"
            >
              {(isLoading || isFetching) && <Spinner size="md" />}
              {!isLoading && !isFetching && "Limpar filtros"}
            </Button>
            <AssistenteConfigDialog />

            <VisibilityControlDialog
              fields={columns.map((e) => ({
                label: e.header,
                accessorKey: e.accessorKey.replaceAll(".", "_"),
              }))}
              title="Ocultar colunas"
              setVisibilityState={setColumnVisibility}
              visibilityState={columnVisibility}
            />
          </Flex>

          <DataGrid
            filters={filters}
            sorting={sortingState}
            columns={columns}
            pagination={paginationState}
            data={data?.assistentes || []}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnSizing={columnSizing}
            columnSizingInfo={columnSizingInfo}
            setColumnSizing={setColumnSizing}
            setColumnSizingInfo={setColumnSizingInfo}
            onUpdateData={async (values) => {
              await updateAssistenteConfigMutation({
                id: values.id,
                data: values.data,
              });
            }}
            onFilterChange={(value) => {
              setFilters((prev) => ({ ...prev, ...value, pageIndex: 0 }));
            }}
            paginationOptions={{
              onPaginationChange: (pagination) => {
                setFilters(pagination);
              },
              rowCount: data?.pagination?.totalItems,
            }}
            onSortingChange={(updaterOrValue) => {
              return setFilters((prev) => ({
                ...prev,
                sortBy: stateToSortBy(updaterOrValue(sortingState)),
              }));
            }}
          />
        </Box>
      </Box>
    </Flex>
  );
};
