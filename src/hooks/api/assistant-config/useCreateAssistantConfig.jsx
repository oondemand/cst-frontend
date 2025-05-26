import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { AssistantConfigService } from "../../../service/assistant-config";

export const useCreateAssistantConfig = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ body }) =>
      await AssistantConfigService.adicionarAssistenteConfig({ body, origem }),

    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Assistente criado com sucesso",
        type: "success",
      });
    },

    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao criar um assistente",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
