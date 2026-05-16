/**
 * Descrição: Componente React para buscar filmes por nome de ator e
 * apresentar os resultados em uma tabela.
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
import { ListByActorRequest, MovieRes } from "@/grpc/gen/movie_pb";
import { useMovie } from "../hooks/useMovies";

const listByActorSchema = z.object({
  actor: z.string().min(1, "Nome do ator é obrigatório"),
});

type FormInput = z.input<typeof listByActorSchema>;
type FormOutput = z.output<typeof listByActorSchema>;
/**
 * Retorna uma mensagem de erro amigável a partir de um erro recebido
 * @param error - Erro recebido da chamada ao servidor
 * @returns Mensagem de erro para exibir na UI
 */
function getListByActorErrorMessage(error: unknown) {
  if (error instanceof ConnectError) {
    return error.rawMessage || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível buscar os filmes.";
}

export default function ListByActorCard() {
  const { listByActor } = useMovie();
  const [movies, setMovies] = useState<MovieRes[]>([]);
  const [requestError, setRequestError] = useState<string | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(listByActorSchema),
    defaultValues: {
      actor: "",
    },
  });

  /**
   * Envia a requisição para listar filmes pelo nome do ator.
   * @param formValues - Valores vindos do formulário (contém `actor`)
   */
  async function onSubmit(formValues: FormOutput) {
    const movieData = new ListByActorRequest({
      actor: formValues.actor,
    });

    setRequestError(null);
    setMovies([]);

    try {
      const response = await listByActor(movieData);
      setMovies(response.movies);
      form.reset({ actor: formValues.actor });
    } catch (error) {
      setRequestError(getListByActorErrorMessage(error));
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Buscar Filmes por Ator</CardTitle>
        <CardDescription>
          Informe o nome de um ator para listar todos os filmes associados a
          ele.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="list-by-actor-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="actor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Ator</FieldLabel>
                <Input placeholder="Nome do ator" {...field} />
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
            <TableCaption>Filmes encontrados para este ator.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-35">ID</TableHead>
                <TableHead>Nome do Filme</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movieItem) => (
                <TableRow key={movieItem.id}>
                  <TableCell className="font-medium">{movieItem.id}</TableCell>
                  <TableCell>{movieItem.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardFooter>
      ) : (
        !requestError && (
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Nenhum filme carregado ainda.
            </p>
          </CardFooter>
        )
      )}
    </Card>
  );
}
