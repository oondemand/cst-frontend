import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataGrid } from "../../components/dataGrid";
import { makeTicketsArquivadosDynamicColumns } from "./columns";
import { TicketService } from "../../service/ticket";
import { useDataGrid } from "../../hooks/useDataGrid";
import { Container } from "../../components/container";

export const TicketsPagosPage = () => {
  const columns = useMemo(() => makeTicketsArquivadosDynamicColumns({}), []);
  const { filters, table } = useDataGrid({ columns, key: "TICKETS-PAGOS" });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["listar-tickets-pagos", { filters }],
    queryFn: async () => await TicketService.listarTicketsPagos({ filters }),
    placeholderData: keepPreviousData,
  });

  return (
    <Container>
      <Box>
        <Text fontSize="lg" color="gray.700" fontWeight="semibold">
          Tickets pagos
        </Text>
        <Box bg="white" mt="4" py="6" px="4" rounded="lg" shadow="xs">
          <DataGrid
            table={table}
            data={data?.results || []}
            rowCount={data?.pagination?.totalItems}
            isDataLoading={isLoading || isFetching}
          />
        </Box>
      </Box>
    </Container>
  );
};
