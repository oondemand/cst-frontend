import { api } from "../config/api";

const listarPrestadores = async ({ filters }) => {
  const { data } = await api.get("/prestadores", { params: filters });
  return data;
};

const obterPrestador = async ({ id }) => {
  const { data } = await api.get(`/prestadores/${id}`);
  return data;
};

const criarPrestador = async ({ body }) => {
  const { data } = await api.post("/prestadores", body);
  return data;
};

const atualizarPrestador = async ({ id, body }) => {
  const { data } = await api.patch(`/prestadores/${id}`, body);
  return data;
};

const importarPrestadores = async ({ files }) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }

  const response = await api.post(
    "/acoes-etapas/importar-prestadores",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

const enviarConvite = async ({ prestador }) => {
  return await api.post("/usuarios/enviar-convite", { prestador });
};

export const PrestadorService = {
  listarPrestadores,
  obterPrestador,
  criarPrestador,
  atualizarPrestador,
  importarPrestadores,
  enviarConvite,
};
