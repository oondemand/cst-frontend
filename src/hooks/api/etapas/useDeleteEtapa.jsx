import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { EtapaService } from "../../../service/etapa";

export const useDeleteEtapa = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ id }) =>
      await EtapaService.deletarEtapa({
        id,
        origem,
      }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Etapa excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir etapa",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
