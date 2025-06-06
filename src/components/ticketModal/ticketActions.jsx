import { Flex, Button, useDialogContext } from "@chakra-ui/react";
import { Check, Trash, X } from "lucide-react";

import { toaster } from "../ui/toaster";
import { TicketService } from "../../service/ticket";
import { useMutation } from "@tanstack/react-query";
import { useConfirmation } from "../../hooks/useConfirmation";
import { queryClient } from "../../config/react-query";
import { ORIGENS } from "../../constants/origens";

export const TicketActions = ({ ticketId, etapa }) => {
  const { setOpen } = useDialogContext();
  const { requestConfirmation } = useConfirmation();

  const { mutateAsync: arquiveTicketMutation, isPending: isArquivePending } =
    useMutation({
      mutationFn: async () =>
        await TicketService.arquivarTicket({
          id: ticketId,
          origem: ORIGENS.ESTEIRA,
        }),
      onSuccess: () => {
        toaster.create({
          title: "Ticket arquivado com sucesso!",
          type: "success",
        });
      },
      onError: () => {
        toaster.error({ title: "Ouve um erro ao arquivar o ticket!" });
      },
    });

  const { mutateAsync: aproveTicketMutation, isPending: isAprovePending } =
    useMutation({
      mutationFn: async () =>
        await TicketService.aprovarTicket({
          id: ticketId,
          origem: ORIGENS.ESTEIRA,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries(["listar-tickets"]);
        toaster.create({
          title: "Ticket aprovado com sucesso!",
          type: "success",
        });
      },
      onError: () => {
        toaster.error({ title: "Ouve um erro ao aprovar o ticket!" });
      },
    });

  const { mutateAsync: reproveTicketMutation, isPending: isReprovePending } =
    useMutation({
      mutationFn: async () =>
        await TicketService.reprovarTicket({
          id: ticketId,
          origem: ORIGENS.ESTEIRA,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries(["listar-tickets"]);
        toaster.create({
          title: "Ticket reprovado com sucesso!",
          type: "success",
        });
      },
      onError: () => {
        toaster.error({ title: "Ouve um erro ao reprovar o ticket!" });
      },
    });

  const handleArquiveTicket = async () => {
    const { action } = await requestConfirmation({
      title: "Tem que deseja arquivar ticket?",
      description: "Todo o seu progresso será perdido!",
    });

    if (action === "confirmed") {
      await arquiveTicketMutation();
      setOpen(false);
    }
  };

  return (
    <Flex alignItems="center" w="full" justifyContent="space-between">
      <Flex gap="2">
        <Button
          onClick={async (e) => {
            await aproveTicketMutation();
            setOpen(false);
          }}
          disabled={etapa === "integracao-omie" || isAprovePending}
          variant="surface"
          shadow="xs"
          colorPalette="green"
          size="xs"
        >
          <Check /> Aprovar
        </Button>
        <Button
          disabled={
            etapa === "requisicao" ||
            etapa === "integracao-omie" ||
            isReprovePending
          }
          onClick={async (e) => {
            await reproveTicketMutation();
            setOpen(false);
          }}
          colorPalette="red"
          variant="surface"
          shadow="xs"
          size="xs"
        >
          <X /> Reprovar
        </Button>
        <Button
          disabled={isArquivePending}
          onClick={async (e) => {
            await handleArquiveTicket();
            setOpen(false);
          }}
          variant="surface"
          shadow="xs"
          size="xs"
        >
          <Trash /> Arquivar
        </Button>
      </Flex>
      <Button
        onClick={(e) => {
          setOpen(false);
        }}
        variant="surface"
        shadow="xs"
        size="xs"
      >
        Fechar
      </Button>
    </Flex>
  );
};
