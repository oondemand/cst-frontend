import React from "react";

import { SelectListaCell } from "../../components/dataGrid/cells/selectLista";
import { DateCell } from "../../components/dataGrid/cells/dateCell";
import { CompetenciaCell } from "../../components/dataGrid/cells/competenciaCell";
import { CurrencyCell } from "../../components/dataGrid/cells/currencyCell";
import { DisabledDefaultCell } from "../../components/dataGrid/cells/disabledDefaultCell";
import { SelectPrestadorCell } from "../../components/dataGrid/cells/selectPrestador";
import { ServicosDialog } from "./dialog";
import { formatDateToDDMMYYYY } from "../../utils/formatting";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { DeleteServicoAction } from "../../components/dataGrid/actions/deleteServicoButton";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";

export const makeServicoDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: (props) => (
        <TableActionsCell>
          <DeleteServicoAction id={props.row.original?._id} />
          <ServicosDialog
            label="Serviço"
            defaultValues={{
              ...props.row.original,
              prestador: {
                label: `${props.row.original?.prestador?.nome}-${props.row.original?.prestador?.documento}`,
                value: props.row.original?.prestador?._id,
              },
              dataRegistro: formatDateToDDMMYYYY(
                props.row.original?.dataRegistro
              ),
              competencia: `${props.row.original.competencia.mes
                .toString()
                .padStart(2, "0")}/${props.row.original.competencia.ano}`,
            }}
          />
        </TableActionsCell>
      ),
    },
    {
      accessorKey: "tipoDocumentoFiscal",
      header: "Documento Fiscal",
      enableSorting: false,
      cell: (props) => (
        <SelectListaCell {...props} cod={"tipo-documento-fiscal"} />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "tipoDocumentoFiscal",
        filterVariant: "selectLista",
        cod: "tipo-documento-fiscal",
      },
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: {
        filterKey: "descricao",
      },
    },
    {
      accessorKey: "codigoCNAE",
      header: "CNAE",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: {
        filterKey: "codigoCNAE",
      },
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
      accessorKey: "dataRegistro",
      header: "Data Registro",
      enableSorting: false,
      cell: DateCell,
      enableColumnFilter: true,
      meta: { filterKey: "dataRegistro" },
    },
    {
      accessorKey: "competencia",
      header: "Competência",
      enableSorting: false,
      cell: CompetenciaCell,
      enableColumnFilter: true,
      meta: { filterKey: "competencia", filterVariant: "competencia" },
    },
    {
      accessorKey: "valor",
      header: "Valor",
      enableSorting: false,
      cell: CurrencyCell,
      enableColumnFilter: true,
      meta: { filterKey: "valor" },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: DisabledDefaultCell,
      enableColumnFilter: true,
      meta: {
        filterKey: "status",
        filterVariant: "select",
        filterOptions: [
          { label: "Em aberto", value: "aberto" },
          { label: "Pendente", value: "pendente" },
          { label: "Processando", value: "processando" },
          { label: "Pago", value: "pago" },
          { label: "Pago externo", value: "pago-externo" },
        ],
      },
    },
  ];
};
