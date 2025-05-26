import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../ui/toaster";
import { queryClient } from "../../../config/react-query";
import { api } from "../../../config/api";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";
import { useDeletePrestador } from "../../../hooks/api/prestador/useDeletePrestador";
import { ORIGENS } from "../../../constants/origens";

export const DeletePrestadorAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const deletePrestador = useDeletePrestador({
    onSuccess: () => queryClient.invalidateQueries(["listar-prestadores"]),
    origem: ORIGENS.DATAGRID,
  });

  const handleDeletePrestador = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir prestador?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deletePrestador.mutateAsync({ id });
    }
  };

  return (
    <Tooltip
      content="Excluir prestador"
      positioning={{ placement: "top" }}
      openDelay={700}
      closeDelay={50}
      contentProps={{
        css: {
          "--tooltip-bg": "white",
          color: "gray.600",
        },
      }}
    >
      <IconButton
        variant="surface"
        colorPalette="red"
        size="2xs"
        onClick={handleDeletePrestador}
      >
        <Trash />
      </IconButton>
    </Tooltip>
  );
};
