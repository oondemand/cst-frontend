import React, { useMemo } from "react";

import { Flex, Spinner, Box, Button, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { DebouncedInput } from "../../components/DebouncedInput";
import { DataGrid } from "../../components/dataGrid";
import { useFilters } from "../../hooks/useFilters";
import { sortByToState, stateToSortBy } from "../../utils/sorting";
import { useColumnVisibility } from "../../hooks/useColumnVisibility";
import { useColumnSizing } from "../../hooks/useColumnSizing";

import { makeEtapasDynamicColumns } from "./columns";

import { toaster } from "../../components/ui/toaster";
import { queryClient } from "../../config/react-query";

import { VisibilityControlDialog } from "../../components/vibilityControlDialog";
import { EtapaService } from "../../service/etapa";
import { EtapasDialog } from "./dialog";

export const EtapasPage = () => {
  const { filters, resetFilters, setFilters } = useFilters({
    key: "ETAPAS",
  });

  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    key: "ETAPAS",
  });

  const {
    columnSizing,
    columnSizingInfo,
    setColumnSizing,
    setColumnSizingInfo,
  } = useColumnSizing({
    key: "ETAPAS",
  });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-etapas", { filters }],
    queryFn: async () => await EtapaService.listarEtapas({ filters }),
    placeholderData: keepPreviousData,
  });

  const paginationState = {
    pageIndex: filters.pageIndex ?? 0,
    pageSize: filters.pageSize ?? 10,
  };

  const sortingState = sortByToState(filters.sortBy);
  const columns = useMemo(() => makeEtapasDynamicColumns({}), []);

  const { mutateAsync: updateEtapasMutation } = useMutation({
    mutationFn: async ({ id, data }) =>
      await EtapaService.alterarEtapa({ body: data, id }),
    onSuccess() {
      queryClient.refetchQueries(["listar-etapas", { filters }]);
      toaster.create({
        title: "Etapa atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o etapa",
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
          Etapas
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
            <EtapasDialog />

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
            data={data?.etapas || []}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnSizing={columnSizing}
            columnSizingInfo={columnSizingInfo}
            setColumnSizing={setColumnSizing}
            setColumnSizingInfo={setColumnSizingInfo}
            onUpdateData={async (values) => {
              console.log("VAL", values);
              await updateEtapasMutation({
                id: values.prestadorId,
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
