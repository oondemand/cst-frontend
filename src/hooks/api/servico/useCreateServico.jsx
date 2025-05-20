import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { ServicoService } from "../../../service/servico";

export const useCreateServico = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ body }) => await ServicoService.criarServico({ body }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Serviço criado com sucesso",
        type: "success",
      });
    },

    onError: (error) => {
      return toaster.create({
        title: "Ouve um erro ao criar um serviço",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
