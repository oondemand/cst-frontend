import {
  Box,
  Text,
  Grid,
  GridItem,
  Button,
  Table,
  Flex,
  Checkbox,
} from "@chakra-ui/react";

import { currency } from "../../../../utils/currency";
import { CircleX, Check } from "lucide-react";
import { ServicoService } from "../../../../service/servico";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toaster } from "../../../../components/ui/toaster";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { Select } from "chakra-react-select";
import { chakraStyles } from "../../../../components/ticketModal/form/select-chakra-styles";
import { formatDateToDDMMYYYY } from "../../../../utils/formatting";
import { DocumentosFiscaisService } from "../../../../service/documentos-fiscais";
import { queryClient } from "../../../../config/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VisibilityControlDialog } from "../../../../components/vibilityControlDialog";
import { createDynamicFormFields } from "../../../prestadores/formFields";
import { useMemo } from "react";
import { useVisibleInputForm } from "../../../../hooks/useVisibleInputForms";
import { PrestadorService } from "../../../../service/prestador";
import { BuildForm } from "../../../../components/buildForm";
import { DocumentosCadastraisService } from "../../../../service/documentos-cadastrais";

const servicoSchema = z.object({
  servicos: z.array(z.object({ _id: z.string() }).transform((e) => e._id)),
});

export const AprovarForm = ({ prestadorId, documentoCadastral }) => {
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "PRESTADORES_DOCUMENTO_CADASTAL_MODAL_FORM",
  });

  const { data } = useQuery({
    queryKey: ["listar-prestador", { prestadorId }],
    queryFn: async () =>
      await PrestadorService.obterPrestador({
        id: prestadorId,
      }),
  });

  console.log("[DATA]:", data);

  const { mutateAsync: updatePrestadorMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await PrestadorService.atualizarPrestador({ id, body }),
    onSuccess: (data) => {
      toaster.create({
        title: "Prestador atualizado com sucesso",
        type: "success",
      });
    },
  });

  const { mutateAsync: onAprovarDocumento, isPending } = useMutation({
    mutationFn: async () =>
      await DocumentosCadastraisService.atualizarDocumentoCadastral({
        body: {
          statusValidacao: "aprovado",
        },
        id: documentoCadastral?._id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar-documentos-cadastrais"],
      });
      toaster.create({
        title: "Documento cadastral aprovado com sucesso!",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro ao aprovar o documento cadastral!",
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
    await onAprovarDocumento();
  };

  const fields = useMemo(() => createDynamicFormFields(), []);

  const onSubmitPrestador = async (values) => {
    const {
      endereco: { pais, ...rest },
    } = values;

    const body = {
      ...values,
      email: values?.email === "" ? null : values?.email,
      endereco: { ...rest, ...(pais.cod ? { pais } : {}) },
    };

    return await updatePrestadorMutation({ id: prestadorId, body });
  };

  return (
    <form onSubmit={handleSubmit(handleAprovarDocumento)}>
      <Box>
        <Box mt="2">
          <Flex gap="4" alignItems="center" justifyContent="space-between">
            <Text color="gray.600" fontSize="sm">
              Prestador
            </Text>
            <VisibilityControlDialog
              fields={fields}
              setVisibilityState={setInputsVisibility}
              visibilityState={inputsVisibility}
              title="Ocultar inputs"
            />
          </Flex>
        </Box>
        {data && (
          <Box mt="6">
            <BuildForm
              fields={fields}
              data={{
                ...data,
                pessoaFisica: {
                  ...data?.pessoaFisica,
                  dataNascimento: formatDateToDDMMYYYY(
                    data?.pessoaFisica?.dataNascimento
                  ),
                },
              }}
              shouldUseFormValues={true}
              visibleState={inputsVisibility}
              onSubmit={onSubmitPrestador}
              gridColumns={2}
              gap={4}
            />
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
