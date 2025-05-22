import { api } from "../config/api";

const adicionarTicket = async ({ body, origem }) => {
  const response = await api.post("tickets", body, {
    headers: {
      "x-origem": origem,
    },
  });
  return response.data;
};

const alterarTicket = async ({ id, body, origem }) => {
  const response = await api.patch(`tickets/${id}`, body, {
    headers: {
      "x-origem": origem,
    },
  });
  return response.data;
};

const carregarTicket = async (id) => {
  const response = await api.get(`tickets/${id}`);
  return response.data;
};

const listarTickets = async (filtro) => {
  const { data } = await api.get("/tickets", { params: filtro });
  return data;
};

const aprovarTicket = async ({ id }) => {
  const response = await api.post(`/aprovacoes/${id}/aprovar`);
  return response.data;
};

const reprovarTicket = async ({ id }) => {
  const response = await api.post(`/aprovacoes/${id}/recusar`);
  return response.data;
};

const uploadFiles = async ({ ticketId, files }) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("arquivos", file);
  }

  return await api.post(`/tickets/${ticketId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteFile = async ({ id, ticketId }) => {
  return await api.delete(`/tickets/arquivo/${ticketId}/${id}`);
};

const arquivarTicket = async ({ id, origem }) => {
  return await api.post(
    `/tickets/arquivar/${id}`,
    {},
    {
      headers: {
        "x-origem": origem,
      },
    }
  );
};

const getFile = async ({ id }) => {
  return await api.get(`/tickets/arquivo/${id}`);
};

const adicionarServico = async ({ ticketId, servicoId }) => {
  const { data } = await api.post(
    `/tickets/adicionar-servico/${ticketId}/${servicoId}`
  );

  return data;
};

const removerServico = async ({ servicoId }) => {
  const { data } = await api.post(`/tickets/remover-servico/${servicoId}`);
  return data;
};

const adicionarDocumentoFiscal = async ({ ticketId, documentoFiscalId }) => {
  const { data } = await api.post(
    `/tickets/adicionar-documento-fiscal/${ticketId}/${documentoFiscalId}`
  );

  return data;
};

const removerDocumentoFiscal = async ({ documentoFiscalId }) => {
  const { data } = await api.post(
    `/tickets/remover-documento-fiscal/${documentoFiscalId}`
  );
  return data;
};

const listarTicketsArquivados = async ({ filters }) => {
  const { data } = await api.get("tickets/arquivados", { params: filters });
  return data;
};

const listarTicketsPagos = async ({ filters }) => {
  const { data } = await api.get("tickets/pagos", { params: filters });
  return data;
};

export const TicketService = {
  listarTickets,
  adicionarTicket,
  alterarTicket,
  arquivarTicket,
  aprovarTicket,
  reprovarTicket,
  deleteFile,
  uploadFiles,
  getFile,
  removerServico,
  adicionarServico,
  listarTicketsArquivados,
  listarTicketsPagos,
  adicionarDocumentoFiscal,
  removerDocumentoFiscal,
  carregarTicket,
};
