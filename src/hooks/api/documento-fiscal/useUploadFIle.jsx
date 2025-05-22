import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../service/documentos-fiscais";

export const useUploadFileToDocumentoFiscal = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ files, id }) =>
      await DocumentosFiscaisService.anexarArquivo({
        id,
        file: files,
      }),
    onSuccess: (data) => {
      onSuccess?.(data);
      toaster.create({
        title: "Arquivo anexado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao anexar arquivo!",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
