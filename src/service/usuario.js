import { api } from "../config/api";

const adicionarUsuario = async ({ body, origem }) => {
  const { data } = await api.post("/usuarios", body, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const alterarUsuario = async ({ id, body, origem }) => {
  const { data } = await api.put(`/usuarios/${id}`, body, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const excluirUsuario = async ({ id, origem }) => {
  return await api.delete(`/usuarios/${id}`, {
    headers: {
      "x-origem": origem,
    },
  });
};

const listarUsuarios = async ({ filters }) => {
  const { data } = await api.get("/usuarios", { params: filters });
  return data;
};

const enviarConvite = async ({ userId }) => {
  const { data } = await api.post("/usuarios/enviar-convite", { userId });
  return data;
};

export const UsuarioService = {
  adicionarUsuario,
  alterarUsuario,
  excluirUsuario,
  listarUsuarios,
  enviarConvite,
};
