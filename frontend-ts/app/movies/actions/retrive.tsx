/**
 * Descrição: Componente para recuperar (buscar) um filme por ID.
 * Autor: Nome do Aluno
 * Data de criação: 2026-05-16
 * Última atualização: 2026-05-16
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConnectError } from "@bufbuild/connect";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMovie } from "../hooks/useMovies";
import { Button } from "@/components/ui/button";
import { GetMovieRequest, GetMovieResponse } from "@/grpc/gen/movie_pb";
import { useState } from "react";
import { getMovieErrorMessage } from "../util/erroHandling";

const getMovieSchema = z.object({
  id: z.string().min(1, "ID do filme é obrigatório"),
});

type FormInput = z.input<typeof getMovieSchema>;
type FormOutput = z.output<typeof getMovieSchema>;

/**
 * Componente `RetrieveMovieCard` — formulário para buscar filme por ID.
 */
export default function RetrieveMovieCard() {
  const { getMovie } = useMovie();
  const [retrievedMovie, setRetrievedMovie] = useState<GetMovieResponse>();
  const [requestError, setRequestError] = useState<string | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(getMovieSchema),
    defaultValues: {
      id: "",
    },
  });

  /**
   * Envia requisição para recuperar um filme por ID.
   * @param formValues - Objeto com `id` do filme
   */
  async function onSubmit(formValues: FormOutput) {
    const movieData: GetMovieRequest = new GetMovieRequest({ id: formValues.id });
    setRequestError(null);
    setRetrievedMovie(undefined);

    try {
      const response = await getMovie(movieData);
      setRetrievedMovie(response);
      form.reset();
    } catch (error) {
      setRequestError(getMovieErrorMessage(error));
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Buscar Filme</CardTitle>
        <CardDescription>
          Digite o ID do filme que você deseja buscar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="retrieve-movie-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>ID do Filme</FieldLabel>
                <Input placeholder="ID do filme" {...field} />
                {fieldState.invalid && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Buscando..." : "Buscar"}
          </Button>
        </form>
      </CardContent>
      {requestError && (
        <CardFooter>
          <div className="w-full rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {requestError}
          </div>
        </CardFooter>
      )}
      {retrievedMovie?.movie && (
        <CardFooter className="flex flex-col items-start gap-4">
          <div>
            <h3 className="font-semibold">Filme encontrado:</h3>
            <p className="text-sm text-muted-foreground">
              ID: {retrievedMovie.movie.id}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <p>
              <strong>Título:</strong> {retrievedMovie.movie.title}
            </p>
            <p>
              <strong>Ano:</strong> {retrievedMovie.movie.year}
            </p>
            <p className="md:col-span-2">
              <strong>Plot:</strong> {retrievedMovie.movie.plot}
            </p>
            <p>
              <strong>Gêneros:</strong> {retrievedMovie.movie.genres.join(", ")}
            </p>
            <p>
              <strong>Elenco:</strong> {retrievedMovie.movie.cast.join(", ")}
            </p>
            <p>
              <strong>Diretores:</strong>{" "}
              {retrievedMovie.movie.directors.join(", ")}
            </p>
            <p>
              <strong>Classificação:</strong> {retrievedMovie.movie.rated}
            </p>
            <p>
              <strong>Duração:</strong> {retrievedMovie.movie.runtime} min
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
