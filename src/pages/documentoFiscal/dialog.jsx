import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
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
import { useLoadAssistant } from "../../hooks/api/useLoadAssistant";
import { useUpdateDocumentoFiscal } from "../../hooks/api/documento-fiscal/useUpdateDocumentoFiscal";
import { useCreateDocumentoFiscal } from "../../hooks/api/documento-fiscal/useCreateDocumentoFiscal";
import { useUploadFileToDocumentoFiscal } from "../../hooks/api/documento-fiscal/useUploadFIle";
import { useDeleteFileFromDocumentoFiscal } from "../../hooks/api/documento-fiscal/useDeleteFileFromDocumentoFiscal";
import { FormDialog } from "../../components/formDialog";
import {
  DefaultTrigger,
  IconTrigger,
} from "../../components/formDialog/form-trigger";
import { ORIGENS } from "../../constants/origens";

export const DocumentosFiscaisDialog = ({
  defaultValues = null,
  label = "Criar documento fiscal",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const { requestConfirmation } = useConfirmation();
  const fields = useMemo(() => createDynamicFormFields(), []);
  const { onOpen } = useIaChat();
  const { assistant } = useLoadAssistant("documento-fiscal");

  const updateDocumentoFiscal = useUpdateDocumentoFiscal({
    onSuccess: (data) => open && setData(() => data?.documentoFiscal),
    origem: ORIGENS.FORM,
  });

  const createDocumentoFiscal = useCreateDocumentoFiscal({
    origem: ORIGENS.FORM,
    onSuccess: (data) => open && setData(() => data?.documentoFiscal),
  });

  const uploadFile = useUploadFileToDocumentoFiscal({
    onSuccess: ({ data }) => {
      const { nomeOriginal, mimetype, size, tipo, _id } = data.arquivo;
      setData((prev) => ({
        ...prev,
        arquivo: { nomeOriginal, mimetype, size, tipo, _id },
      }));
    },
  });

  const deleteFileFromDocumentoFiscal = useDeleteFileFromDocumentoFiscal({
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

    if (!data) return await createDocumentoFiscal.mutateAsync({ body });
    return await updateDocumentoFiscal.mutateAsync({ id: data._id, body });
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
      await deleteFileFromDocumentoFiscal.mutateAsync({ id, data });
    }
  };

  useEffect(() => {
    defaultValues && setData(defaultValues);
  }, [defaultValues]);

  return (
    <Box>
      <Box onClick={() => setOpen(true)} asChild>
        {defaultValues ? (
          <IconTrigger />
        ) : (
          <DefaultTrigger title="Criar documento fiscal" />
        )}
      </Box>
      <FormDialog
        data={data}
        fields={fields}
        label={label}
        onOpenAssistantDialog={() => onOpen(data, assistant)}
        onSubmit={onSubmit}
        onOpenChange={() => {
          queryClient.invalidateQueries(["listar-prestadores"]);
          setOpen(false);
          setData();
        }}
        open={open}
        key="DOCUMENTOS_FISCAIS"
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
