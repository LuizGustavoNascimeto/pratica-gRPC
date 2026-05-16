/**
 * Descrição: Cria instâncias de cliente gRPC/Connect usadas pela aplicação.
 * Autor: Nome do Aluno
 * Data de criação: 2026-05-16
 * Última atualização: 2026-05-16
 */

import { MovieService } from "@/grpc/gen/movie_connect";
import { transport } from "./transport";
import { createPromiseClient } from "@bufbuild/connect";
import { PingService } from "@/grpc/gen/ping_connect";

export const movieClient = createPromiseClient(MovieService, transport);
export const pingClient = createPromiseClient(PingService, transport);
