import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosCadastraisService } from "../../../service/documentos-cadastrais";

export const useDeleteFileFromDocumentoCadastral = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ id, data }) =>
      await DocumentosCadastraisService.deleteFile({
        documentoCadastralId: data._id,
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
