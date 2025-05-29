import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../ui/toaster";
import { queryClient } from "../../../config/react-query";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";
import { ORIGENS } from "../../../constants/origens";
import { useDeleteEtapa } from "../../../hooks/api/etapas/useDeleteEtapa";

export const DeleteEtapaAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const deleteEtapa = useDeleteEtapa({
    onSuccess: () => queryClient.invalidateQueries(["listar-etapas"]),
    origem: ORIGENS.DATAGRID,
  });

  const handleDeleteEtapa = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir etapa?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deleteEtapa.mutateAsync({ id });
    }
  };

  return (
    <Tooltip
      content="Excluir etapa"
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
        onClick={handleDeleteEtapa}
      >
        <Trash />
      </IconButton>
    </Tooltip>
  );
};
