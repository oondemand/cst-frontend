import { Box, Text, Button, Table, Flex, Checkbox } from "@chakra-ui/react";

import { currency } from "../../../../utils/currency";
import { Check } from "lucide-react";
import { ServicoService } from "../../../../service/servico";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toaster } from "../../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../../service/documentos-fiscais";
import { queryClient } from "../../../../config/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ORIGENS } from "../../../../constants/origens";

const servicoSchema = z.object({
  servicos: z.array(z.object({ _id: z.string() }).transform((e) => e._id)),
});

export const AprovarForm = ({
  prestadorId,
  documentoFiscal,
  handleCloseModal,
}) => {
  const { data } = useQuery({
    queryKey: ["listar-servicos-prestador", { prestadorId }],
    queryFn: async () =>
      await ServicoService.listarServicosPorPrestador({
        prestadorId,
        dataRegistro: "",
      }),
  });

  const { mutateAsync: onAprovarDocumento, isPending } = useMutation({
    mutationFn: async ({ body }) =>
      await DocumentosFiscaisService.aprovarDocumentoFiscal({
        body,
        origem: ORIGENS.APROVACAO_DOCUMENTO_FISCAL,
      }),
    onSuccess: () => {
      toaster.create({
        title: "Documento fiscal aprovado com sucesso",
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["listar-documentos-fiscais"],
      });

      handleCloseModal();
    },
    onError: (error) => {
      toaster.create({
        title: "Erro ao aprovar documento fiscal",
        description: error?.message,
        type: "error",
      });
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      servicos: [],
    },
  });

  const handleAprovarDocumento = async (data) => {
    await onAprovarDocumento({
      body: {
        documentoFiscalId: documentoFiscal?._id,
        servicos: data.servicos,
        prestadorId,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(handleAprovarDocumento)}>
      <Box>
        <Box px="1" mt="2">
          <Flex gap="4">
            <Text color="gray.600" fontSize="sm">
              Relacionar serviços
            </Text>
          </Flex>
        </Box>
        {data && data?.length > 0 && (
          <Box>
            <Box
              mt="4"
              border="1px solid"
              borderColor="gray.100"
              rounded="sm"
              p="4"
            >
              <Table.Root variant="simple" size="xs" justifyItems="right">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader />
                    <Table.ColumnHeader color="gray.500" fontSize="sm">
                      Tipo
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.500" fontSize="sm">
                      Competência
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.500" fontSize="sm">
                      Descrição
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color="gray.500" fontSize="sm">
                      Valor
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data?.map((servico) => (
                    <Table.Row key={servico._id}>
                      <Table.Cell py="1">
                        <Controller
                          name="servicos"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Checkbox.Root
                              variant="subtle"
                              checked={value.some((s) => s._id === servico._id)}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  return onChange([...value, servico]);
                                }

                                return onChange(
                                  value.filter(
                                    (item) => item._id !== servico._id
                                  )
                                );
                              }}
                              cursor="pointer"
                              _disabled={{ cursor: "not-allowed" }}
                              size="sm"
                            >
                              <Checkbox.HiddenInput />
                              <Checkbox.Control>
                                <Checkbox.Indicator />
                              </Checkbox.Control>
                            </Checkbox.Root>
                          )}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Text
                          fontSize="xs"
                          color="gray.400"
                          mr="6"
                          px="1"
                          borderColor="gray.200"
                          rounded="xs"
                        >
                          {servico?.tipoDocumentoFiscal?.toUpperCase()}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="xs" color="gray.400">
                          {servico?.competencia?.mes
                            .toString()
                            .padStart(2, "0")}
                          /{servico?.competencia?.ano}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text truncate fontSize="xs" color="gray.400">
                          {servico?.descricao}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="xs" fontWeight="medium">
                          {currency.format(servico?.valor ?? 0)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
            {errors.servicos && (
              <Text fontSize="xs" color="red.500">
                {errors.servicos.message}
              </Text>
            )}
          </Box>
        )}
        <Box p="2" />
        <Button
          type="submit"
          disabled={isPending}
          variant="surface"
          shadow="xs"
          colorPalette="green"
          size="xs"
        >
          <Check /> Aprovar
        </Button>
      </Box>
    </form>
  );
};
