import { Box, Table, Text, Flex } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";

import { ArrowDown, ArrowUp, Repeat2 } from "lucide-react";
import { Filter } from "../filter";

const sortingIconsMap = {
  asc: <ArrowUp size={14} />,
  desc: <ArrowDown size={14} />,
  false: <Repeat2 size={14} />,
};

export const TableHeader = ({ table, filters, onFilterChange }) => {
  return (
    <Table.Header>
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Row key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const fieldMeta = header.column.columnDef.meta;

            return (
              <Table.ColumnHeader
                border="1px solid"
                borderColor="gray.200"
                p="0.5"
                key={header.id}
                w={`calc(var(--header-${header?.id}-size) * 1px)`}
                colSpan={header.colSpan}
                position="relative"
                bg="brand.350"
              >
                <Flex flexDir="column" p="0.5" gap="0.5">
                  <Flex onClick={header.column.getToggleSortingHandler()}>
                    <Flex alignItems="center" gap="2" cursor="pointer">
                      <Text
                        fontWeight="semibold"
                        textWrap="nowrap"
                        color="white"
                        fontSize="sm"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Text>
                      <Box rounded="full" p="0.5" bg="zinc.400" color="white">
                        {header.column.getCanSort() &&
                          (sortingIconsMap[header.column.getIsSorted()] ??
                            null)}
                      </Box>
                    </Flex>
                  </Flex>

                  {header.column.getCanFilter() &&
                    fieldMeta?.filterKey !== undefined && (
                      <Filter
                        bg="white"
                        minW="full"
                        value={filters[fieldMeta?.filterKey] ?? ""}
                        fieldMeta={fieldMeta}
                        onChange={onFilterChange}
                      />
                    )}
                </Flex>
                <Box
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  position="absolute"
                  top="0"
                  right="0"
                  w="8px"
                  h="full"
                  bg={header.column.getIsResizing() ? "brand.300" : "brand.200"}
                  cursor="col-resize"
                  userSelect="none"
                  touchAction="none"
                  rounded="xs"
                  _hover={{ opacity: 1 }}
                  opacity={header.column.getIsResizing() ? 1 : 0}
                />
              </Table.ColumnHeader>
            );
          })}
        </Table.Row>
      ))}
    </Table.Header>
  );
};
