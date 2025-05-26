import { apiAssistant } from "../config/api";

const listAssistant = async () => {
  const { data } = await apiAssistant.get("/cst/assistentes");
  return data;
};

const getAssistant = async ({ id }) => {
  const { data } = await apiAssistant.get(
    `/cst/assistentes/prompts?assistente=${id}`
  );
  return data;
};

export const AssistantService = {
  listAssistant,
  getAssistant,
};
