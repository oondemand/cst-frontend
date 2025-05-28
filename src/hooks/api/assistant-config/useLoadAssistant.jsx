import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { AssistantConfigService } from "../../../service/assistant-config";

export const useLoadAssistant = (modulo) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["listar-assistente-config"],
    queryFn: AssistantConfigService.listarAssistenteAtivos,
    staleTime: 1000 * 60 * 5, // opcional: cache por 5min
  });

  const assistant = useMemo(() => {
    if (!data) return null;

    return data?.assistentes?.find(
      (e) => e?.modulo?.includes(modulo) || e?.modulo?.includes("geral")
    )?.assistente;
  }, [data, modulo]);

  return {
    assistant,
    isLoading,
    error,
  };
};
