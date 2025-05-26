import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { queryClient } from "../../../config/react-query";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";
import { useDeleteServico } from "../../../hooks/api/servico/useDeleteServico";
import { ORIGENS } from "../../../constants/origens";

export const DeleteServicoAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const deleteServico = useDeleteServico({
    onSuccess: () => queryClient.refetchQueries(["listar-servicos"]),
    origem: ORIGENS.DATAGRID,
  });

  const handleDeleteServico = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir serviço?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deleteServico.mutateAsync({ id });
    }
  };

  return (
    <Tooltip
      content="Excluir servico"
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
        onClick={handleDeleteServico}
      >
        <Trash />
      </IconButton>
    </Tooltip>
  );
};
