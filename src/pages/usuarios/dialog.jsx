import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { queryClient } from "../../config/react-query";
import { createDynamicFormFields } from "./formFields";
import { useCreateUsuario } from "../../hooks/api/usuarios/useCreateUsuario";
import { useUpdateUsuario } from "../../hooks/api/usuarios/useUpdateUsuario";
import { FormDialog } from "../../components/formDialog";
import {
  DefaultTrigger,
  IconTrigger,
} from "../../components/formDialog/form-trigger";
import { ORIGENS } from "../../constants/origens";

export const UsuariosDialog = ({
  defaultValues = null,
  label = "Criar usuário",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);

  const fields = useMemo(() => {
    if (data) {
      return createDynamicFormFields().filter(
        (e) => e?.accessorKey !== "senha"
      );
    }

    return createDynamicFormFields().filter((e) => e?.accessorKey !== "status");
  }, [data]);

  const createUsuario = useCreateUsuario({
    origem: ORIGENS.FORM,
  });
  const updateUsuario = useUpdateUsuario({
    origem: ORIGENS.FORM,
  });

  const onSubmit = async (values) => {
    const body = {
      ...values,
      email: values?.email === "" ? null : values?.email,
    };

    if (!data) return await createUsuario.mutateAsync({ body });
    return await updateUsuario.mutateAsync({ id: data._id, body });
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
          <DefaultTrigger title="Criar um usuário" />
        )}
      </Box>
      <FormDialog
        data={data}
        fields={fields}
        label={label}
        onSubmit={onSubmit}
        onOpenChange={() => {
          queryClient.invalidateQueries(["listar-usuarios"]);
          setOpen(false);
          setData(defaultValues);
        }}
        open={open}
        key="USUARIOS"
      />
    </Box>
  );
};
