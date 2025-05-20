import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosCadastraisService } from "../../../service/documentos-cadastrais";

export const useUpdateDocumentoCadastral = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ id, body }) =>
      await DocumentosCadastraisService.atualizarDocumentoCadastral({
        id,
        body,
      }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Documento cadastral atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar documento cadastral",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
