import { Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { queryClient } from "../../config/react-query";
import { createDynamicFormFields } from "./formFields";
import { formatDateToDDMMYYYY } from "../../utils/formatting";
import { useUpdatePrestador } from "../../hooks/api/prestador/useUpdatePrestador";
import { useCreatePrestador } from "../../hooks/api/prestador/useCreatePrestador";
import { useLoadAssistant } from "../../hooks/api/useLoadAssistant";
import { useIaChat } from "../../hooks/useIaChat";
import { FormDialog } from "../../components/formDialog";
import {
  DefaultTrigger,
  IconTrigger,
} from "../../components/formDialog/form-trigger";

export const PrestadoresDialog = ({
  defaultValues = null,
  label = "Criar prestador",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const { onOpen } = useIaChat();
  const { assistant } = useLoadAssistant("prestador");
  const fields = useMemo(() => createDynamicFormFields(), []);

  const formatPrestador = (prestador) => ({
    ...prestador,
    pessoaFisica: {
      ...prestador?.pessoaFisica,
      dataNascimento: formatDateToDDMMYYYY(
        prestador?.pessoaFisica?.dataNascimento
      ),
    },
  });

  const updatePrestador = useUpdatePrestador({
    onSuccess: (data) => {
      if (open) {
        setData((prev) =>
          data?.prestador ? formatPrestador(data.prestador) : prev
        );
      }
    },
  });

  const createPrestador = useCreatePrestador({
    onSuccess: (data) => {
      if (open) {
        setData((prev) =>
          data?.prestador ? formatPrestador(data.prestador) : prev
        );
      }
    },
  });

  const onSubmit = async (values) => {
    const {
      endereco: { pais, ...rest },
    } = values;

    const body = {
      ...values,
      email: values?.email === "" ? null : values?.email,
      endereco: { ...rest, ...(pais.cod ? { pais } : {}) },
    };

    if (!data) return await createPrestador.mutateAsync({ body });
    return await updatePrestador.mutateAsync({ body, id: data._id });
  };

  return (
    <Box>
      <Box onClick={() => setOpen(true)} asChild>
        {defaultValues ? (
          <IconTrigger />
        ) : (
          <DefaultTrigger title="Criar um prestador" />
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
        key="PRESTADORES"
      />
    </Box>
  );
};
