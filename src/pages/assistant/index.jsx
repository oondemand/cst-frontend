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
