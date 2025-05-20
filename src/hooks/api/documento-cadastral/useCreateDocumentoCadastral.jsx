import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosCadastraisService } from "../../../service/documentos-cadastrais";

export const useCreateDocumentoCadastral = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ body }) =>
      await DocumentosCadastraisService.criarDocumentoCadastral({ body }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Documento cadastral criado com sucesso",
        type: "success",
      });
    },

    onError: (error) => {
      return toaster.create({
        title: "Ouve um erro ao criar um documento cadastral",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
