import { Table, Popover, Portal } from "@chakra-ui/react";
import { memo } from "react";

import { flexRender } from "@tanstack/react-table";
import { ServicosCard } from "./servicosCard";

const TableBody = ({ rows, columns, data }) => {
  return (
    <Table.Body>
      {rows.map((row) => (
        <Popover.Root positioning={{ placement: "right-end" }}>
          <Table.Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Cell
                px="1"
                fontSize="md"
                w={`calc(var(--col-${cell.column.id}-size) * 1px)`}
                key={cell.id}
              >
                <Popover.Trigger w="full" h="full">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Popover.Trigger>
              </Table.Cell>
            ))}
          </Table.Row>
          <Portal>
            <Popover.Positioner>
              <Popover.Content width="auto">
                <Popover.Arrow />
                <Popover.Body
                  maxW="1440px"
                  overflow="auto"
                  className="custom-scrollbar"
                >
                  <ServicosCard servicos={row.original?.servicos} />
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      ))}
    </Table.Body>
  );
};

export const MemoizedTableBody = memo(TableBody, (prev, next) => {
  if (prev.columns.length !== next.columns.length) {
    return false;
  }

  if (prev.rows.length !== next.rows.length) {
    return false;
  }

  if (prev.data !== next.data) {
    return false;
  }

  return true;
});
