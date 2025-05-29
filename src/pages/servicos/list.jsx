import React, { useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ServicoService } from "../../service/servico";
import { DataGrid } from "../../components/dataGrid";
import { makeServicoDynamicColumns } from "./columns";
import { queryClient } from "../../config/react-query";
import { ServicosDialog } from "./dialog";
import { formatDateToDDMMYYYY } from "../../utils/formatting";
import { useNavigate } from "react-router-dom";
import { useDataGrid } from "../../hooks/useDataGrid";
import { useUpdateServico } from "../../hooks/api/servico/useUpdateServico";
import { ORIGENS } from "../../constants/origens";
import { Container } from "../../components/container";

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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-servicos", { filters }],
    queryFn: async () => await ServicoService.listarServicos({ filters }),
    placeholderData: keepPreviousData,
  });

  const updateServico = useUpdateServico({
    onSuccess: () =>
      queryClient.refetchQueries(["listar-servicos", { filters }]),
    origem: ORIGENS.DATAGRID,
  });

  const getAllServicosWithFilters = async (pageSize) => {
    const { results } = await ServicoService.listarServicos({
      filters: {
        ...filters,
        pageSize: pageSize ? pageSize : data?.pagination?.totalItems,
        pageIndex: 0,
      },
    });

    return results.map((e) => ({
      ...e,
      dataRegistro: formatDateToDDMMYYYY(e?.dataRegistro),
      revisionMonthProvision: formatDateToDDMMYYYY(e?.revisionMonthProvision),
      competencia: `${e?.competencia?.mes.toString().padStart(2, 0)}/${
        e?.competencia?.ano
      }`,
    }));
  };

  return (
    <Container>
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
            data={data?.results || []}
            rowCount={data?.pagination?.totalItems}
            isDataLoading={isLoading || isFetching}
            onUpdateData={async (values) => {
              await updateServico.mutateAsync({
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
