import { api } from "../config/api";
import { ORIGENS } from "../constants/origens";

const listarPrestadores = async ({ filters }) => {
  const { data } = await api.get("/prestadores", { params: filters });
  return data;
};

const obterPrestador = async ({ id }) => {
  const { data } = await api.get(`/prestadores/${id}`);
  return data;
};

const criarPrestador = async ({ body, origem }) => {
  const { data } = await api.post("/prestadores", body, {
    headers: { "x-origem": origem || ORIGENS.FORM },
  });

  return data;
};

const atualizarPrestador = async ({ id, body, origem }) => {
  const { data } = await api.patch(`/prestadores/${id}`, body, {
    headers: { "x-origem": origem },
  });
  return data;
};

const importarPrestadores = async ({ files, origem }) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }

  const response = await api.post("/prestadores/importar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-origem": origem,
    },
  });

  return response;
};

const enviarConvite = async ({ prestador, origem }) => {
  return await api.post(
    "/usuarios/enviar-convite",
    { prestador },
    {
      headers: {
        "x-origem": origem,
      },
    }
  );
};

export const PrestadorService = {
  listarPrestadores,
  obterPrestador,
  criarPrestador,
  atualizarPrestador,
  importarPrestadores,
  enviarConvite,
};
