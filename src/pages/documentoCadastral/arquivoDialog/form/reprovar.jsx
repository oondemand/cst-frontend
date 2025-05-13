import {
  Box,
  Text,
  Grid,
  GridItem,
  Button,
  Table,
  Flex,
  Checkbox,
  Textarea,
  createListCollection,
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
import { DocumentosCadastraisService } from "../../../../service/documentos-cadastrais";
import { queryClient } from "../../../../config/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ListaOmieService } from "../../../../service/lista-omie";

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../../../components/ui/select";

const reprovacaoSchema = z.object({
  motivoRecusa: z.string({ message: "Selecione um motivo." }),
  observacao: z.string().optional(),
  observacaoPrestador: z.string().optional(),
});

export const ReprovarForm = ({ documentoCadastralId }) => {
  const { data } = useQuery({
    queryKey: ["list-motivo-recusa"],
    queryFn: async () =>
      ListaOmieService.getListByCode({ cod: "motivo-recusa" }),
  });

  const motivoRecusaList = createListCollection({
    items:
      data?.valores?.map((item) => ({
        value: item?.valor,
        label: item?.valor,
      })) ?? [],
  });

  const { mutateAsync: reprovarDocumento } = useMutation({
    mutationFn: async ({ motivoRecusa, observacao, observacaoPrestador }) =>
      await DocumentosCadastraisService.atualizarDocumentoCadastral({
        body: {
          motivoRecusa,
          observacaoInterna: observacao,
          observacaoPrestador,
          statusValidacao: "recusado",
        },
        id: documentoCadastralId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar-documentos-cadastrais"],
      });
      toaster.create({
        title: "Documento cadastral reprovado com sucesso!",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro ao reprovar o documento cadastral!",
        type: "error",
      });
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reprovacaoSchema),
    defaultValues: {
      observacao: "",
      motivoRecusa: null,
      observacaoPrestador: "",
    },
  });

  const handleReprovarDocumento = async (data) => {
    await reprovarDocumento(data);
  };

  return (
    <Box>
      <Flex gap="2">
        <Box w="full">
          <form onSubmit={handleSubmit(handleReprovarDocumento)}>
            <Box>
              <Box>
                <Controller
                  control={control}
                  name="motivoRecusa"
                  render={({ field }) => (
                    <SelectRoot
                      size="xs"
                      value={[field.value]}
                      onValueChange={({ value }) => field.onChange(value[0])}
                      collection={motivoRecusaList}
                    >
                      <SelectLabel mb="-1" fontWeight="normal" color="gray.500">
                        Mostrar
                      </SelectLabel>
                      <SelectTrigger>
                        <SelectValueText placeholder="Selecionar motivo..." />
                      </SelectTrigger>
                      <SelectContent zIndex={9999}>
                        {motivoRecusaList.items.map((item) => (
                          <SelectItem item={item} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
                {errors.motivoRecusa && (
                  <Text fontSize="xs" color="red.500">
                    {errors.motivoRecusa.message}
                  </Text>
                )}
              </Box>
              <Box p="2" />
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Observação
                </Text>
                <Textarea
                  {...register("observacao")}
                  placeholder="Digite a observação"
                  size="sm"
                  resize="none"
                  rows={3}
                />
              </Box>
              <Box p="2" />
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Observação para o prestador
                </Text>
                <Textarea
                  {...register("observacaoPrestador")}
                  placeholder="Digite a observação para o prestador"
                  size="sm"
                  resize="none"
                  rows={3}
                />
              </Box>
              <Box p="2" />
              <Button
                type="submit"
                variant="surface"
                shadow="xs"
                colorPalette="red"
                size="xs"
              >
                <CircleX /> Reprovar
              </Button>
            </Box>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};
