import { Box, Button, Flex, Text, IconButton, Spinner } from "@chakra-ui/react";
import { CloseButton } from "../../components/ui/close-button";

import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../config/react-query";

import { createDynamicFormFields } from "./formFields";
import { BuildForm } from "../../components/buildForm/index";
import { VisibilityControlDialog } from "../../components/vibilityControlDialog";
import { useVisibleInputForm } from "../../hooks/useVisibleInputForms";
import { toaster } from "../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../service/documentos-fiscais";
import { TicketService } from "../../service/ticket";

import {
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import {
  FileUploadRoot,
  FileUploadTrigger,
} from "../../components/ui/file-upload";
import { Paperclip, CircleX, Download, FilePenLine } from "lucide-react";
import { useConfirmation } from "../../hooks/useConfirmation";

export const ArquivoDetailsDialog = ({ arquivo }) => {
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

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

      // Cleanup function to revoke the URL when component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [response]);

  return (
    <Box>
      <Box onClick={() => setOpen(true)} asChild>
        <IconButton variant="surface" colorPalette="gray" size="2xs">
          <FilePenLine />
        </IconButton>
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
          >
            <DialogHeader mt="-4" py="2" px="4">
              <Flex gap="4">
                <DialogTitle>Detalhes do arquivo</DialogTitle>
              </Flex>
            </DialogHeader>
            <DialogBody overflowY="auto" className="dialog-custom-scrollbar">
              {pdfUrl && (
                <Box
                  as="iframe"
                  src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
                  bg="gray.50"
                  w="50%"
                  h="100%"
                  title="PDF Viewer"
                />
              )}
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
