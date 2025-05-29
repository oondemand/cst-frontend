import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../ui/toaster";
import { queryClient } from "../../../config/react-query";
import { api } from "../../../config/api";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";
import { UsuarioService } from "../../../service/usuario";
import { ORIGENS } from "../../../constants/origens";
import { useDeleteUsuario } from "../../../hooks/api/usuarios/useDeleteUsuario";

export const DeleteUsuarioAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const deleteUsuario = useDeleteUsuario({
    onSuccess: () => queryClient.invalidateQueries(["listar-usuarios"]),
    origem: ORIGENS.DATAGRID,
  });

  const handleDeleteUsuario = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir usuario?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deleteUsuario.mutateAsync({ id });
    }
  };

  return (
    <Tooltip
      content="Excluir usuario"
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
        onClick={handleDeleteUsuario}
      >
        <Trash />
      </IconButton>
    </Tooltip>
  );
};
