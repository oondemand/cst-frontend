import {
  Box,
  Text,
  Button,
  Flex,
  Textarea,
  createListCollection,
} from "@chakra-ui/react";

import { CircleX } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toaster } from "../../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../../service/documentos-fiscais";
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
import { useUpdateDocumentoFiscal } from "../../../../hooks/api/documento-fiscal/useUpdateDocumentoFiscal";
import { ORIGENS } from "../../../../constants/origens";
import { useReprovarDocumentoFiscal } from "../../../../hooks/api/documento-fiscal/useReprovarDocumentoFiscal";

const reprovacaoSchema = z.object({
  motivoRecusa: z.string({ message: "Selecione um motivo." }),
  observacao: z.string().optional(),
  observacaoPrestador: z.string().optional(),
});

export const ReprovarForm = ({ documentoFiscalId }) => {
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

  const reprovarDocumento = useReprovarDocumentoFiscal({
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["listar-documentos-fiscais"],
      }),
    origem: ORIGENS.APROVACAO_DOCUMENTO_FISCAL,
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

  const handleReprovarDocumento = async ({
    motivoRecusa,
    observacao,
    observacaoPrestador,
  }) => {
    await reprovarDocumento.mutateAsync({
      body: {
        motivoRecusa,
        observacaoInterna: observacao,
        observacaoPrestador,
        statusValidacao: "recusado",
      },
      id: documentoFiscalId,
    });
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
