import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { PrestadorService } from "../../../service/prestador";

export const useCreatePrestador = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ body }) =>
      await PrestadorService.criarPrestador({ body, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Prestador criado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao criar um prestador",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
