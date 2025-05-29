import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { AssistantConfigService } from "../../../service/assistant-config";

export const useDeleteAssistantConfig = ({ origem, onSuccess }) =>
  useMutation({
    mutationFn: async ({ id }) =>
      await AssistantConfigService.deleteAssistantConfig({ id, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Assistente excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir assistente",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
