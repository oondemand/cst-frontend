import { currencyValidation, dateValidation } from "../../utils/zodHelpers";
import { SelectPrestadorField } from "../../components/buildForm/filds/selectPrestadorField";
import { z } from "zod";
import { CompetenciaField } from "../../components/buildForm/filds/competenciaField";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { DateField } from "../../components/buildForm/filds/dateField";
import { CurrencyField } from "../../components/buildForm/filds/currencyField";
import { DefaultField } from "../../components/buildForm/filds/default";

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
