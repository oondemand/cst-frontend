import { api } from "../config/api";

const listarAssistenteAtivos = async () => {
  const { data } = await api.get("/assistentes/ativos");
  return data;
};

const listarAssistenteConfig = async ({ filters }) => {
  const { data } = await api.get("/assistentes", { params: filters });
  return data;
};

const alterarAssistenteConfig = async ({ id, body, origem }) => {
  const { data } = await api.put(`/assistentes/${id}`, body, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const adicionarAssistenteConfig = async ({ body, origem }) => {
  const { data } = await api.post("/assistentes", body, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const deleteAssistantConfig = async ({ id, origem }) => {
  return await api.delete(`assistentes/${id}`, {
    headers: {
      "x-origem": origem,
    },
  });
};

export const AssistantConfigService = {
  listarAssistenteConfig,
  alterarAssistenteConfig,
  adicionarAssistenteConfig,
  listarAssistenteAtivos,
  deleteAssistantConfig,
};
