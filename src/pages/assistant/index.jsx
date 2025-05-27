import React, { useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataGrid } from "../../components/dataGrid";
import { useDataGrid } from "../../hooks/useDataGrid";
import { makeAssistenteConfigDynamicColumns } from "./columns";
import { queryClient } from "../../config/react-query";
import { AssistenteConfigDialog } from "./dialog";
import { AssistantConfigService } from "../../service/assistant-config";
import { useUpdateAssistantConfig } from "../../hooks/api/assistant-config/useUpdateAssistantConfig";
import { ORIGENS } from "../../constants/origens";
import { Container } from "../../components/container";

export const AssistenteConfigPage = () => {
  const columns = useMemo(() => makeAssistenteConfigDynamicColumns({}), []);
  const { filters, table } = useDataGrid({ columns, key: "ASSISTENTE_CONFIG" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-assistente-config", { filters }],
    queryFn: async () =>
      await AssistantConfigService.listarAssistenteConfig({ filters }),
    placeholderData: keepPreviousData,
  });

  const updateAssistantConfig = useUpdateAssistantConfig({
    origem: ORIGENS.DATAGRID,
    onSuccess: () =>
      queryClient.refetchQueries(["listar-assistente-config", { filters }]),
  });

  return (
    <Container>
      <Box>
        <Text fontSize="lg" color="gray.700" fontWeight="semibold">
          Assistentes
        </Text>
        <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
          <DataGrid
            table={table}
            form={AssistenteConfigDialog}
            data={data?.results || []}
            rowCount={data?.pagination?.totalItems}
            isDataLoading={isLoading || isFetching}
            onUpdateData={async (values) => {
              await updateAssistantConfig.mutateAsync({
                id: values.id,
                body: values.data,
              });
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};
