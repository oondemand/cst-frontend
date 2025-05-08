import {
  Flex,
  IconButton,
  Text,
  Button,
  Box,
  Clipboard,
} from "@chakra-ui/react";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

import Markdown from "react-markdown";

import { Prose } from "../../components/ui/prose";

import { useState } from "react";

import { JsonView, allExpanded } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const customTheme = {};

const ClipboardIconButton = () => {
  return (
    <Clipboard.Trigger asChild>
      <IconButton variant="unstyled" size="xs" me="-2">
        <Clipboard.Indicator color="gray.500" />
      </IconButton>
    </Clipboard.Trigger>
  );
};

export function TextCard({ text, type, details }) {
  // const [open, setOpen] = useState();

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
          {/* {type === "bot" && details && (
            <Button
              rounded="full"
              size="2xs"
              onClick={() => setOpen(true)}
              variant="outline"
              colorPalette="black"
            >
              Inspecionar detalhes
            </Button>
          )} */}
        </Flex>
        <Prose fontSize="xs" lineHeight="1">
          <Markdown>{text}</Markdown>
        </Prose>
        <Clipboard.Root position="absolute" top="0" right="2" value={text}>
          <ClipboardIconButton />
        </Clipboard.Root>
      </Flex>

      {/* {open && (
        <DialogRoot
          lazyMount
          placement="center"
          size="cover"
          open={open}
          onOpenChange={(e) => setOpen(e.open)}
        >
          <DialogContent maxH="90%">
            <DialogHeader>
              <DialogTitle>Detalhes da requisição</DialogTitle>
            </DialogHeader>
            <DialogBody w="full" h="full" overflow="auto" scrollbarWidth="thin">
              <JsonView
                container={{ backgroundColor: "red" }}
                data={{
                  prompt: details?.prompt,
                  variaveis: details?.body,
                  resposta: details?.response,
                }}
                shouldExpandNode={allExpanded}
                style={customTheme}
              />
            </DialogBody>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
      )} */}
    </>
  );
}
