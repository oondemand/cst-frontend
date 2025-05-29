import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../ui/toaster";
import { queryClient } from "../../../config/react-query";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";
import { DocumentosCadastraisService } from "../../../service/documentos-cadastrais";
import { ORIGENS } from "../../../constants/origens";
import { useDeleteDocumentoCadastral } from "../../../hooks/api/documento-cadastral/useDeleteDocumentoCadastral";

export const DeleteDocumentoCadastralAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const deleteDocumentoCadastral = useDeleteDocumentoCadastral({
    origem: ORIGENS.DATAGRID,
    onSuccess: () =>
      queryClient.refetchQueries(["listar-documentos-cadastrais"]),
  });

  const handleDeleteDocumentoCadastral = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir documento cadastral?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deleteDocumentoCadastral.mutateAsync({ id });
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
