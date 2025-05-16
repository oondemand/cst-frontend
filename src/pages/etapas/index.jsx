import React, { useMemo } from "react";

import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { DataGrid } from "../../components/dataGrid";
import { useDataGrid } from "../../hooks/useDataGrid";

import { makeEtapasDynamicColumns } from "./columns";

import { toaster } from "../../components/ui/toaster";
import { queryClient } from "../../config/react-query";

import { EtapaService } from "../../service/etapa";
import { EtapasDialog } from "./dialog";

export const EtapasPage = () => {
  const columns = useMemo(() => makeEtapasDynamicColumns({}), []);

  const { filters, table } = useDataGrid({ columns, key: "ETAPAS" });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-etapas", { filters }],
    queryFn: async () => await EtapaService.listarEtapas({ filters }),
    placeholderData: keepPreviousData,
  });

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
          <DataGrid
            table={table}
            form={EtapasDialog}
            data={data?.etapas || []}
            rowCount={data?.pagination?.totalItems}
            isDataLoading={isLoading || isFetching}
            onUpdateData={async (values) => {
              await updateEtapasMutation({
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
