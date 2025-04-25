import { api } from "../config/api";

const getListByCode = async ({ cod }) => {
  const { data } = await api.get(`/lista-omie/${cod}`);
  return data;
};

const getListas = async () => {
  const { data } = await api.get(`/lista-omie`);
  return data;
};

export const update = async ({ id }) => {
  return await api.put(`/lista-omie/sync-omie/${id}`);
};

export const ListaOmieService = {
  getListByCode,
  getListas,
  update,
};
