import { createListCollection } from "@chakra-ui/react";

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";

import { useQuery } from "@tanstack/react-query";
import { AssistantService } from "../../service/assistant";

import { Box } from "@chakra-ui/react";

export function SelectAssistant({ label, ...props }) {
  const { data: assistants, error } = useQuery({
    queryKey: ["list-assistants"],
    queryFn: AssistantService.listAssistant,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const assistantsCollection = createListCollection({
    items:
      assistants?.map((e) => {
        return { label: e.nome, value: e._id };
      }) ?? [],
  });

  return (
    <Box>
      <SelectRoot
        rounded="md"
        size="xs"
        collection={assistantsCollection}
        {...props}
      >
        {label && (
          <SelectLabel
            fontSize="xs"
            mb="-1"
            fontWeight="normal"
            color="gray.500"
          >
            {label}
          </SelectLabel>
        )}
        <SelectTrigger>
          <SelectValueText placeholder="Selecione um assistente" />
        </SelectTrigger>
        <SelectContent zIndex={9999}>
          {assistantsCollection?.items?.map((assistant) => (
            <SelectItem
              cursor="pointer"
              rounded="sm"
              _hover={{ bg: "gray.100" }}
              item={assistant}
              key={assistant.value}
            >
              {assistant.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
