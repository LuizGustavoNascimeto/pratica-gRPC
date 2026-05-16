/**
 * Descrição: Componente para excluir um filme a partir do seu ID.
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
import { DeleteMovieRequest, DeleteMovieResponse } from "@/grpc/gen/movie_pb";
import { useMovie } from "../hooks/useMovies";
import { getMovieErrorMessage } from "../util/erroHandling";

const deleteMovieSchema = z.object({
  id: z.string().min(1, "ID do filme é obrigatório"),
});

type FormInput = z.input<typeof deleteMovieSchema>;
type FormOutput = z.output<typeof deleteMovieSchema>;

/**
 * Componente `DeleteMovieCard` — formulário para deletar um filme por ID.
 */
export default function DeleteMovieCard() {
  const { deleteMovie } = useMovie();
  const [deletedMovie, setDeletedMovie] = useState<DeleteMovieResponse>();
  const [requestError, setRequestError] = useState<string | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(deleteMovieSchema),
    defaultValues: {
      id: "",
    },
  });

  /**
   * Envia requisição para excluir um filme.
   * @param formValues - Objeto contendo `id` do filme a excluir
   */
  async function onSubmit(formValues: FormOutput) {
    const movieData = new DeleteMovieRequest({ id: formValues.id });

    setRequestError(null);
    setDeletedMovie(undefined);

    try {
      const response = await deleteMovie(movieData);
      setDeletedMovie(response);
      form.reset();
    } catch (error) {
      setRequestError(getMovieErrorMessage(error));
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Excluir Filme</CardTitle>
        <CardDescription>
          Digite o ID do filme que você deseja excluir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="delete-movie-form"
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
            variant="destructive"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Excluindo..." : "Excluir"}
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
      {deletedMovie?.success && (
        <CardFooter>
          <div className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            Filme excluído com sucesso.
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
