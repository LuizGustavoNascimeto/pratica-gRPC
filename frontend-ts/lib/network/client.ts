import { MovieService } from "@/grpc/gen/movie_connect";
import { transport } from "./transport";
import { createPromiseClient } from "@bufbuild/connect";
import { PingService } from "@/grpc/gen/ping_connect";

export const movieClient = createPromiseClient(MovieService, transport);
export const pingClient = createPromiseClient(PingService, transport);
