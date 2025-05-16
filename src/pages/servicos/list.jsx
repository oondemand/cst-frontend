import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { ServicoService } from "../../service/servico";
import { DataGrid } from "../../components/dataGrid";
import { makeServicoDynamicColumns } from "./columns";
import { api } from "../../config/api";
import { toaster } from "../../components/ui/toaster";
import { queryClient } from "../../config/react-query";
import { ServicosDialog } from "./dialog";
import { formatDateToDDMMYYYY } from "../../utils/formatting";
import { useNavigate } from "react-router-dom";
import { useDataGrid } from "../../hooks/useDataGrid";

export const ServicosList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => makeServicoDynamicColumns({}), []);
  const modeloDeExportacao = [
    {
      accessorKey: "prestador.nome",
      header: "Nome Prestador",
    },
    {
      accessorKey: "prestador.documento",
      header: "Documento Prestador",
    },
    ...columns
      .filter((e) => e.accessorKey !== "prestador")
      .map((e) => ({ accessorKey: e.accessorKey, header: e.header })),
  ];

  const { table, filters } = useDataGrid({
    columns,
    key: "SERVICOS",
    exportModel: modeloDeExportacao,
  });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-servicos", { filters }],
    queryFn: async () => await ServicoService.listarServicos({ filters }),
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: updateServicoMutation } = useMutation({
    mutationFn: async ({ id, data }) => await api.patch(`servicos/${id}`, data),
    onSuccess() {
      queryClient.refetchQueries(["listar-servicos", { filters }]);
      toaster.create({
        title: "Serviço atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o serviço",
        type: "error",
      });
    },
  });

  const getAllServicosWithFilters = async (pageSize) => {
    const { servicos } = await ServicoService.listarServicos({
      filters: {
        ...filters,
        pageSize: pageSize ? pageSize : data?.pagination?.totalItems,
        pageIndex: 0,
      },
    });

    return servicos.map((e) => ({
      ...e,
      dataRegistro: formatDateToDDMMYYYY(e?.dataRegistro),
      revisionMonthProvision: formatDateToDDMMYYYY(e?.revisionMonthProvision),
      competencia: `${e?.competencia?.mes.toString().padStart(2, 0)}/${
        e?.competencia?.ano
      }`,
    }));
  };

  return (
    <>
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
            Serviços
          </Text>
          <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
            <DataGrid
              form={ServicosDialog}
              exportDataFn={getAllServicosWithFilters}
              importDataFn={() => navigate("/servicos/importacao")}
              table={table}
              data={data?.servicos || []}
              rowCount={data?.pagination?.totalItems}
              isDataLoading={isLoading || isFetching}
              onUpdateData={async (values) => {
                await updateServicoMutation({
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
