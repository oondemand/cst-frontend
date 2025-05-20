import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { EtapaService } from "../../../service/etapa";

export const useCreateEtapa = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ body }) => await EtapaService.adicionarEtapa({ body }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Etapa criado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao criar um etapa",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
