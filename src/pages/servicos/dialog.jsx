import { Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { queryClient } from "../../config/react-query";
import { createDynamicFormFields } from "./formFields";
import { useIaChat } from "../../hooks/useIaChat";
import { useLoadAssistant } from "../../hooks/api/useLoadAssistant";
import { useUpdateServico } from "../../hooks/api/servico/useUpdateServico";
import { useCreateServico } from "../../hooks/api/servico/useCreateServico";
import { FormDialog } from "../../components/formDialog";
import {
  DefaultTrigger,
  IconTrigger,
} from "../../components/formDialog/form-trigger";

export const ServicosDialog = ({
  defaultValues = null,
  label = "Criar Serviço",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const { onOpen } = useIaChat();
  const { assistant } = useLoadAssistant("servico");
  const fields = useMemo(() => createDynamicFormFields(), []);

  const updateServico = useUpdateServico({
    onSuccess: (data) => open && setData((prev) => data?.servico),
  });

  const createServico = useCreateServico({
    onSuccess: (data) => open && setData((prev) => data?.servico),
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

    if (!data) return await createServico.mutateAsync({ body });
    return await updateServico.mutateAsync({ id: data._id, body });
  };

  return (
    <Box>
      <Box onClick={() => setOpen(true)} asChild>
        {defaultValues ? (
          <IconTrigger />
        ) : (
          <DefaultTrigger title="Criar um servico" />
        )}
      </Box>
      <FormDialog
        open={open}
        onSubmit={onSubmit}
        data={data}
        fields={fields}
        label={label}
        onOpenAssistantDialog={() => onOpen(data, assistant)}
        onOpenChange={() => {
          queryClient.invalidateQueries(["listar-servicos"]);
          setOpen(false);
          setData();
        }}
        key="SERVICOS"
      />
    </Box>
  );
};
