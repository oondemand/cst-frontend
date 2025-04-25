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
import { EtapaService } from "../../service/etapa";

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
      Criar um etapa
    </Button>
  );
};

export const EtapasDialog = ({
  defaultValues = null,
  trigger,
  label = "Criar etapa",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "ETAPAS",
  });

  const { mutateAsync: updateEtapaMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await EtapaService.alterarEtapa({ body, id }),
    onSuccess(data) {
      queryClient.invalidateQueries(["listar-etapas"]);
      toaster.create({
        title: "Etapa atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o etapa",
        type: "error",
      });
    },
  });

  const { mutateAsync: createEtapaMutation } = useMutation({
    mutationFn: async ({ body }) => await EtapaService.adicionarEtapa({ body }),

    onSuccess(data) {
      queryClient.invalidateQueries(["listar-etapas"]);
      toaster.create({
        title: "Etapa criado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao criar um etapa",
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
      return await createEtapaMutation({ body });
    }

    return await updateEtapaMutation({ id: data._id, body });
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
