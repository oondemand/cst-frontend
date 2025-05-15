import { Button, Text, Flex, createListCollection } from "@chakra-ui/react";

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { DebouncedInput } from "../DebouncedInput";

const pageSizeOptions = createListCollection({
  items: [
    { label: "10", value: 10 },
    { label: "15", value: 15 },
    { label: "25", value: 25 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
  ],
});

export const Pagination = ({ table }) => {
  return (
    <Flex mt="4" alignItems="flex-end" gap="6">
      <Flex flexDir="column" gap="2">
        <Flex alignItems="center" gap="1" fontSize="sm">
          <Text>Page</Text>
          <Text fontWeight="semibold">
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </Text>
        </Flex>
        <Flex gap="2">
          <Button
            size="xs"
            variant="subtle"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </Flex>
      </Flex>

      <Flex gap="4" align="flex-end">
        <SelectRoot
          w="100px"
          size="xs"
          value={[table.getState().pagination.pageSize]}
          onValueChange={({ value }) => table.setPageSize(Number(...value))}
          collection={pageSizeOptions}
        >
          <SelectLabel fontSize="sm">Mostrar</SelectLabel>
          <SelectTrigger>
            <SelectValueText />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.items.map((item) => (
              <SelectItem item={item} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>

        <Flex flexDir="column" gap="1">
          <Text fontSize="sm" fontWeight="medium">
            Ir para a página:
          </Text>
          <DebouncedInput
            debounce={1500}
            iconVisible={false}
            size="xs"
            value={(table.getState().pagination.pageIndex + 1).toString() ?? ""}
            onChange={(value) => {
              const page = Number(value) - 1;
              table.setPageIndex(page);
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
