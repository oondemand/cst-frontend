import { api } from "../config/api";

const listarDocumentosFiscais = async ({ filters }) => {
  const { data } = await api.get("/documentos-fiscais", { params: filters });
  return data;
};

const listarDocumentosFiscaisPorPrestador = async ({
  prestadorId,
  dataRegistro,
}) => {
  const { data } = await api.get(
    `/documentos-fiscais/prestador/${prestadorId}?dataRegistro=${dataRegistro}`
  );
  return data;
};

const criarDocumentoFiscal = async ({ body, origem }) => {
  const { data } = await api.post("/documentos-fiscais", body, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const atualizarDocumentoFiscal = async ({ id, body, origem }) => {
  const { data } = await api.patch(`/documentos-fiscais/${id}`, body, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const reprovarDocumentoFiscal = async ({ id, body, origem }) => {
  const { data } = await api.post(
    `/documentos-fiscais/reprovar-documento/${id}`,
    body,
    {
      headers: {
        "x-origem": origem,
      },
    }
  );
  return data;
};

const deletarDocumentoFiscal = async ({ id, origem }) => {
  const { data } = await api.delete(`/documentos-fiscais/${id}`, {
    headers: {
      "x-origem": origem,
    },
  });
  return data;
};

const deleteFile = async ({ id, documentoFiscalId }) => {
  return await api.delete(
    `/documentos-fiscais/excluir-arquivo/${documentoFiscalId}/${id}`
  );
};

const anexarArquivo = async ({ file, id }) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/documentos-fiscais/anexar-arquivo/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

const importarDocumentosFiscais = async ({ files }) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }

  const response = await api.post("/documentos-fiscais/importar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const aprovarDocumentoFiscal = async ({ body, origem }) => {
  const { data } = await api.post(
    `/documentos-fiscais/aprovar-documento`,
    body,
    { headers: { "x-origem": origem } }
  );
  return data;
};

export const DocumentosFiscaisService = {
  listarDocumentosFiscais,
  criarDocumentoFiscal,
  atualizarDocumentoFiscal,
  deletarDocumentoFiscal,
  listarDocumentosFiscaisPorPrestador,
  anexarArquivo,
  deleteFile,
  importarDocumentosFiscais,
  aprovarDocumentoFiscal,
  reprovarDocumentoFiscal,
};
