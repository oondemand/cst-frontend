import { Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { queryClient } from "../../config/react-query";
import { createDynamicFormFields } from "./formFields";

import { useCreateAssistantConfig } from "../../hooks/api/assistant-config/useCreateAssistantConfig";
import { useUpdateAssistantConfig } from "../../hooks/api/assistant-config/useUpdateAssistantConfig";

import { FormDialog } from "../../components/formDialog";
import {
  DefaultTrigger,
  IconTrigger,
} from "../../components/formDialog/form-trigger";
import { ORIGENS } from "../../constants/origens";

export const AssistenteConfigDialog = ({
  defaultValues = null,
  label = "Configurar assistente",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const fields = useMemo(() => createDynamicFormFields(), [data]);

  const updateAssistenteConfig = useUpdateAssistantConfig({
    origem: ORIGENS.FORM,
    onSuccess: (data) => open && setData(data),
  });

  const createAssistenteConfig = useCreateAssistantConfig({
    origem: ORIGENS.FORM,
    onSuccess: (data) => open && setData(data),
  });

  const onSubmit = async (values) => {
    const body = {
      ...values,
      email: values?.email === "" ? null : values?.email,
    };

    if (!data) {
      return await createAssistenteConfig.mutateAsync({ body });
    }

    return await updateAssistenteConfig.mutateAsync({ id: data._id, body });
  };

  return (
    <Box>
      <Box onClick={() => setOpen(true)} asChild>
        {defaultValues ? (
          <IconTrigger />
        ) : (
          <DefaultTrigger title="Criar um assistente" />
        )}
      </Box>
      <FormDialog
        data={data}
        fields={fields}
        label={label}
        onSubmit={onSubmit}
        onOpenChange={() => {
          queryClient.invalidateQueries(["listar-assistente-config"]);
          setOpen(false);
          setData();
        }}
        open={open}
        key="ASSISTENTE_CONFIG"
      />
    </Box>
  );
};
