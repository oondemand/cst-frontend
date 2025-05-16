import { api } from "../config/api";

const listarDocumentosCadastrais = async ({ filters }) => {
  const { data } = await api.get("/documentos-cadastrais", { params: filters });
  return data;
};

const listarDocumentosCadastraisPorPrestador = async ({
  prestadorId,
  dataRegistro,
}) => {
  const { data } = await api.get(
    `/documentos-cadastrais/prestador/${prestadorId}?dataRegistro=${dataRegistro}`
  );
  return data;
};

const criarDocumentoCadastral = async ({ body }) => {
  const { data } = await api.post("/documentos-cadastrais", body);
  return data;
};

const atualizarDocumentoCadastral = async ({ id, body }) => {
  const { data } = await api.patch(`/documentos-cadastrais/${id}`, body);
  return data;
};

const atualizarStatus = async ({ ids, status }) => {
  const { data } = await api.patch(`/documentos-cadastrais`, { ids, status });
  return data;
};

const deletarDocumentoCadastral = async ({ id }) => {
  const { data } = await api.delete(`/documentos-cadastrais/${id}`);
  return data;
};

const deleteFile = async ({ id, documentoCadastralId }) => {
  return await api.delete(
    `/documentos-cadastrais/excluir-arquivo/${documentoCadastralId}/${id}`
  );
};

const anexarArquivo = async ({ file, id }) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/documentos-cadastrais/anexar-arquivo/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

const importarDocumentosCadastrais = async ({ files }) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }

  const response = await api.post("/documentos-cadastrais/importar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const aprovarDocumentoCadastral = async ({ body }) => {
  const { data } = await api.post(
    `/documentos-cadastrais/aprovar-documento`,
    body
  );
  return data;
};

export const DocumentosCadastraisService = {
  listarDocumentosCadastrais,
  criarDocumentoCadastral,
  atualizarDocumentoCadastral,
  deletarDocumentoCadastral,
  listarDocumentosCadastraisPorPrestador,
  atualizarStatus,
  anexarArquivo,
  deleteFile,
  importarDocumentosCadastrais,
  aprovarDocumentoCadastral,
};
