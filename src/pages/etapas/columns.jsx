import React from "react";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";

import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { EtapasDialog } from "./dialog";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { DeleteEtapaAction } from "../../components/dataGrid/actions/deleteEtapaButton";

export const makeEtapasDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: (props) => (
        <TableActionsCell>
          <DeleteEtapaAction id={props.row.original?._id} />
          <EtapasDialog
            label="Etapa"
            defaultValues={{
              ...props.row.original,
            }}
          />
        </TableActionsCell>
      ),
    },
    {
      accessorKey: "codigo",
      header: "Codigo",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "codigo" },
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "nome" },
    },
    {
      accessorKey: "posicao",
      header: "posição",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "posicao" },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={[
            { label: "Ativo", value: "ativo" },
            { label: "Inativo", value: "inativo" },
          ]}
        />
      ),
      enableColumnFilter: false,
      enableSorting: false,
      meta: {
        filterKey: "status",
        filterVariant: "select",
        filterOptions: [
          { label: "Ativo", value: "ativo" },
          { label: "Inativo", value: "inativo" },
        ],
      },
    },
  ];
};
