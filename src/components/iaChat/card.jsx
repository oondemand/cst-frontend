import { Flex, IconButton, Text, Clipboard } from "@chakra-ui/react";
import Markdown from "react-markdown";
import { Prose } from "../../components/ui/prose";

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton variant="unstyled" size="xs" me="-2">
        <Clipboard.Indicator color="gray.500" />
      </IconButton>
    </Clipboard.Trigger>
  );
};

export function TextCard({ text, type }) {
  return (
    <>
      <Flex
        rounded="md"
        px="2"
        gap="0"
        border="1px dashed"
        borderColor="gray.200"
        flexDir="column"
        pt="1.5"
        position="relative"
        data-state="open"
        _open={{
          animation: "fade-in 300ms ease-out",
        }}
      >
        <Flex gap="4">
          <Text fontWeight="semibold" fontSize="xs" color="gray.500">
            {type === "user" ? "Usuário" : "Resposta"}
          </Text>
        </Flex>
        <Prose fontSize="xs" lineHeight="1">
          <Markdown>{text}</Markdown>
        </Prose>
        <Clipboard.Root position="absolute" top="0" right="2" value={text}>
          <ClipboardIconButton />
        </Clipboard.Root>
      </Flex>
    </>
  );
}
