import React, { useMemo } from "react";

import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataGrid } from "../../components/dataGrid";
import { useDataGrid } from "../../hooks/useDataGrid";
import { makeEtapasDynamicColumns } from "./columns";
import { EtapaService } from "../../service/etapa";
import { EtapasDialog } from "./dialog";
import { useUpdateEtapa } from "../../hooks/api/etapas/useUpdateEtapa";
import { queryClient } from "../../config/react-query";

export const EtapasPage = () => {
  const columns = useMemo(() => makeEtapasDynamicColumns({}), []);

  const { filters, table } = useDataGrid({ columns, key: "ETAPAS" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-etapas", { filters }],
    queryFn: async () => await EtapaService.listarEtapas({ filters }),
    placeholderData: keepPreviousData,
  });

  const updateEtapa = useUpdateEtapa({
    onSuccess: () =>
      queryClient.invalidateQueries(["listar-etapas", { filters }]),
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
          <DataGrid
            table={table}
            form={EtapasDialog}
            data={data?.etapas || []}
            rowCount={data?.pagination?.totalItems}
            isDataLoading={isLoading || isFetching}
            onUpdateData={async (values) => {
              await updateEtapa.mutateAsync({
                id: values.id,
                body: values.data,
              });
            }}
          />
        </Box>
      </Box>
    </Flex>
  );
};
