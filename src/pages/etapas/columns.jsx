import React from "react";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";

import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { EtapasDialog } from "./dialog";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { DeleteEtapaAction } from "../../components/dataGrid/actions/deleteEtapaButton";

import { IconButton } from "@chakra-ui/react";
import { Pencil } from "lucide-react";

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
            trigger={
              <IconButton variant="surface" colorPalette="gray" size="2xs">
                <Pencil />
              </IconButton>
            }
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
      meta: { filterKey: "codigo" },
    },
    {
      accessorKey: "nome",
      header: "Nome",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "nome" },
    },
    {
      accessorKey: "posicao",
      header: "posição",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
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
      enableColumnFilter: true,
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
