import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosCadastraisService } from "../../../service/documentos-cadastrais";

export const useDeleteDocumentoCadastral = ({ origem, onSuccess }) =>
  useMutation({
    mutationFn: async ({ id }) =>
      await DocumentosCadastraisService.deletarDocumentoCadastral({
        id,
        origem,
      }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Documento cadastral excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir documento cadastral",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
