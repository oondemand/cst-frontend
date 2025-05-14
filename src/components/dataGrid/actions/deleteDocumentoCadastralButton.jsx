import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../ui/toaster";
import { queryClient } from "../../../config/react-query";
import { api } from "../../../config/api";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";

export const DeleteDocumentoCadastralAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const { mutateAsync: deleteDocumentoCadastralMutation } = useMutation({
    mutationFn: async () => await api.delete(`/documentos-cadastrais/${id}`),
    onSuccess() {
      queryClient.refetchQueries(["listar-documentos-cadastrais"]);
      toaster.create({
        title: "Documento cadastral excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir documento cadastral",
        type: "error",
      });
    },
  });

  const handleDeleteDocumentoCadastral = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir documento cadastral?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deleteDocumentoCadastralMutation();
    }
  };

  return (
    <Tooltip
      content="Excluir documento cadastral"
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
        onClick={handleDeleteDocumentoCadastral}
      >
        <Trash />
      </IconButton>
    </Tooltip>
  );
};
