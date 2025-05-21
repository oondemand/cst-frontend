import { Box, Text, Button, Flex } from "@chakra-ui/react";

import { Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toaster } from "../../../../components/ui/toaster";
import { formatDateToDDMMYYYY } from "../../../../utils/formatting";
import { queryClient } from "../../../../config/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VisibilityControlDialog } from "../../../../components/vibilityControlDialog";
import { createDynamicFormFields } from "../../../prestadores/formFields";
import { useMemo } from "react";
import { useVisibleInputForm } from "../../../../hooks/useVisibleInputForms";
import { PrestadorService } from "../../../../service/prestador";
import { BuildForm } from "../../../../components/buildForm";
import { DocumentosCadastraisService } from "../../../../service/documentos-cadastrais";
import { useUpdatePrestador } from "../../../../hooks/api/prestador/useUpdatePrestador";
import { ORIGENS } from "../../../../constants/origens";

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

  const updatePrestador = useUpdatePrestador({
    origem: ORIGENS.FORM,
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

  const { handleSubmit } = useForm({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      servicos: [],
    },
  });

  const handleAprovarDocumento = async () => {
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

    return await updatePrestador.mutateAsync({ id: prestadorId, body });
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
