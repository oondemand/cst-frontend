import React from "react";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";

import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { AssistenteConfigDialog } from "./dialog";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { DeleteAssistenteConfigAction } from "../../components/dataGrid/actions/deleteAssistenteConfigButton";

import { IconButton } from "@chakra-ui/react";
import { Pencil } from "lucide-react";
import { SelectAssistantCell } from "../../components/dataGrid/cells/selectAssistantCell";

export const makeAssistenteConfigDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: (props) => (
        <TableActionsCell>
          <DeleteAssistenteConfigAction id={props.row.original?._id} />
          <AssistenteConfigDialog
            trigger={
              <IconButton variant="surface" colorPalette="gray" size="2xs">
                <Pencil />
              </IconButton>
            }
            label="Assistente"
            defaultValues={{
              ...props.row.original,
            }}
          />
        </TableActionsCell>
      ),
    },
    {
      accessorKey: "modulo",
      header: "Modulo",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "modulo" },
    },
    {
      accessorKey: "assistente",
      header: "Assistente",
      cell: SelectAssistantCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "assistente" },
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
