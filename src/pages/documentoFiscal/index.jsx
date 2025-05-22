import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DocumentosFiscaisService } from "../../service/documentos-fiscais";
import { DataGrid } from "../../components/dataGrid";
import { makeDocumentoFiscalDynamicColumns } from "./columns";
import { queryClient } from "../../config/react-query";
import { DocumentosFiscaisDialog } from "./dialog";
import { useNavigate } from "react-router-dom";
import { useDataGrid } from "../../hooks/useDataGrid";
import { useUpdateDocumentoFiscal } from "../../hooks/api/documento-fiscal/useUpdateDocumentoFiscal";
import { ORIGENS } from "../../constants/origens";

export const DocumentosFiscaisList = () => {
  const navigate = useNavigate();

  const columns = useMemo(() => makeDocumentoFiscalDynamicColumns({}), []);
  const modeloDeExportacao = [
    {
      accessorKey: "prestador.nome",
      header: "Nome Prestador",
    },
    {
      accessorKey: "prestador.sid",
      header: "SID Prestador",
    },
    {
      accessorKey: "prestador.documento",
      header: "Documento Prestador",
    },
    ...columns
      .filter((e) => e.accessorKey !== "prestador")
      .map((e) => ({ accessorKey: e.accessorKey, header: e.header })),
  ];

  const { filters, table } = useDataGrid({
    columns,
    exportModel: modeloDeExportacao,
    key: "DOCUMENTOS_FISCAIS",
  });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-documentos-fiscais", { filters }],
    queryFn: async () =>
      await DocumentosFiscaisService.listarDocumentosFiscais({ filters }),
    placeholderData: keepPreviousData,
  });

  const updateDocumentoFiscal = useUpdateDocumentoFiscal({
    onSuccess: () =>
      queryClient.invalidateQueries(["listar-documentos-fiscais", { filters }]),
    origem: ORIGENS.DATAGRID,
  });

  const getAllDocumentosFiscaisWithFilters = async (pageSize) => {
    const { results } = await DocumentosFiscaisService.listarDocumentosFiscais({
      filters: {
        ...filters,
        pageSize: pageSize ? pageSize : data?.pagination?.totalItems,
        pageIndex: 0,
      },
    });

    return results;
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
            Documentos fiscais
          </Text>
          <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
            <DataGrid
              table={table}
              form={DocumentosFiscaisDialog}
              exportDataFn={getAllDocumentosFiscaisWithFilters}
              importDataFn={() => navigate("/documentos-fiscais/importacao")}
              data={data?.results || []}
              isDataLoading={isLoading || isFetching}
              rowCount={data?.pagination?.totalItems}
              onUpdateData={async (values) => {
                await updateDocumentoFiscal.mutateAsync({
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
