import { DefaultField } from "../../components/buildForm/filds/default";
import { DateField } from "../../components/buildForm/filds/dateField";
import { z } from "zod";
import { SelectCategoriaField } from "../../components/buildForm/filds/selectCategoriaField";
import { SelectContaCorrenteField } from "../../components/buildForm/filds/selectContaCorrenteField";
import { dateValidation } from "../../utils/zodHelpers";

export const FORMS = [
  {
    title: "Geral",
    fields: [
      {
        accessorKey: "remetente.nome",
        label: "Nome remetente",
        render: DefaultField,
        validation: z.string().nonempty(),
        colSpan: 1,
      },
      {
        accessorKey: "remetente.email",
        label: "Email remetente",
        render: DefaultField,
        validation: z.string().email("Email inválido!").nonempty(),
        colSpan: 1,
      },
      {
        accessorKey: "data_corte_app_publisher",
        label: "Data de corte app publisher",
        render: DateField,
        validation: dateValidation,
        colSpan: 1,
      },
    ],
  },
  {
    title: "Omie",
    fields: [
      {
        accessorKey: "omie.id_conta_corrente",
        label: "Id conta corrente",
        render: SelectContaCorrenteField,
        validation: z.number(),
        colSpan: 1,
      },
      {
        accessorKey: "omie.codigo_categoria",
        label: "Codigo categoria",
        render: SelectCategoriaField,
        validation: z
          .string()
          .nonempty("Código categoria é um campo obrigatório"),
        colSpan: 1,
      },
    ],
  },
];
