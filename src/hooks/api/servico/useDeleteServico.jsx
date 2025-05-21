import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { ServicoService } from "../../../service/servico";

export const useDeleteServico = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ id }) => ServicoService.deletarServico({ id, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Serviço excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir serviço",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
