import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { PrestadorService } from "../../service/prestador";
import { DataGrid } from "../../components/dataGrid";
import { makePrestadorDynamicColumns } from "./columns";
import { queryClient } from "../../config/react-query";
import { PrestadoresDialog } from "./dialog";
import { formatDateToDDMMYYYY } from "../../utils/formatting";
import { useNavigate } from "react-router-dom";
import { useDataGrid } from "../../hooks/useDataGrid";
import { useUpdatePrestador } from "../../hooks/api/prestador/useUpdatePrestador";
import { ORIGENS } from "../../constants/origens";

export const PrestadoresList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => makePrestadorDynamicColumns(), []);
  const { filters, table } = useDataGrid({ columns, key: "PRESTADORES" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-prestadores", { filters }],
    queryFn: async () => await PrestadorService.listarPrestadores({ filters }),
    placeholderData: keepPreviousData,
  });

  const updatePrestador = useUpdatePrestador({
    origem: ORIGENS.DATAGRID,
    onSuccess: () => {
      queryClient.refetchQueries(["listar-prestadores", { filters }]);
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
              data={data?.results || []}
              rowCount={data?.pagination?.totalItems}
              isDataLoading={isLoading || isFetching}
              onUpdateData={async (values) => {
                await updatePrestador.mutateAsync({
                  id: values.id,
                  body: values.data,
                });
              }}
            />
          </Box>
        </Box>
      </Flex>
    </>
  );
};
