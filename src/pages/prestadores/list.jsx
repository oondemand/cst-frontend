import React, { useMemo } from "react";

import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { PrestadorService } from "../../service/prestador";
import { DataGrid } from "../../components/dataGrid/datagrid";
import { makePrestadorDynamicColumns } from "./columns";

import { api } from "../../config/api";
import { toaster } from "../../components/ui/toaster";
import { queryClient } from "../../config/react-query";

import { PrestadoresDialog } from "./dialog";

import { formatDateToDDMMYYYY } from "../../utils/formatting";
import { useNavigate } from "react-router-dom";
import { useDataGrid } from "../../hooks/useDataGrid";

export const PrestadoresList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => makePrestadorDynamicColumns(), []);
  const { filters, table } = useDataGrid({ columns, key: "PRESTADORES" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-prestadores", { filters }],
    queryFn: async () => await PrestadorService.listarPrestadores({ filters }),
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: updatePrestadorMutation } = useMutation({
    mutationFn: async ({ id, data }) =>
      await api.patch(`prestadores/${id}`, data),
    onSuccess() {
      queryClient.refetchQueries(["listar-prestadores", { filters }]);
      toaster.create({
        title: "Prestador atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o prestador",
        type: "error",
      });
    },
  });

  const getAllPrestadoresWithFilters = async (pageSize) => {
    const { prestadores } = await PrestadorService.listarPrestadores({
      filters: {
        ...filters,
        pageSize: pageSize ? pageSize : data?.pagination?.totalItems,
        pageIndex: 0,
      },
    });

    return prestadores.map((e) => ({
      ...e,
      pessoaFisica: {
        ...e.pessoaFisica,
        dataNascimento: formatDateToDDMMYYYY(e?.pessoaFisica?.dataNascimento),
      },
    }));
  };

  return (
    <>
      <Flex
        flex="1"
        pt="8"
        px="6"
        pb="2"
        itens="center"
        overflow="auto"
        scrollbarWidth="thin"
        bg="#F8F9FA"
      >
        <Box>
          <Text fontSize="lg" color="gray.700" fontWeight="semibold">
            Prestadores
          </Text>
          <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
            <DataGrid
              form={PrestadoresDialog}
              exportDataFn={getAllPrestadoresWithFilters}
              importDataFn={() => navigate("/prestadores/importacao")}
              table={table}
              data={data?.prestadores || []}
              rowCount={data?.pagination?.totalItems}
              isDataLoading={isLoading || isFetching}
              onUpdateData={async (values) => {
                await updatePrestadorMutation({
                  id: values.id,
                  data: values.data,
                });
              }}
            />
          </Box>
        </Box>
      </Flex>
    </>
  );
};
