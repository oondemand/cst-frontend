import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../service/documentos-fiscais";

export const useDeleteDocumentoFiscal = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ id }) =>
      await DocumentosFiscaisService.deletarDocumentoFiscal({
        id,
        origem,
      }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Documento fiscal excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir documento fiscal",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
