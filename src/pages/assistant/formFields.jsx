import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";
import { SelectAssistantField } from "../../components/buildForm/filds/selectAssistantField";

export const createDynamicFormFields = () => {
  return [
    {
      accessorKey: "modulo",
      label: "Modulo",
      render: DefaultField,
      validation: z.coerce
        .string()
        .min(3, { message: "Modulo precisa ter pelo menos 3 caracteres" }),
      colSpan: 2,
    },
    {
      accessorKey: "assistente",
      label: "Assistente",
      render: SelectAssistantField,
      validation: z.string({ message: "Assistente é um campo obrigatório" }),
      colSpan: 2,
    },
  ];
};
