import { ConnectError } from "@bufbuild/connect";

export function getMovieErrorMessage(error: unknown) {
  if (error instanceof ConnectError) {
    return error.rawMessage || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível criar o filme.";
}
