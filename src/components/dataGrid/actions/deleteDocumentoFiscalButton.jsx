import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../ui/toaster";
import { queryClient } from "../../../config/react-query";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";
import { DocumentosFiscaisService } from "../../../service/documentos-fiscais";
import { ORIGENS } from "../../../constants/origens";
import { useDeleteDocumentoFiscal } from "../../../hooks/api/documento-fiscal/useDeleteDocumentoFiscal";

export const DeleteDocumentoFiscalAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const deleteDocumentoFiscal = useDeleteDocumentoFiscal({
    onSuccess: () => queryClient.refetchQueries(["listar-documentos-fiscais"]),
    origem: ORIGENS.DATAGRID,
  });

  const handleDeleteDocumentoFiscal = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir documento fiscal?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deleteDocumentoFiscal.mutateAsync({ id });
    }
  };

  return (
    <Tooltip
      content="Excluir documento fiscal"
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
        onClick={handleDeleteDocumentoFiscal}
      >
        <Trash />
      </IconButton>
    </Tooltip>
  );
};
