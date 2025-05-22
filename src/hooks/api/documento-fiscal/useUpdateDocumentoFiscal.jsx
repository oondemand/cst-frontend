import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../service/documentos-fiscais";

export const useUpdateDocumentoFiscal = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ id, body }) =>
      await DocumentosFiscaisService.atualizarDocumentoFiscal({
        id,
        body,
        origem,
      }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Documento fiscal atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar documento fiscal",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
