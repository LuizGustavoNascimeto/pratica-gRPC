/**
 * Descrição: Buscar e exibir filmes por gênero.
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListByGenreRequest, MovieRes } from "@/grpc/gen/movie_pb";
import { useMovie } from "../hooks/useMovies";

const listByGenreSchema = z.object({
  genre: z.string().min(1, "Gênero é obrigatório"),
});

type FormInput = z.input<typeof listByGenreSchema>;
type FormOutput = z.output<typeof listByGenreSchema>;

/**
 * Converte um erro em mensagem legível para a UI.
 * @param error - Erro recebido da chamada gRPC
 * @returns Mensagem de erro amigável
 */
function getListByGenreErrorMessage(error: unknown) {
  if (error instanceof ConnectError) {
    return error.rawMessage || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível buscar os filmes por gênero.";
}

export default function ListByGenreCard() {
  const { listByGenre } = useMovie();
  const [movies, setMovies] = useState<MovieRes[]>([]);
  const [requestError, setRequestError] = useState<string | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(listByGenreSchema),
    defaultValues: {
      genre: "",
    },
  });

  /**
   * Submete o formulário e busca filmes pelo gênero informado.
   * @param formValues - Objeto contendo `genre`
   */
  async function onSubmit(formValues: FormOutput) {
    const movieData = new ListByGenreRequest({ genre: formValues.genre });

    setRequestError(null);
    setMovies([]);

    try {
      const response = await listByGenre(movieData);
      setMovies(response.movies);
      form.reset({ genre: formValues.genre });
    } catch (error) {
      setRequestError(getListByGenreErrorMessage(error));
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Buscar Filmes por Gênero</CardTitle>
        <CardDescription>
          Informe o nome do gênero para listar todos os filmes associados a ele.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="list-by-genre-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="genre"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Gênero</FieldLabel>
                <Input placeholder="Nome do gênero" {...field} />
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
            {form.formState.isSubmitting ? "Buscando..." : "Buscar filmes"}
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

      {movies.length > 0 ? (
        <CardFooter>
          <Table>
            <TableCaption>Filmes encontrados para este gênero.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-35">ID</TableHead>
                <TableHead>Nome do Filme</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-medium">{movie.id}</TableCell>
                  <TableCell>{movie.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardFooter>
      ) : (
        !requestError && (
          <CardFooter>
            <p className="text-sm text-muted-foreground">Nenhum filme carregado ainda.</p>
          </CardFooter>
        )
      )}
    </Card>
  );
}
