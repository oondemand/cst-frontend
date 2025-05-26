import axios from "axios";

import { env } from "./env";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
});

api.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...req.headers,
    };
  }

  return req;
});

export const apiAssistant = axios.create({
  baseURL: env.VITE_DOC_CUSTOM_URL,
});

apiAssistant.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...req.headers,
    };
  }

  return req;
});

export const apiIntegracaoGPT = axios.create({
  baseURL: env.VITE_API_INTEGRACAO_GPT_URL,
});

apiIntegracaoGPT.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...req.headers,
    };
  }

  return req;
});
