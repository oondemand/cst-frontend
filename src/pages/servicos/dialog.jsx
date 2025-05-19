import { Box, Button, Flex } from "@chakra-ui/react";
import { CloseButton } from "../../components/ui/close-button";

import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../config/react-query";

import { createDynamicFormFields } from "./formFields";
import { BuildForm } from "../../components/buildForm/index";
import { VisibilityControlDialog } from "../../components/vibilityControlDialog";
import { useVisibleInputForm } from "../../hooks/useVisibleInputForms";
import { toaster } from "../../components/ui/toaster";
import { ServicoService } from "../../service/servico";

import { useIaChat } from "../../hooks/useIaChat";
import { Oondemand } from "../../components/svg/oondemand";
import { AssistantConfigService } from "../../service/assistant-config";

import {
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

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
      Criar um serviço
    </Button>
  );
};

export const ServicosDialog = ({
  defaultValues = null,
  trigger,
  label = "Criar Serviço",
}) => {
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "SERVICOS",
  });

  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);

  const { mutateAsync: updateServicoMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await ServicoService.atualizarServico({ id, body }),
    onSuccess(data) {
      if (open) setData((prev) => data?.servico);

      toaster.create({
        title: "Servico atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o serviço",
        type: "error",
      });
    },
  });

  const { mutateAsync: createServicoMutation } = useMutation({
    mutationFn: async ({ body }) => await ServicoService.criarServico({ body }),
    onSuccess(data) {
      if (open) setData((prev) => data?.servico);
      queryClient.invalidateQueries(["listar-servicos"]);
      toaster.create({
        title: "Serviço criado com sucesso",
        type: "success",
      });
    },

    onError: (error) => {
      if (error?.response?.data?.message === "Serviço existente") {
        return toaster.create({
          title: "Ouve um erro ao criar um serviço",
          description:
            "Serviço para esse prestador com a competência já cadastrada!",
          type: "error",
        });
      }

      toaster.create({
        title: "Ouve um erro ao criar um serviço",
        type: "error",
      });
    },
  });

  const onSubmit = async (values) => {
    const competencia = values?.competencia.split("/");
    const mes = Number(competencia?.[0]) || null;
    const ano = Number(competencia?.[1]) || null;

    const body = {
      ...values,
      prestador: values.prestador.value,
      competencia: {
        mes,
        ano,
      },
    };

    if (!data) return await createServicoMutation({ body });
    return await updateServicoMutation({ id: data._id, body });
  };

  const fields = useMemo(() => createDynamicFormFields(), []);

  const { onOpen } = useIaChat();

  const { data: assistantConfig } = useQuery({
    queryKey: ["listar-assistente-config"],
    queryFn: async () => await AssistantConfigService.listarAssistenteAtivos(),
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: open,
  });

  const loadAssistant = () => {
    let assistant = assistantConfig?.find((e) => {
      return e?.modulo.includes("servico");
    });

    return assistant?.assistente;
  };

  useEffect(() => {
    setData(defaultValues);
  }, [defaultValues]);

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
            queryClient.invalidateQueries(["listar-servicos"]);
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
