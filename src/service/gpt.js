import { apiIntegracaoGPT } from "../config/api";

const askQuestion = ({ body }) => {
  const formData = new FormData();

  for (const key in body) {
    formData.append(key, JSON.stringify(body[key]));
  }

  console.log("LOG", body);

  return apiIntegracaoGPT.post(`/integracao/cst/question`, body);
};

export const IntegrationGptService = {
  askQuestion,
};
