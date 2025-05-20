import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { PrestadorService } from "../../../service/prestador";

export const useUpdatePrestador = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ body, id }) =>
      await PrestadorService.atualizarPrestador({
        body,
        id,
      }),
    onSuccess(data) {
      onSuccess?.(data?.prestador);
      toaster.create({
        title: "Prestador atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      toaster.create({
        title: "Ouve um erro ao atualizar o prestador",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
