import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useMemo, useEffect, useState } from "react";
import { queryClient } from "../../config/react-query";
import { createDynamicFormFields } from "./formFields";
import { TicketService } from "../../service/ticket";
import {
  FileUploadRoot,
  FileUploadTrigger,
} from "../../components/ui/file-upload";
import { Paperclip, CircleX, Download } from "lucide-react";
import { useConfirmation } from "../../hooks/useConfirmation";
import { useIaChat } from "../../hooks/useIaChat";
import { useUpdateDocumentoCadastral } from "../../hooks/api/documento-cadastral/useUpdateDocumentoCadastral";
import { useCreateDocumentoCadastral } from "../../hooks/api/documento-cadastral/useCreateDocumentoCadastral";
import { useUploadFileToDocumentoCadastral } from "../../hooks/api/documento-cadastral/useUploadFIle";
import { useDeleteFileFromDocumentoCadastral } from "../../hooks/api/documento-cadastral/useDeleteFileFromDocumentoCadastral";
import { useLoadAssistant } from "../../hooks/api/assistant-config/useLoadAssistant";
import { FormDialog } from "../../components/formDialog";
import {
  DefaultTrigger,
  IconTrigger,
} from "../../components/formDialog/form-trigger";
import { ORIGENS } from "../../constants/origens";

export const DocumentoCadastralDialog = ({
  defaultValues = null,
  label = "Criar documento cadastral",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const { requestConfirmation } = useConfirmation();
  const { onOpen } = useIaChat();
  const { assistant } = useLoadAssistant("prestador");
  const fields = useMemo(() => createDynamicFormFields(), []);

  const updateDocumentoCadastral = useUpdateDocumentoCadastral({
    origem: ORIGENS.FORM,
    onSuccess: (data) => open && setData(() => data?.documentoCadastral),
  });

  const createDocumentoCadastral = useCreateDocumentoCadastral({
    origem: ORIGENS.FORM,
    onSuccess: (data) => open && setData(() => data?.documentoCadastral),
  });

  const uploadFile = useUploadFileToDocumentoCadastral({
    onSuccess: ({ data }) => {
      const { nomeOriginal, mimetype, size, tipo, _id } = data.arquivo;
      setData((prev) => ({
        ...prev,
        arquivo: { nomeOriginal, mimetype, size, tipo, _id },
      }));
    },
  });

  const deleteFileFromDocumentoCadastral = useDeleteFileFromDocumentoCadastral({
    onSuccess: () => setData((prev) => ({ ...prev, arquivo: null })),
  });

  const onSubmit = async (values) => {
    const competencia = values?.competencia?.split("/");
    const mes = Number(competencia?.[0]) || null;
    const ano = Number(competencia?.[1]) || null;

    const body = {
      ...values,
      prestador: values.prestador.value,

      ...(values?.competencia !== ""
        ? {
            competencia: {
              mes,
              ano,
            },
          }
        : { competencia: null }),
    };

    if (!data) return await createDocumentoCadastral.mutateAsync({ body });
    return await updateDocumentoCadastral.mutateAsync({ id: data._id, body });
  };

  const handleDownloadFile = async ({ id }) => {
    try {
      const { data } = await TicketService.getFile({ id });

      if (data) {
        const byteArray = new Uint8Array(data?.buffer?.data);
        const blob = new Blob([byteArray], { type: data?.mimetype });
        saveAs(blob, data?.nomeOriginal);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleRemoveFile = async ({ id }) => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que excluir arquivo?",
      description: "Essa operação não pode ser desfeita!",
    });

    if (action === "confirmed") {
      await deleteFileFromDocumentoCadastral.mutateAsync({ id, data });
    }
  };

  useEffect(() => {
    setData(defaultValues);
  }, [defaultValues]);

  return (
    <Box>
      <Box onClick={() => setOpen(true)} asChild>
        {defaultValues ? (
          <IconTrigger />
        ) : (
          <DefaultTrigger title="Criar documento cadastral" />
        )}
      </Box>
      <FormDialog
        data={data}
        fields={fields}
        label={label}
        onOpenAssistantDialog={() => onOpen(data, assistant)}
        onSubmit={onSubmit}
        onOpenChange={() => {
          queryClient.invalidateQueries(["listar-documentos-cadastrais"]);
          setOpen(false);
          setData(defaultValues);
        }}
        open={open}
        key="DOCUMENTOS_CADASTRAIS"
      >
        {data && !data?.arquivo && (
          <Box mt="8">
            <FileUploadRoot
              accept={["application/pdf"]}
              onFileAccept={async (e) => {
                await uploadFile.mutateAsync({
                  files: e.files[0],
                  id: data?._id,
                });
              }}
            >
              <FileUploadTrigger>
                <Button
                  disabled={uploadFile.isPending}
                  mt="4"
                  size="2xs"
                  variant="surface"
                  color="gray.600"
                >
                  Anexar arquivo
                </Button>
              </FileUploadTrigger>
            </FileUploadRoot>
          </Box>
        )}
        {data && data?.arquivo && (
          <Box mt="8">
            <Text fontWeight="semibold" color="gray.700">
              Arquivo
            </Text>
            <Flex mt="4" gap="3" alignItems="center">
              <Paperclip color="purple" size={16} />
              <Text color="gray.600">
                {data?.arquivo?.nomeOriginal}{" "}
                {(data?.arquivo?.size / 1024).toFixed(1)} KB
              </Text>
              <Flex gap="2">
                <Button
                  onClick={async () =>
                    await handleDownloadFile({ id: data?.arquivo?._id })
                  }
                  color="gray.600"
                  cursor="pointer"
                  unstyled
                >
                  <Download size={16} />
                </Button>
                <Button
                  onClick={async () =>
                    await handleRemoveFile({
                      id: data?.arquivo?._id,
                    })
                  }
                  color="red"
                  cursor="pointer"
                  unstyled
                >
                  <CircleX size={16} />
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
      </FormDialog>
    </Box>
  );
};
