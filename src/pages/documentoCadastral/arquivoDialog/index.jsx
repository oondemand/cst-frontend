import { Box, Flex, IconButton } from "@chakra-ui/react";
import { CloseButton } from "../../../components/ui/close-button";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { TicketService } from "../../../service/ticket";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import {
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import { FilePenLine } from "lucide-react";
import { Tooltip } from "../../../components/ui/tooltip";
import { AprovarForm } from "./form/aprovar";
import { ReprovarForm } from "./form/reprovar";

export const ArquivoDetailsDialog = ({ documentoCadastral }) => {
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const { data: response } = useQuery({
    queryKey: ["file/documento-cadastral", documentoCadastral?.arquivo?._id],
    queryFn: async () =>
      await TicketService.getFile({ id: documentoCadastral?.arquivo?._id }),
    enabled: open,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  useEffect(() => {
    if (response?.data?.buffer?.data) {
      const pdfBlob = new Blob([new Uint8Array(response.data.buffer.data)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [response]);

  return (
    <Box>
      <Box onClick={() => setOpen(true)}>
        <Tooltip
          content="Analisar documento cadastral"
          positioning={{ placement: "top" }}
          openDelay={1000}
          closeDelay={50}
          contentProps={{
            css: {
              "--tooltip-bg": "white",
              color: "gray.600",
            },
          }}
        >
          <IconButton variant="surface" colorPalette="gray" size="2xs">
            <FilePenLine />
          </IconButton>
        </Tooltip>
      </Box>
      {open && (
        <DialogRoot
          size="cover"
          open={open}
          onOpenChange={(e) => {
            setOpen(e.open);
          }}
        >
          <DialogContent
            overflow="hidden"
            w="1250px"
            maxH="99%"
            pt="6"
            px="2"
            rounded="lg"
            position="relative"
          >
            <DialogHeader mt="-4" py="2" px="4">
              <Flex gap="4" alignItems="baseline">
                <DialogTitle>Analisar Documento Cadastral</DialogTitle>
              </Flex>
            </DialogHeader>
            <DialogBody overflowY="auto" className="dialog-custom-scrollbar">
              <Flex w="full">
                <Box w="50%" ml="-4" shadow="none" boxShadow="none">
                  {pdfUrl && (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer fileUrl={pdfUrl} />
                    </Worker>
                  )}
                </Box>

                <Flex
                  h="full"
                  flex="1"
                  flexDir="column"
                  gap="6"
                  border="1px solid"
                  borderColor="gray.100"
                  rounded="2xl"
                  p="4"
                  pb="6"
                >
                  <AprovarForm
                    prestadorId={documentoCadastral?.prestador?._id}
                    documentoCadastral={documentoCadastral}
                  />
                  <ReprovarForm
                    documentoCadastralId={documentoCadastral?._id}
                  />
                </Flex>
              </Flex>
            </DialogBody>
            <DialogCloseTrigger asChild>
              <CloseButton size="sm" />
            </DialogCloseTrigger>
          </DialogContent>
        </DialogRoot>
      )}
    </Box>
  );
};
