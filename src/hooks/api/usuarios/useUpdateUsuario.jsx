import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { UsuarioService } from "../../../service/usuario";

export const useUpdateUsuario = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ id, body }) =>
      await UsuarioService.alterarUsuario({ body, id }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Usuario atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao atualizar o usuário",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
