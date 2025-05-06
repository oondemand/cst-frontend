import { Box, Button, Flex } from "@chakra-ui/react";
import { CloseButton } from "../../components/ui/close-button";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../config/react-query";

import { createDynamicFormFields } from "./formFields";
import { BuildForm } from "../../components/buildForm/index";
import { VisibilityControlDialog } from "../../components/vibilityControlDialog";
import { useVisibleInputForm } from "../../hooks/useVisibleInputForms";
import { toaster } from "../../components/ui/toaster";
import { AssistantConfigService } from "../../service/assistant-config";

import {
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
      Configurar novo
    </Button>
  );
};

export const AssistenteConfigDialog = ({
  defaultValues = null,
  trigger,
  label = "Configurar assistente",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "ASSISTENTE_CONFIG",
  });

  const { mutateAsync: updateAssistenteConfigMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await AssistantConfigService.alterarAssistenteConfig({ body, id }),
    onSuccess(data) {
      queryClient.invalidateQueries(["listar-assistente-config"]);
      toaster.create({
        title: "Assistente atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o assistente",
        type: "error",
      });
    },
  });

  const { mutateAsync: createAssistenteConfigMutation } = useMutation({
    mutationFn: async ({ body }) =>
      await AssistantConfigService.adicionarAssistenteConfig({ body }),

    onSuccess(data) {
      queryClient.invalidateQueries(["listar-assistente-config"]);
      toaster.create({
        title: "Assistente criado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao criar um assistente",
        type: "error",
      });
    },
  });

  const onSubmit = async (values) => {
    const body = {
      ...values,
      email: values?.email === "" ? null : values?.email,
    };

    if (!data) {
      return await createAssistenteConfigMutation({ body });
    }

    return await updateAssistenteConfigMutation({ id: data._id, body });
  };

  const fields = useMemo(() => {
    if (data) {
      return createDynamicFormFields().filter(
        (e) => e?.accessorKey !== "senha"
      );
    }

    return createDynamicFormFields().filter((e) => e?.accessorKey !== "status");
  }, [data]);

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
            setOpen(e.open);
            setData(defaultValues);
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
            <DialogHeader mt="-4" py="2" px="4">
              <DialogTitle>
                <Flex gap="4">
                  {label}
                  <VisibilityControlDialog
                    fields={fields}
                    setVisibilityState={setInputsVisibility}
                    visibilityState={inputsVisibility}
                    title="Ocultar campos"
                  />
                </Flex>
              </DialogTitle>
            </DialogHeader>
            <DialogBody
              mt="6"
              overflowY="auto"
              className="dialog-custom-scrollbar"
            >
              <BuildForm
                visibleState={inputsVisibility}
                fields={fields}
                gridColumns={3}
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
