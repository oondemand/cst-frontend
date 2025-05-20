import React from "react";

import { SelectListaCell } from "../../components/dataGrid/cells/selectLista";
import { SelectPrestadorCell } from "../../components/dataGrid/cells/selectPrestador";
import { DocumentoCadastralDialog } from "./dialog";
import { IconButton } from "@chakra-ui/react";
import { Pencil } from "lucide-react";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { DeleteDocumentoCadastralAction } from "../../components/dataGrid/actions/deleteDocumentoCadastralButton";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { ArquivoDetailsDialog } from "./arquivoDialog";

export const makeDocumentoCadastralDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: (props) => (
        <TableActionsCell>
          <DeleteDocumentoCadastralAction id={props.row.original?._id} />
          <DocumentoCadastralDialog
            label="Documento Cadastral"
            defaultValues={{
              ...props.row.original,
              prestador: {
                label: `${props.row.original?.prestador?.nome}-${props.row.original?.prestador?.sid}-${props.row.original?.prestador?.documento}`,
                value: props.row.original?.prestador?._id,
              },
            }}
          />
          {props.row.original?.arquivo &&
            props.row.original?.statusValidacao === "pendente" && (
              <ArquivoDetailsDialog documentoCadastral={props.row.original} />
            )}
        </TableActionsCell>
      ),
    },

    {
      accessorKey: "prestador",
      header: "Prestador",
      enableSorting: false,
      cell: SelectPrestadorCell,
      enableColumnFilter: true,
      meta: {
        filterVariant: "selectPrestador",
        filterKey: "prestador",
      },
    },
    {
      accessorKey: "tipoDocumento",
      header: "Tipo de documento",
      enableSorting: false,
      cell: (props) => <SelectListaCell {...props} cod={"tipo-documento"} />,
      enableColumnFilter: true,
      meta: {
        filterKey: "tipoDocumento",
        filterVariant: "selectLista",
        cod: "tipo-documento",
      },
    },
    {
      accessorKey: "numero",
      header: "Numero",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: {
        filterKey: "numero",
      },
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "descricao" },
    },
    {
      accessorKey: "motivoRecusa",
      header: "Motivo recusa",
      enableSorting: false,
      cell: (props) => <SelectListaCell {...props} cod={"motivo-recusa"} />,
      enableColumnFilter: true,
      meta: {
        filterKey: "motivoRecusa",
        filterVariant: "selectLista",
        cod: "motivo-recusa",
      },
    },
    {
      accessorKey: "observacaoPrestador",
      header: "Observação Prestador",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "observacaoPrestador" },
    },
    {
      accessorKey: "observacaoInterna",
      header: "Observação",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "observacaoInterna" },
    },
    {
      accessorKey: "statusValidacao",
      header: "Status validação",
      enableSorting: false,
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={[
            { label: "Pendente", value: "pendente" },
            { label: "Recusado", value: "recusado" },
            { label: "Aprovado", value: "aprovado" },
          ]}
        />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "statusValidacao",
        filterVariant: "select",
        filterOptions: [
          { label: "Pendente", value: "pendente" },
          { label: "Recusado", value: "recusado" },
          { label: "Aprovado", value: "aprovado" },
        ],
      },
    },
  ];
};
