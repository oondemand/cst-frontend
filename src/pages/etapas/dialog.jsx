import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { queryClient } from "../../config/react-query";
import { createDynamicFormFields } from "./formFields";
import { FormDialog } from "../../components/formDialog";
import {
  DefaultTrigger,
  IconTrigger,
} from "../../components/formDialog/form-trigger";
import { useCreateEtapa } from "../../hooks/api/etapas/useCreateEtapa";
import { useUpdateEtapa } from "../../hooks/api/etapas/useUpdateEtapa";
import { ORIGENS } from "../../constants/origens";

export const EtapasDialog = ({
  defaultValues = null,
  label = "Criar etapa",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const fields = useMemo(() => createDynamicFormFields(), [data]);

  const createEtapa = useCreateEtapa({
    origem: ORIGENS.FORM,
  });
  const updateEtapa = useUpdateEtapa({
    origem: ORIGENS.FORM,
  });

  const onSubmit = async (values) => {
    const body = {
      ...values,
      email: values?.email === "" ? null : values?.email,
    };

    if (!data) {
      return await createEtapa.mutateAsync({ body });
    }

    return await updateEtapa.mutateAsync({ id: data._id, body });
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
          <DefaultTrigger title="Criar uma etapa" />
        )}
      </Box>
      <FormDialog
        data={data}
        fields={fields}
        label={label}
        onSubmit={onSubmit}
        onOpenChange={() => {
          queryClient.invalidateQueries(["listar-etapas"]);
          setOpen(false);
          setData(defaultValues);
        }}
        open={open}
        key="ETAPAS"
      />
    </Box>
  );
};
