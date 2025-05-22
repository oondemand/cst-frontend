import React, { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataGrid } from "../../../../components/dataGrid";
import { makeTicketsArquivadosDynamicColumns } from "./columns";
import { TicketService } from "../../../../service/ticket";
import { MemoizedTableBody } from "./tableBody";
import { useDataGrid } from "../../../../hooks/useDataGrid";

export const ArquivadosTab = () => {
  const columns = useMemo(() => makeTicketsArquivadosDynamicColumns({}), []);

  const { table, filters } = useDataGrid({
    columns,
    key: "TICKETS-ARQUIVADOS",
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-tickets-arquivados", { filters }],
    queryFn: async () =>
      await TicketService.listarTicketsArquivados({ filters }),
    placeholderData: keepPreviousData,
  });
  return (
    <>
      <Box bg="white" py="6" px="4" rounded="lg" shadow="xs">
        <DataGrid
          table={table}
          data={data?.results || []}
          rowCount={data?.pagination?.totalItems}
          isDataLoading={isLoading || isFetching}
          TableBody={MemoizedTableBody}
        />
      </Box>
    </>
  );
};
