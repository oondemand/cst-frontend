import { apiIntegracaoGPT } from "../config/api";

const askQuestion = ({ body }) => {
  const formData = new FormData();

  for (const key in body) {
    formData.append(key, JSON.stringify(body[key]));
  }

  return apiIntegracaoGPT.post(`/integracao/cst/question`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const IntegrationGptService = {
  askQuestion,
};
