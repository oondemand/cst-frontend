import { preprocessEmptyToUndefined } from "../../utils/zodHelpers";
import { SelectPrestadorField } from "../../components/buildForm/filds/selectPrestadorField";
import { z } from "zod";
import { CompetenciaField } from "../../components/buildForm/filds/competenciaField";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { DateField } from "../../components/buildForm/filds/dateField";
import { parse, isValid, format } from "date-fns";
import { CurrencyField } from "../../components/buildForm/filds/currencyField";
import { DefaultField } from "../../components/buildForm/filds/default";

const currencyValidation = preprocessEmptyToUndefined(
  z.coerce
    .string()
    .transform((value) => {
      const isNegative = value.includes("-");
      const isCurrencyString = value.includes("R$");

      const numericString = isCurrencyString
        ? value
            .replaceAll(".", "-")
            .replaceAll("R$", "")
            .replaceAll(",", ".")
            .replaceAll("-", "")
            .trim()
        : value.replaceAll("-", "");

      const numero = Number(numericString);

      return isNegative ? -numero : numero;
    })
    .optional()
);

const dateValidation = z
  .string()
  .transform((value) => {
    if (!value) return undefined;
    return format(parse(value, "dd/MM/yyyy", new Date()), "yyyy/MM/dd");
  })
  .refine(
    (value) => (value ? isValid(parse(value, "yyyy/MM/dd", new Date())) : true),
    {
      message: "Data inválida ",
    }
  )
  .optional();

export const createDynamicFormFields = () => {
  return [
    {
      accessorKey: "prestador",
      label: "Prestador",
      render: SelectPrestadorField,
      validation: z.object(
        { label: z.string(), value: z.string() },
        { message: "Prestador é obrigatório" }
      ),
      colSpan: 2,
    },
    {
      accessorKey: "descricao",
      label: "Descrição",
      enableSorting: false,
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 2,
    },
    {
      accessorKey: "codigoCNAE",
      label: "CNAE",
      enableSorting: false,
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "competencia",
      label: "Competência",
      render: CompetenciaField,
      validation: z.string().min(7, { message: "Data inválida" }),
      colSpan: 1,
    },
    {
      accessorKey: "tipoDocumentoFiscal",
      label: "Documento Fiscal",
      cod: "tipo-documento-fiscal",
      render: SelectListaField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dataRegistro",
      label: "Data Registro",
      render: DateField,
      validation: dateValidation,
      colSpan: 1,
    },
    {
      accessorKey: "valor",
      label: "Valor",
      render: CurrencyField,
      validation: currencyValidation,
      colSpan: 1,
    },
  ];
};
