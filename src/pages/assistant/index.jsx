import React, { useMemo } from "react";

import { Flex, Spinner, Box, Button, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { DebouncedInput } from "../../components/DebouncedInput";
import { DataGrid } from "../../components/dataGrid";
import { useDataGrid } from "../../hooks/useDataGrid";

import { makeAssistenteConfigDynamicColumns } from "./columns";

import { toaster } from "../../components/ui/toaster";
import { queryClient } from "../../config/react-query";

import { VisibilityControlDialog } from "../../components/vibilityControlDialog";
import { AssistenteConfigDialog } from "./dialog";
import { AssistantConfigService } from "../../service/assistant-config";

export const AssistenteConfigPage = () => {
  const columns = useMemo(() => makeAssistenteConfigDynamicColumns({}), []);
  const { filters, table } = useDataGrid({ columns, key: "ASSISTENTE_CONFIG" });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-assistente-config", { filters }],
    queryFn: async () =>
      await AssistantConfigService.listarAssistenteConfig({ filters }),
    placeholderData: keepPreviousData,
  });

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
            table={table}
            form={AssistenteConfigDialog}
            data={data?.assistentes || []}
            rowCount={data?.pagination?.totalItems}
            isDataLoading={isLoading || isFetching}
            onUpdateData={async (values) => {
              await updateAssistenteConfigMutation({
                id: values.id,
                data: values.data,
              });
            }}
          />
        </Box>
      </Box>
    </Flex>
  );
};
