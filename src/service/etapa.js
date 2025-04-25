import { api } from "../config/api";

const listarEtapas = async () => {
  const { data } = await api.get("/etapas/ativas");
  return data;
};

const alterarEtapa = async ({ id, body }) => {
  const { data } = await api.put(`/etapas/${id}`, body);
  return data;
};

const adicionarEtapa = async ({ body }) => {
  const { data } = await api.post("/etapas", body);
  return data;
};

export const EtapaService = {
  listarEtapas,
  alterarEtapa,
  adicionarEtapa,
};
