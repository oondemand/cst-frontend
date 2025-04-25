import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";

export const createDynamicFormFields = () => {
  return [
    {
      accessorKey: "codigo",
      label: "Código",
      render: DefaultField,
      validation: z.coerce
        .string()
        .min(3, { message: "Codigo precisa ter pelo menos 3 caracteres" }),
      colSpan: 1,
    },
    {
      accessorKey: "nome",
      label: "Nome",
      render: DefaultField,
      validation: z.coerce
        .string()
        .min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
      colSpan: 1,
    },
    {
      accessorKey: "posicao",
      label: "Posição",
      render: DefaultField,
      validation: z.coerce.string().nonempty("Posição é um campo obrigatório"),
      colSpan: 1,
    },
  ];
};
