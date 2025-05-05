import { apiIntegracaoGPT } from "../config/api";

const askQuestion = ({ body }) => {
  const formData = new FormData();

  for (const key in body) {
    if (key === "prompts") {
      formData.append("prompts", JSON.stringify(body[key]));
      continue;
    }

    formData.append(key, body[key]);
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
