/**
 * Descrição: Configuração do transporte Connect para comunicação gRPC-Web/HTTP
 * Autor: Nome do Aluno
 * Data de criação: 2026-05-16
 * Última atualização: 2026-05-16
 */

import { createConnectTransport } from "@bufbuild/connect-web";

export const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
});
