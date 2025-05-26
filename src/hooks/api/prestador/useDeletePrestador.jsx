import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { PrestadorService } from "../../../service/prestador";

export const useDeletePrestador = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ id }) =>
      await PrestadorService.excluirPrestador({ id, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Prestador excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir prestador",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
