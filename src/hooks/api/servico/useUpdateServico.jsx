import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { ServicoService } from "../../../service/servico";

export const useUpdateServico = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ id, body }) =>
      await ServicoService.atualizarServico({ id, body }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Servico atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o serviço",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
