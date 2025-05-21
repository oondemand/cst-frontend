import React, { useMemo } from "react";

import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { DocumentosCadastraisService } from "../../service/documentos-cadastrais";
import { DataGrid } from "../../components/dataGrid";
import { useDataGrid } from "../../hooks/useDataGrid";

import { makeDocumentoCadastralDynamicColumns } from "./columns";

import { api } from "../../config/api";
import { toaster } from "../../components/ui/toaster";
import { queryClient } from "../../config/react-query";
import { DocumentoCadastralDialog } from "./dialog";
import { useNavigate } from "react-router-dom";
import { useUpdateDocumentoCadastral } from "../../hooks/api/documento-cadastral/useUpdateDocumentoCadastral";

export const DocumentoscadastraisList = () => {
  const navigate = useNavigate();

  const columns = useMemo(() => makeDocumentoCadastralDynamicColumns({}), []);
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
    key: "DOCUMENTOS_CADASTRAIS",
    columns,
    exportModel: modeloDeExportacao,
  });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-documentos-cadastrais", { filters }],
    queryFn: async () =>
      await DocumentosCadastraisService.listarDocumentosCadastrais({ filters }),
    placeholderData: keepPreviousData,
  });

  const updateDocumentoCadastral = useUpdateDocumentoCadastral({
    onSuccess: () =>
      queryClient.invalidateQueries([
        "listar-documentos-cadastrais",
        { filters },
      ]),
  });

  const getAllDocumentoscadastraisWithFilters = async (pageSize) => {
    const { documentosCadastrais } =
      await DocumentosCadastraisService.listarDocumentosCadastrais({
        filters: {
          ...filters,
          pageSize: pageSize ? pageSize : data?.pagination?.totalItems,
          pageIndex: 0,
        },
      });

    return documentosCadastrais;
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
            Documentos cadastrais
          </Text>
          <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
            <DataGrid
              table={table}
              importDataFn={() => navigate("/documentos-cadastrais/importacao")}
              exportDataFn={getAllDocumentoscadastraisWithFilters}
              form={DocumentoCadastralDialog}
              data={data?.documentosCadastrais || []}
              rowCount={data?.pagination?.totalItems}
              isDataLoading={isFetching || isLoading}
              onUpdateData={async (values) => {
                await updateDocumentoCadastral.mutateAsync({
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
