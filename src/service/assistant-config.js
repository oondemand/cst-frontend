import { api } from "../config/api";

// const listarassistenteAtivas = async () => {
//   const { data } = await api.get("/assistente/ativas");
//   return data;
// };

const listarAssistenteConfig = async ({ filters }) => {
  const { data } = await api.get("/assistentes", { params: filters });
  return data;
};

const alterarAssistenteConfig = async ({ id, body }) => {
  const { data } = await api.put(`/assistentes/${id}`, body);
  return data;
};

const adicionarAssistenteConfig = async ({ body }) => {
  const { data } = await api.post("/assistentes", body);
  return data;
};

export const AssistantConfigService = {
  listarAssistenteConfig,
  alterarAssistenteConfig,
  adicionarAssistenteConfig,
  // listarassistenteAtivas,
};
