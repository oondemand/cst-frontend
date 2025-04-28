import { Box, Text, Flex, Grid, GridItem } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { BuildForm } from "../../buildForm/index";
import { useVisibleInputForm } from "../../../hooks/useVisibleInputForms";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../config/api";
import { PrestadorService } from "../../../service/prestador";
import { AsyncSelectAutocomplete } from "../../asyncSelectAutoComplete";

import { VisibilityControlDialog } from "../../vibilityControlDialog";
import { formatDateToDDMMYYYY } from "../../../utils/formatting";
import { toaster } from "../../ui/toaster";

import { DefaultField } from "../../buildForm/filds/default";
import { z } from "zod";
import { SelectCategoriaField } from "../../buildForm/filds/selectCategoriaField";
import { SelectContaCorrenteField } from "../../buildForm/filds/selectContaCorrenteField";

export const fetchOptions = async (inputValue) => {
  return await api.get(`/prestadores?searchTerm=${inputValue}`);
};

const obterPrestadores = async (inputValue) => {
  const {
    data: { prestadores },
  } = await fetchOptions(inputValue);

  return prestadores.map((item) => {
    return {
      ...item,
      value: item._id,
      label: `${item.nome} ${`${
        item.documento ? `DOC. ${item.documento}` : ""
      }`}`,
    };
  });
};

export const InformacoesAdicionaisForm = ({
  ticket,
  updateTicketMutation,
  onlyReading,
}) => {
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "INFO_TICKET_MODAL_FORM",
  });

  const onSubmit = async (values) => {
    await updateTicketMutation({ id: ticket._id, body: values });
  };

  const fields = [
    {
      accessorKey: "codigo_categoria",
      label: "Codigo categoria",
      render: SelectCategoriaField,
      validation: z
        .string()
        .nonempty("Código categoria é um campo obrigatório"),
      colSpan: 1,
    },
    {
      accessorKey: "conta_corrente",
      label: "Conta corrente",
      render: SelectContaCorrenteField,
      validation: z.number(),
      colSpan: 1,
    },
  ];

  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap="4" my="2">
        <GridItem colSpan={1} mt="6">
          <Box w="100px">
            <Text color="gray.600" fontSize="sm">
              Informações adicionais
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={3} mt="6">
          <Flex alignItems="center" gap="4" mb="6">
            <Box
              w="full"
              h="1"
              borderBottom="2px solid"
              borderColor="gray.100"
            />
            <VisibilityControlDialog
              fields={fields}
              setVisibilityState={setInputsVisibility}
              visibilityState={inputsVisibility}
              title="Ocultar inputs"
            />
          </Flex>
          <BuildForm
            disabled={!ticket || onlyReading}
            fields={fields}
            data={{
              ...ticket,
            }}
            shouldUseFormValues={true}
            visibleState={inputsVisibility}
            onSubmit={onSubmit}
            gridColumns={2}
            gap={4}
          />
        </GridItem>
      </Grid>
    </>
  );
};
