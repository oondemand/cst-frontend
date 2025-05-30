import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Repeat2 } from "lucide-react";

import { toaster } from "../../../../components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { PlanejamentoService } from "../../../../service/planejamento";
import { queryClient } from "../../../../config/react-query";

export const SincronizacaoTab = () => {
  const { mutateAsync: syncEsteiraMutation, isPending } = useMutation({
    mutationFn: PlanejamentoService.sincronizarEsteira,
    onSuccess: () => {
      queryClient.invalidateQueries(["planejamento-mensal-listar-servicos"]);
      toaster.create({
        title: "A esteira foi sincronizada com sucesso!",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro ao realizar operação!",
        type: "error",
      });
    },
  });

  const handleSync = async () => {
    await syncEsteiraMutation();
  };

  return (
    <Flex
      alignItems="end"
      p="6"
      bg="white"
      minW="970px"
      rounded="lg"
      justifyContent="space-between"
      data-state="open"
      _open={{
        animation: "fade-in 300ms ease-out",
      }}
    >
      <Box w="56">
        <Text fontWeight="bold" fontSize="lg" color="gray.700">
          Sincronização
        </Text>
        <Text fontSize="sm" color="gray.500">
          Agora você pode sincronizar seu planejamento com a esteira para seguir
          com o processo
        </Text>
      </Box>

      <Button disabled={isPending} onClick={handleSync} colorPalette="green">
        <Repeat2 /> Sincronizar esteira
      </Button>
    </Flex>
  );
};
