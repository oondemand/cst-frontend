import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../service/documentos-fiscais";

export const useReprovarDocumentoFiscal = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ id, body }) =>
      await DocumentosFiscaisService.reprovarDocumentoFiscal({
        id,
        body,
        origem,
      }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Documento fiscal reprovado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao reprovar documento fiscal",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
