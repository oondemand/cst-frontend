import { Table } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";

export const TableFooter = ({ table }) => {
  return (
    <Table.Footer>
      {table.getFooterGroups().map((footerGroup) => (
        <Table.Row border="transparent" key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <Table.Cell bg="gray.100" border="transparent" key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                  )}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Footer>
  );
};
