import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { UsuarioService } from "../../../service/usuario";

export const useCreateUsuario = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ body }) =>
      await UsuarioService.adicionarUsuario({ body }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Usuário criado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao criar um usuário",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
