import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { makeServicoDynamicColumns } from "./columns";
import { Box } from "@chakra-ui/react";
import { DataGrid } from "../../../../components/dataGrid";
import { useDataGrid } from "../../../../hooks/useDataGrid";
import { PlanejamentoService } from "../../../../service/planejamento";

export const SelecaoManualTab = () => {
  const columns = makeServicoDynamicColumns();

  const { filters, table } = useDataGrid({
    columns,
    key: "PLANEJAMENTO_MENSAL",
    enableColumnResizing: false,
    globalFilter: false,
  });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["planejamento-mensal-listar-servicos", { filters }],
    queryFn: async () => await PlanejamentoService.listarServicos({ filters }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <Box
        bg="white"
        py="4"
        px="2"
        rounded="lg"
        data-state="open"
        shadow="xs"
        _open={{
          animation: "fade-in 300ms ease-out",
        }}
      >
        <DataGrid
          title="Serviços"
          data={data?.servicos || []}
          striped={false}
          table={table}
          rowCount={data?.pagination?.totalItems}
          isDataLoading={isLoading || isFetching}
        />
      </Box>
    </>
  );
};
