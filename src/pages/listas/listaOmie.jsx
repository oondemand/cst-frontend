import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../config/api";
import { FolderSync, RotateCcw, RotateCw } from "lucide-react";
import { Tooltip } from "../../components/ui/tooltip";
import { toaster } from "../../components/ui/toaster";
import { ListaOmieService } from "../../service/lista-omie";

export const ListaOmieComponent = () => {
  const { data } = useQuery({
    queryKey: ["listas-omie"],
    queryFn: ListaOmieService.getListas,
  });

  const { mutateAsync: onSyncOmieLista, isPending } = useMutation({
    mutationFn: async ({ id }) => ListaOmieService.update({ id }),
    onSuccess: () => {
      toaster.create({
        title: "Lista sincronizada com sucesso!",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro inesperado ao sincronizar lista.",
        description: "Tente novamente mais tarde.",
        type: "error",
      });
    },
  });

  return (
    <Box p="4">
      {data?.map((item) => {
        return (
          <Flex key={item._id} justifyContent="space-between" mb="2">
            <Text fontSize="sm" color="gray.600">
              {item?.call} - {item?.url}
            </Text>

            <Tooltip
              content="Sincronizar lista com omie"
              positioning={{ placement: "top" }}
              openDelay={500}
              closeDelay={50}
              contentProps={{
                css: {
                  "--tooltip-bg": "white",
                  color: "gray.600",
                },
              }}
            >
              <IconButton
                disabled={isPending}
                onClick={async () => {
                  await onSyncOmieLista({
                    id: item._id,
                  });
                }}
                variant="subtle"
                size="2xs"
              >
                <RotateCw />
              </IconButton>
            </Tooltip>
          </Flex>
        );
      })}
    </Box>
  );
};
