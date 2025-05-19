import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { CloseButton } from "../../components/ui/close-button";

import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../config/react-query";

import { createDynamicFormFields } from "./formFields";
import { BuildForm } from "../../components/buildForm/index";
import { VisibilityControlDialog } from "../../components/vibilityControlDialog";
import { useVisibleInputForm } from "../../hooks/useVisibleInputForms";
import { toaster } from "../../components/ui/toaster";
import { DocumentosCadastraisService } from "../../service/documentos-cadastrais";
import { TicketService } from "../../service/ticket";

import {
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import {
  FileUploadRoot,
  FileUploadTrigger,
} from "../../components/ui/file-upload";
import { Paperclip, CircleX, Download } from "lucide-react";
import { useConfirmation } from "../../hooks/useConfirmation";

import { useIaChat } from "../../hooks/useIaChat";
import { AssistantConfigService } from "../../service/assistant-config";
import { Oondemand } from "../../components/svg/oondemand";

const DefaultTrigger = (props) => {
  return (
    <Button
      {...props}
      size="sm"
      variant="subtle"
      fontWeight="semibold"
      color="brand.500"
      _hover={{ backgroundColor: "gray.50" }}
    >
      Criar documento cadastral
    </Button>
  );
};

export const DocumentoCadastralDialog = ({
  defaultValues = null,
  trigger,
  label = "Criar documento cadastral",
}) => {
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "DOCUMENTOS_CADASTRAIS",
  });

  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const { requestConfirmation } = useConfirmation();

  const { mutateAsync: updateDocumentoCadastralMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await DocumentosCadastraisService.atualizarDocumentoCadastral({
        id,
        body,
      }),
    onSuccess(data) {
      if (open) setData((prev) => data?.documentoCadastral);

      toaster.create({
        title: "Documento cadastral atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar documento cadastral",
        description: error?.response?.data?.message ?? "",
        type: "error",
      });
    },
  });

  const { mutateAsync: createDocumentoCadastralMutation } = useMutation({
    mutationFn: async ({ body }) =>
      await DocumentosCadastraisService.criarDocumentoCadastral({ body }),
    onSuccess(data) {
      if (open) setData((prev) => data?.documentoCadastral);
      queryClient.invalidateQueries(["listar-documentos-cadastrais"]);
      toaster.create({
        title: "Documento cadastral criado com sucesso",
        type: "success",
      });
    },

    onError: (error) => {
      if (error?.response?.data?.message === "Documento cadastral existente") {
        return toaster.create({
          title: "Ouve um erro ao criar um documento cadastral",
          description:
            "Documento cadastral para esse prestador com a competência já cadastrada!",
          type: "error",
        });
      }

      toaster.create({
        title: "Ouve um erro ao criar um documento cadastral",
        type: "error",
      });
    },
  });

  const { mutateAsync: uploadFileMutation, isPending } = useMutation({
    mutationFn: async ({ files }) =>
      await DocumentosCadastraisService.anexarArquivo({
        id: data?._id,
        file: files[0],
      }),
    onSuccess: ({ data }) => {
      const { nomeOriginal, mimetype, size, tipo, _id } = data;
      setData((prev) => ({
        ...prev,
        arquivo: { nomeOriginal, mimetype, size, tipo, _id },
      }));
      toaster.create({
        title: "Arquivo anexado com sucesso",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro ao anexar arquivo!",
        type: "error",
      });
    },
  });

  const { mutateAsync: deleteFileFromDocumentoCadastralMutation } = useMutation(
    {
      mutationFn: async ({ id }) =>
        await DocumentosCadastraisService.deleteFile({
          documentoCadastralId: data._id,
          id,
        }),
      onSuccess: () => {
        setData((prev) => ({ ...prev, arquivo: null }));
        toaster.create({
          title: "Arquivo deletado com sucesso!",
          type: "success",
        });
      },
      onError: (error) => {
        toaster.create({
          title: "Erro ao remover arquivo",
          type: "error",
        });
      },
    }
  );

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

    if (!data) return await createDocumentoCadastralMutation({ body });
    return await updateDocumentoCadastralMutation({ id: data._id, body });
  };

  const fields = useMemo(() => createDynamicFormFields(), []);

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
      await deleteFileFromDocumentoCadastralMutation({ id });
    }
  };

  useEffect(() => {
    setData(defaultValues);
  }, [defaultValues]);

  const { onOpen } = useIaChat();

  const { data: assistantConfig } = useQuery({
    queryKey: ["listar-assistente-config"],
    queryFn: async () => await AssistantConfigService.listarAssistenteAtivos(),
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: open,
  });

  const loadAssistant = () => {
    let assistant = assistantConfig?.find((e) => {
      return e?.modulo.includes("documento-cadastral");
    });

    return assistant?.assistente;
  };

  return (
    <Box>
      <Box onClick={() => setOpen(true)} asChild>
        {trigger ? trigger : <DefaultTrigger />}
      </Box>
      {open && (
        <DialogRoot
          size="cover"
          open={open}
          onOpenChange={(e) => {
            queryClient.invalidateQueries(["listar-documentos-cadastrais"]);
            setData((prev) => defaultValues);
            setOpen(e.open);
          }}
        >
          <DialogContent
            overflow="hidden"
            w="1250px"
            h="80%"
            pt="6"
            px="2"
            rounded="lg"
          >
            <DialogHeader
              mt="-4"
              py="3"
              px="4"
              borderBottom="1px solid"
              borderColor="gray.200"
              mb="6"
            >
              <Flex gap="4" alignItems="center">
                <Box
                  cursor="pointer"
                  variant="unstyled"
                  onClick={() => onOpen(data, loadAssistant())}
                >
                  <Oondemand />
                </Box>
                <DialogTitle>{label}</DialogTitle>
                <VisibilityControlDialog
                  fields={fields}
                  setVisibilityState={setInputsVisibility}
                  visibilityState={inputsVisibility}
                  title="Ocultar campos"
                />
              </Flex>
            </DialogHeader>
            <DialogBody overflowY="auto" className="dialog-custom-scrollbar">
              <BuildForm
                visibleState={inputsVisibility}
                fields={fields}
                gridColumns={4}
                gap={6}
                data={data}
                onSubmit={onSubmit}
              />
              {data && !data?.arquivo && (
                <Box mt="8">
                  <FileUploadRoot
                    accept={["application/pdf"]}
                    onFileAccept={async (e) => {
                      await uploadFileMutation({ files: e.files });
                    }}
                  >
                    <FileUploadTrigger>
                      <Button
                        disabled={isPending}
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
            </DialogBody>
            <DialogCloseTrigger asChild>
              <CloseButton size="sm" />
            </DialogCloseTrigger>
          </DialogContent>
        </DialogRoot>
      )}
    </Box>
  );
};
