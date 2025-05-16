import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { DataGrid } from "../../components/dataGrid";
import { makeUsuarioDynamicColumns } from "./columns";
import { toaster } from "../../components/ui/toaster";
import { queryClient } from "../../config/react-query";
import { UsuarioService } from "../../service/usuario";
import { UsuariosDialog } from "./dialog";
import { useDataGrid } from "../../hooks/useDataGrid";

export const UsuariosPage = () => {
  const columns = useMemo(() => makeUsuarioDynamicColumns({}), []);

  const { filters, table } = useDataGrid({ columns, key: "USUARIOS" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-usuarios", { filters }],
    queryFn: async () => await UsuarioService.listarUsuarios({ filters }),
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: updateUsuariosMutation } = useMutation({
    mutationFn: async ({ id, data }) =>
      await UsuarioService.alterarUsuario({ body: data, id }),
    onSuccess() {
      queryClient.refetchQueries(["listar-usuarios", { filters }]);
      toaster.create({
        title: "Usuario atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o usuario",
        type: "error",
      });
    },
  });

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
            Usuarios
          </Text>
          <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
            <DataGrid
              form={UsuariosDialog}
              table={table}
              data={data?.usuarios || []}
              rowCount={data?.pagination?.totalItems}
              isDataLoading={isLoading || isFetching}
              onUpdateData={async (values) => {
                await updateUsuariosMutation({
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
