import { ConnectError } from "@bufbuild/connect";

/**
 * Descrição: Helpers para tratar mensagens de erro vindas do cliente gRPC
 * Autor: Nome do Aluno
 * Data de criação: 2026-05-16
 * Última atualização: 2026-05-16
 */

/**
 * Converte um erro em mensagem amigável para operações de filmes.
 * @param error - Erro recebido (pode ser ConnectError)
 * @returns Mensagem de erro legível
 */
export function getMovieErrorMessage(error: unknown) {
  if (error instanceof ConnectError) {
    return error.rawMessage || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível criar o filme.";
}
