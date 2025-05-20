import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { AssistantConfigService } from "../../service/assistant-config";

export const useLoadAssistant = (modulo) => {
  const {
    data: assistantConfigs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listar-assistente-config"],
    queryFn: AssistantConfigService.listarAssistenteAtivos,
    staleTime: 1000 * 60 * 5, // opcional: cache por 5min
  });

  const assistant = useMemo(() => {
    if (!assistantConfigs) return null;

    return assistantConfigs.find(
      (e) => e?.modulo?.includes(modulo) || e?.modulo?.includes("geral")
    )?.assistente;
  }, [assistantConfigs, modulo]);

  return {
    assistant,
    isLoading,
    error,
  };
};
