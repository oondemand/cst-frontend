import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosCadastraisService } from "../../../service/documentos-cadastrais";

export const useUploadFileToDocumentoCadastral = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ files, id }) =>
      await DocumentosCadastraisService.anexarArquivo({
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
