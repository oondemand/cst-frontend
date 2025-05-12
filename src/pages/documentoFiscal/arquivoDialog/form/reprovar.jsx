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

const reprovacaoSchema = z.object({
  motivo: z.object(
    { value: z.string(), label: z.string() },
    { required_error: "Selecione um motivo" }
  ),
  observacao: z.string().optional(),
  observacaoPrestador: z.string().optional(),
});

const MOTIVOS_REPROVACAO = [
  { value: "documento_invalido", label: "Documento inválido" },
  { value: "servico_nao_prestado", label: "Serviço não prestado" },
  { value: "valor_incorreto", label: "Valor incorreto" },
  { value: "outros", label: "Outros" },
];

export const ReprovarForm = ({}) => {
  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reprovacaoSchema),
    defaultValues: {
      motivo: null,
      observacao: "",
      observacaoPrestador: "",
    },
  });

  console.log("errors", errors);

  const handleReprovarDocumento = async (data) => {
    console.log("on fire", data);
    // await onReprovarDocumento({
    //   body: {
    //     documentoFiscalId,
    //     motivo: data.motivo.value,
    //     observacao: data.observacao,
    //     observacaoPrestador: data.observacaoPrestador,
    //   },
    // });
  };

  return (
    <Box>
      <Flex gap="2">
        <Box w="full">
          <form onSubmit={handleSubmit(handleReprovarDocumento)}>
            <Box>
              {/* <Text>teste</Text> */}

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
