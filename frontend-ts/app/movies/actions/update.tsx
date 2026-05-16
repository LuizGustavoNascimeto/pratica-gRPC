/**
 * Descrição: Formulário para atualizar dados de um filme existente.
 * Autor: Nome do Aluno
 * Data de criação: 2026-05-16
 * Última atualização: 2026-05-16
 */

"use client";

import { ConnectError } from "@bufbuild/connect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  GetMovieRequest,
  GetMovieResponse,
  UpdateMovieRequest,
  UpdateMovieResponse,
} from "@/grpc/gen/movie_pb";
import { useMovie } from "../hooks/useMovies";

const updateMovieSchema = z.object({
  id: z.string().min(1, "ID do filme é obrigatório"),
  title: z.string().min(2, "Título muito curto"),
  year: z.coerce.number().min(1888, "O ano deve ser maior que 1888"),
  plot: z.string().min(10, "Plot muito curto"),
  genres: z.string().min(2, "Gênero muito curto"),
  cast: z.string().min(2, "Elenco muito curto"),
  directors: z.string().min(2, "Diretor muito curto"),
  rated: z.string().min(1, "Classificação muito curta"),
  runtime: z.coerce.number().min(1, "Duração muito curta"),
});

type FormInput = z.input<typeof updateMovieSchema>;
type FormOutput = z.output<typeof updateMovieSchema>;

const defaultValues: FormInput = {
  id: "",
  title: "",
  year: new Date().getFullYear(),
  plot: "",
  genres: "",
  cast: "",
  directors: "",
  rated: "",
  runtime: 0,
};

/**
 * Converte um erro em mensagem legível para a UI ao atualizar filme.
 * @param error - Erro recebido
 */
function getUpdateMovieErrorMessage(error: unknown) {
  if (error instanceof ConnectError) {
    return error.rawMessage || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível atualizar o filme.";
}

/**
 * Normaliza os valores de `GetMovieResponse.movie` para os campos do formulário.
 * @param movie - Objeto de filme retornado pelo servidor
 */
function normalizeMovieValues(
  movie: NonNullable<GetMovieResponse["movie"]>,
): FormInput {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    plot: movie.plot,
    genres: movie.genres.join(", "),
    cast: movie.cast.join(", "),
    directors: movie.directors.join(", "),
    rated: movie.rated,
    runtime: movie.runtime,
  };
}

/**
 * Componente `UpdateMovieCard` — permite carregar e atualizar um filme.
 */
export default function UpdateMovieCard() {
  const { getMovie, updateMovie } = useMovie();
  const [fetchedMovie, setFetchedMovie] = useState<GetMovieResponse>();
  const [requestError, setRequestError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFetchingMovie, setIsFetchingMovie] = useState(false);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(updateMovieSchema),
    defaultValues,
  });

  /**
   * Busca os dados do filme pelo ID informado e popula o formulário.
   */
  async function handleFetchMovie() {
    const movieId = form.getValues("id").trim();

    if (!movieId) {
      form.setError("id", {
        type: "manual",
        message: "ID do filme é obrigatório",
      });
      return;
    }

    setIsFetchingMovie(true);
    setRequestError(null);
    setSuccessMessage(null);

    try {
      const response = await getMovie(new GetMovieRequest({ id: movieId }));

      if (!response.movie) {
        setFetchedMovie(undefined);
        setRequestError("Filme não encontrado.");
        form.reset({ ...defaultValues, id: movieId });
        return;
      }

      const values = normalizeMovieValues(response.movie);
      setFetchedMovie(response);
      form.reset(values);
    } catch (error) {
      setFetchedMovie(undefined);
      setRequestError(getUpdateMovieErrorMessage(error));
      form.reset({ ...defaultValues, id: movieId });
      console.error(error);
    } finally {
      setIsFetchingMovie(false);
    }
  }

  /**
   * Envia a requisição de atualização do filme.
   * @param data - Valores validados do formulário
   */
  async function onSubmit(data: FormOutput) {
    setRequestError(null);
    setSuccessMessage(null);

    const movieData = new UpdateMovieRequest({
      id: data.id,
      movie: {
        title: data.title,
        year: data.year,
        plot: data.plot,
        genres: data.genres.split(",").map((value) => value.trim()),
        cast: data.cast.split(",").map((value) => value.trim()),
        directors: data.directors.split(",").map((value) => value.trim()),
        rated: data.rated,
        runtime: data.runtime,
      },
    });
    console.log("Dados para atualização:", movieData);

    try {
      const response: UpdateMovieResponse = await updateMovie(movieData);
      if (response.movie) {
        setFetchedMovie(new GetMovieResponse({ movie: response.movie }));
        form.reset(normalizeMovieValues(response.movie));
      }
      setSuccessMessage("Filme atualizado com sucesso.");
    } catch (error) {
      setRequestError(getUpdateMovieErrorMessage(error));
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Atualizar Filme</CardTitle>
        <CardDescription>
          Informe o ID para carregar os dados atuais e editar apenas o que
          quiser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="update-movie-form"
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
            type="button"
            variant="secondary"
            className="w-full"
            disabled={isFetchingMovie}
            onClick={handleFetchMovie}
          >
            {isFetchingMovie ? "Carregando..." : "Carregar dados"}
          </Button>

          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Título</FieldLabel>
                  <Input placeholder="Título do filme" {...field} />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="year"
              control={form.control}
              render={({ field: { value, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Ano</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Ano"
                    value={value as number}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Controller
            name="plot"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Plot</FieldLabel>
                <Input placeholder="Plot do filme" {...field} />
                {fieldState.invalid && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />

          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="genres"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Gêneros</FieldLabel>
                  <Input
                    placeholder="Ação, Drama (separado por vírgula)"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="cast"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Elenco</FieldLabel>
                  <Input
                    placeholder="Ator 1, Atriz 2 (separado por vírgula)"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Controller
              name="directors"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Diretores</FieldLabel>
                  <Input
                    placeholder="Diretor 1 (separado por vírgula)"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="rated"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Classificação</FieldLabel>
                  <Input placeholder="Ex: PG-13" {...field} />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="runtime"
              control={form.control}
              render={({ field: { value, ...field }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Duração (min)</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Duração em minutos"
                    value={value as number}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting || !fetchedMovie?.movie}
          >
            {form.formState.isSubmitting ? "Atualizando..." : "Atualizar"}
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

      {successMessage && (
        <CardFooter>
          <div className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        </CardFooter>
      )}

      {fetchedMovie?.movie && (
        <CardFooter className="flex flex-col items-start gap-4">
          <div>
            <h3 className="font-semibold">Filme carregado para edição:</h3>
            <p className="text-sm text-muted-foreground">
              ID: {fetchedMovie.movie.id}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <p>
              <strong>Título:</strong> {fetchedMovie.movie.title}
            </p>
            <p>
              <strong>Ano:</strong> {fetchedMovie.movie.year}
            </p>
            <p className="md:col-span-2">
              <strong>Plot:</strong> {fetchedMovie.movie.plot}
            </p>
            <p>
              <strong>Gêneros:</strong> {fetchedMovie.movie.genres.join(", ")}
            </p>
            <p>
              <strong>Elenco:</strong> {fetchedMovie.movie.cast.join(", ")}
            </p>
            <p>
              <strong>Diretores:</strong>{" "}
              {fetchedMovie.movie.directors.join(", ")}
            </p>
            <p>
              <strong>Classificação:</strong> {fetchedMovie.movie.rated}
            </p>
            <p>
              <strong>Duração:</strong> {fetchedMovie.movie.runtime} min
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
