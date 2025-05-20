import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { EtapaService } from "../../../service/etapa";

export const useUpdateEtapa = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ id, body }) =>
      await EtapaService.alterarEtapa({ body, id }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Etapa atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o etapa",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
