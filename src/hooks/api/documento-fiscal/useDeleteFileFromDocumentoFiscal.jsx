import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../service/documentos-fiscais";

export const useDeleteFileFromDocumentoFiscal = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ id, data }) =>
      await DocumentosFiscaisService.deleteFile({
        documentoFiscalId: data._id,
        id,
      }),
    onSuccess: (data) => {
      onSuccess?.(data);
      toaster.create({
        title: "Arquivo deletado com sucesso!",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Erro ao remover arquivo",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
