import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { AssistantConfigService } from "../../../service/assistant-config";

export const useUpdateAssistantConfig = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ id, body }) =>
      await AssistantConfigService.alterarAssistenteConfig({ body, id }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Assistente atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o assistente",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
