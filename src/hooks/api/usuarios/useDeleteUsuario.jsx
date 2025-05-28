import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { UsuarioService } from "../../../service/usuario";

export const useDeleteUsuario = ({ origem, onSuccess }) =>
  useMutation({
    mutationFn: async ({ id }) =>
      await UsuarioService.excluirUsuario({ id, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Usuario excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir usuario",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
