import {
  Box,
  Text,
  Grid,
  GridItem,
  Button,
  Table,
  Flex,
} from "@chakra-ui/react";

import { currency } from "../../../../utils/currency";
import { useState } from "react";
import { CircleX } from "lucide-react";
import { ServicoService } from "../../../../service/servico";
import { useQuery } from "@tanstack/react-query";
import { toaster } from "../../../../components/ui/toaster";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { Select } from "chakra-react-select";
import { chakraStyles } from "../../../../components/ticketModal/form/select-chakra-styles";
import { formatDateToDDMMYYYY } from "../../../../utils/formatting";

const formatarLabelServico = (servico) => {
  return {
    label: `${
      servico?.tipoDocumentoFiscal ?? ""
    } COMP. ${servico?.competencia?.mes.toString().padStart(2, "0")}/${
      servico?.competencia?.ano
    }   REGIST. ${formatDateToDDMMYYYY(
      servico?.dataRegistro,
      "dd/MM/yyyy"
    )} ${currency.format(servico?.valor ?? 0)}`,
    value: servico,
  };
};

export const ServicoForm = ({ prestadorId, servicos, setServicos }) => {
  const { data } = useQuery({
    queryKey: ["listar-servicos-prestador", { prestadorId }],
    queryFn: async () =>
      await ServicoService.listarServicosPorPrestador({
        prestadorId,
        dataRegistro: "",
      }),
  });

  const options = data
    ?.filter((servico) => !servicos.some((s) => s._id === servico._id))
    .map(formatarLabelServico);

  const handleDeleteServico = async (servicoId) => {
    setServicos((prevServicos) =>
      prevServicos.filter((servico) => servico._id !== servicoId)
    );
  };

  const handleAddServico = (selectedOption) => {
    if (!selectedOption) return;
    const servico = selectedOption.value;
    setServicos((prevServicos) => [...prevServicos, servico]);
  };

  return (
    <Box>
      <Box
        mt="2"
        w="full"
        h="1"
        borderBottom="2px solid"
        borderColor="gray.100"
      />
      <Box px="1" mt="8">
        <Flex gap="4">
          <Text color="gray.600" fontSize="sm">
            Relacionar serviço
          </Text>
        </Flex>
        <Select
          options={options}
          onChange={(option) => handleAddServico(option)}
          value=""
          chakraStyles={chakraStyles}
        />
      </Box>
      {servicos && servicos?.length > 0 && (
        <Box
          mt="6"
          border="1px solid"
          borderColor="gray.100"
          rounded="2xl"
          p="4"
        >
          <Table.Root variant="simple" size="xs" justifyItems="right">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader />
                <Table.ColumnHeader color="gray.500" fontSize="sm">
                  Competência
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.500" fontSize="sm">
                  Descrição
                </Table.ColumnHeader>
                <Table.ColumnHeader color="gray.500" fontSize="sm">
                  Valor
                </Table.ColumnHeader>
                <Table.ColumnHeader width="20px" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {servicos?.map((servico) => (
                <Table.Row key={servico._id}>
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
                      {servico?.competencia?.mes.toString().padStart(2, "0")}/
                      {servico?.competencia?.ano}
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
                  <Table.Cell>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleDeleteServico(servico._id)}
                      _hover={{ bg: "transparent" }}
                    >
                      <CircleX size={15} color="red" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};
