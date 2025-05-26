import React, { useMemo } from "react";

import { Box } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataGrid } from "../../../../components/dataGrid";
import { makeTicketsArquivadosDynamicColumns } from "./columns";
import { RegistroService } from "../../../../service/registros";
import { MemoizedTableBody } from "./tableBody";
import { useDataGrid } from "../../../../hooks/useDataGrid";

export const RastreabilidadeTab = () => {
  const columns = useMemo(() => makeTicketsArquivadosDynamicColumns({}), []);

  const { filters, table } = useDataGrid({ columns, key: "REGISTROS-TAB" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-registros-tab", { filters }],
    queryFn: async () => await RegistroService.obterTodosRegistros({ filters }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <Box bg="white" py="6" px="4" rounded="lg" shadow="xs">
        <DataGrid
          table={table}
          data={data?.registros || []}
          rowCount={data?.pagination?.totalItems}
          isDataLoading={isLoading || isFetching}
          TableBody={MemoizedTableBody}
        />
      </Box>
    </>
  );
};
