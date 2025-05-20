import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosCadastraisService } from "../../../service/documentos-cadastrais";

export const useUploadFileToDocumentoCadastral = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ files }) =>
      await DocumentosCadastraisService.anexarArquivo({
        id: data?._id,
        file: files,
      }),
    onSuccess: ({ data }) => {
      onSuccess?.(data);
      toaster.create({
        title: "Arquivo anexado com sucesso",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro ao anexar arquivo!",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
