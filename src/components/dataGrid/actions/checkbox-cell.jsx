import { Checkbox, Flex } from "@chakra-ui/react";
import { toaster } from "../../ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { TicketService } from "../../../service/ticket";
import { queryClient } from "../../../config/react-query";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { useUpdateServico } from "../../../hooks/api/servico/useUpdateServico";
import { ORIGENS } from "../../../constants/origens";

export const CheckActionCell = ({ ...props }) => {
  const { requestConfirmation } = useConfirmation();

  const checked = ["pendente", "processando"].includes(
    props.row.original.status
  );

  const colorPalletMaps = {
    aberto: "",
    pendente: "orange",
    processando: "purple",
  };

  const { mutateAsync: deleteServicoMutation } = useMutation({
    mutationFn: async ({ servicoId }) =>
      await TicketService.removerServico({ servicoId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["listar-servicos"]);
    },
    onError: ({}) => {
      toaster.create({
        title: "Ouve um erro inesperado ao realizar operação!",
        type: "error",
      });
    },
  });

  const updateServico = useUpdateServico({
    onSuccess: () => queryClient.invalidateQueries(["listar-servicos"]),
    origem: ORIGENS.PLANEJAMENTO,
  });

  const handleCheckChange = async (e) => {
    if (props.row.original.status === "processando") {
      const { action } = await requestConfirmation({
        title: "Tem certeza ?",
        description: "Essa operação ira remover o serviço do ticket.",
      });

      if (action === "confirmed") {
        return await deleteServicoMutation({
          servicoId: props.row.original._id,
        });
      }
    }

    if (props.row.original.status === "aberto") {
      return await updateServico.mutateAsync({
        id: props.row.original._id,
        body: { status: "pendente" },
      });
    }

    if (props.row.original.status === "pendente") {
      return await updateServico.mutateAsync({
        id: props.row.original._id,
        body: { status: "aberto" },
      });
    }
  };

  return (
    <Flex w="full" placeContent="center">
      <Checkbox.Root
        colorPalette={colorPalletMaps[props.row.original.status]}
        variant="subtle"
        checked={checked}
        onChange={handleCheckChange}
        disabled={updateServico.isPending}
        cursor="pointer"
        _disabled={{ cursor: "not-allowed" }}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
      </Checkbox.Root>
    </Flex>
  );
};
