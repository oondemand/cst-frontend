import { api } from "../config/api";

const listarEtapasAtivas = async () => {
  const { data } = await api.get("/etapas/ativas");
  return data;
};

const listarEtapas = async ({ filters }) => {
  const { data } = await api.get("/etapas", { params: filters });
  return data;
};

const alterarEtapa = async ({ id, body, origem }) => {
  const { data } = await api.put(`/etapas/${id}`, body, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const adicionarEtapa = async ({ body, origem }) => {
  const { data } = await api.post("/etapas", body, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const deletarEtapa = async ({ id, origem }) => {
  return await api.delete(`etapas/${id}`, {
    headers: {
      "x-origem": origem,
    },
  });
};

export const EtapaService = {
  listarEtapas,
  alterarEtapa,
  adicionarEtapa,
  listarEtapasAtivas,
  deletarEtapa,
};
