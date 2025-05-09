import { Box, Button, Flex, Text, IconButton, Spinner } from "@chakra-ui/react";
import { CloseButton } from "../../../components/ui/close-button";

import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../config/react-query";

import { createDynamicFormFields } from "../formFields";
import { BuildForm } from "../../../components/buildForm/index";
import { VisibilityControlDialog } from "../../../components/vibilityControlDialog";
import { useVisibleInputForm } from "../../../hooks/useVisibleInputForms";
import { toaster } from "../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../service/documentos-fiscais";
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
  DialogFooter,
} from "../../../components/ui/dialog";

import {
  FileUploadRoot,
  FileUploadTrigger,
} from "../../../components/ui/file-upload";
import {
  Paperclip,
  CircleX,
  Download,
  FilePenLine,
  Check,
  Circle,
  X,
} from "lucide-react";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../../components/ui/tooltip";
import { ServicoForm } from "./form/servico";

export const ArquivoDetailsDialog = ({ arquivo, prestadorId }) => {
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [servicos, setServicos] = useState([]);

  const { data: response } = useQuery({
    queryKey: ["file/documento-fiscal", arquivo?._id],
    queryFn: async () => await TicketService.getFile({ id: arquivo?._id }),
    enabled: open,
    staleTime: 1000 * 60 * 10, // 10 minutos
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
          content="Analisar documento fiscal"
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
              <Flex gap="4">
                <DialogTitle>Analisar Documento Fiscal</DialogTitle>
              </Flex>
            </DialogHeader>
            <DialogBody overflowY="auto" className="dialog-custom-scrollbar">
              <Flex gap="2" {...(!pdfUrl && { h: "full" })}>
                {pdfUrl && (
                  <Box w="50%" ml="-4" shadow="none" boxShadow="none">
                    {pdfUrl && (
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer fileUrl={pdfUrl} />
                      </Worker>
                    )}
                  </Box>
                )}
                <Box
                  position={pdfUrl ? "absolute" : "relative"}
                  ml={pdfUrl ? "48%" : "0"}
                  h={pdfUrl ? "90%" : "full"}
                  overflow="auto"
                  scrollbar="hidden"
                  w="45%"
                >
                  <Flex
                    h="full"
                    flexDir="column"
                    justifyContent="space-between"
                    gap="2"
                  >
                    <ServicoForm
                      prestadorId={prestadorId}
                      servicos={servicos}
                      setServicos={setServicos}
                    />
                    <Flex gap="2">
                      <Button
                        variant="surface"
                        shadow="xs"
                        colorPalette="green"
                        size="xs"
                      >
                        <Check /> Aprovar
                      </Button>
                      <Button
                        variant="surface"
                        shadow="xs"
                        colorPalette="red"
                        size="xs"
                      >
                        <X /> Reprovar
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
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
