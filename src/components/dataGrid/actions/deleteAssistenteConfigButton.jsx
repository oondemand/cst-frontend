import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../ui/toaster";
import { queryClient } from "../../../config/react-query";
import { api } from "../../../config/api";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";

export const DeleteAssistenteConfigAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const { mutateAsync: deleteAssistenteConfigMutation } = useMutation({
    mutationFn: async () => await api.delete(`assistentes/${id}`),
    onSuccess() {
      queryClient.invalidateQueries(["listar-assistente-config"]);
      toaster.create({
        title: "Assistente excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir assistente",
        type: "error",
      });
    },
  });

  const handleDeleteAssistenteConfig = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir assistente?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deleteAssistenteConfigMutation();
    }
  };

  return (
    <Tooltip
      content="Excluir assistente"
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
        onClick={handleDeleteAssistenteConfig}
      >
        <Trash />
      </IconButton>
    </Tooltip>
  );
};
