import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../service/documentos-fiscais";

export const useCreateDocumentoFiscal = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ body }) =>
      await DocumentosFiscaisService.criarDocumentoFiscal({ body, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Documento fiscal criado com sucesso",
        type: "success",
      });
    },

    onError: (error) => {
      return toaster.create({
        title: "Ouve um erro ao criar um documento fiscal",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
