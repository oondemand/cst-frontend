import { SelectPrestadorField } from "../../components/buildForm/filds/selectPrestadorField";
import { z } from "zod";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
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
      accessorKey: "tipoDocumento",
      label: "Documento Fiscal",
      cod: "tipo-documento",
      render: SelectListaField,
      validation: z.string({
        message: "Campo obrigatório",
      }),
      colSpan: 1,
    },
    {
      accessorKey: "numero",
      label: "Numero",
      render: DefaultField,
      validation: z.string().nonempty("Número é obrigatório"),
      colSpan: 1,
    },

    {
      accessorKey: "motivoRecusa",
      label: "Motivo Recusa",
      cod: "motivo-recusa",
      render: SelectListaField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "descricao",
      label: "Descrição",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 4,
    },
    {
      accessorKey: "observacaoPrestador",
      label: "Observação Prestador",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 4,
    },
    {
      accessorKey: "observacaoInterna",
      label: "Observação",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 4,
    },
  ];
};
