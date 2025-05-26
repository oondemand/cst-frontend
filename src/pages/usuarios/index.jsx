import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataGrid } from "../../components/dataGrid";
import { makeUsuarioDynamicColumns } from "./columns";
import { UsuarioService } from "../../service/usuario";
import { UsuariosDialog } from "./dialog";
import { useDataGrid } from "../../hooks/useDataGrid";
import { useUpdateUsuario } from "../../hooks/api/usuarios/useUpdateUsuario";
import { queryClient } from "../../config/react-query";
import { ORIGENS } from "../../constants/origens";
import { Container } from "../../components/container";

export const UsuariosPage = () => {
  const columns = useMemo(() => makeUsuarioDynamicColumns({}), []);

  const { filters, table } = useDataGrid({ columns, key: "USUARIOS" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-usuarios", { filters }],
    queryFn: async () => await UsuarioService.listarUsuarios({ filters }),
    placeholderData: keepPreviousData,
  });

  const updateUsuario = useUpdateUsuario({
    onSuccess: () =>
      queryClient.invalidateQueries(["listar-usuarios", { filters }]),
    origem: ORIGENS.DATAGRID,
  });

  return (
    <>
      <Container>
        <Box>
          <Text fontSize="lg" color="gray.700" fontWeight="semibold">
            Usuarios
          </Text>
          <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
            <DataGrid
              form={UsuariosDialog}
              table={table}
              data={data?.results || []}
              rowCount={data?.pagination?.totalItems}
              isDataLoading={isLoading || isFetching}
              onUpdateData={async (values) => {
                await updateUsuario.mutateAsync({
                  id: values.id,
                  body: values.data,
                });
              }}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
};
