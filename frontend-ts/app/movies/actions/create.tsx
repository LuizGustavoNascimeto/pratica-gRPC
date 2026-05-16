"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConnectError } from "@bufbuild/connect";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { CreateMovieRequest, CreateMovieResponse } from "@/grpc/gen/movie_pb";
import { useState } from "react";
import { getMovieErrorMessage } from "../util/erroHandling";

const createMovieSchema = z.object({
  title: z.string().min(2, "Título muito curto"),
  year: z.coerce.number().min(1888, "O ano deve ser maior que 1888"),
  plot: z.string().min(10, "Plot muito curto"),
  genres: z.string().min(2, "Gênero muito curto"),
  cast: z.string().min(2, "Elenco muito curto"),
  directors: z.string().min(2, "Diretor muito curto"),
  rated: z.string().min(1, "Classificação muito curta"),
  runtime: z.coerce.number().min(1, "Duração muito curta"),
});
type FormInput = z.input<typeof createMovieSchema>;
type FormOutput = z.output<typeof createMovieSchema>;



export default function CreateMovieCard() {
  const { createMovie } = useMovie();
  const [last, setLast] = useState<CreateMovieResponse>();
  const [requestError, setRequestError] = useState<string | null>(null);

  // ✅ Three generics: <FieldValues, Context, TransformedValues>
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      plot: "",
      genres: "",
      cast: "",
      directors: "",
      rated: "",
      runtime: 0,
    },
  });

  // ✅ `data` is now correctly typed as FormOutput (year/runtime are `number`)
  async function onSubmit(data: FormOutput) {
    const movieData: CreateMovieRequest = new CreateMovieRequest({
      movie: {
        ...data,
        genres: data.genres.split(",").map((s) => s.trim()),
        cast: data.cast.split(",").map((s) => s.trim()),
        directors: data.directors.split(",").map((s) => s.trim()),
      },
    });
    setRequestError(null);

    try {
      const res = await createMovie(movieData);
      setLast(res);
      form.reset();
    } catch (error) {
      setRequestError(getMovieErrorMessage(error));
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Adicionar Filme</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para adicionar um novo filme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-movie-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Enviando..." : "Enviar"}
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
      {last?.movie && (
        <CardFooter className="flex flex-col items-start gap-4">
          <div>
            <h3 className="font-semibold">Último filme criado:</h3>
            <p className="text-sm text-muted-foreground">ID: {last.movie.id}</p>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <p>
              <strong>Título:</strong> {last.movie.title}
            </p>
            <p>
              <strong>Ano:</strong> {last.movie.year}
            </p>
            <p className="md:col-span-2">
              <strong>Plot:</strong> {last.movie.plot}
            </p>
            <p>
              <strong>Gêneros:</strong> {last.movie.genres.join(", ")}
            </p>
            <p>
              <strong>Elenco:</strong> {last.movie.cast.join(", ")}
            </p>
            <p>
              <strong>Diretores:</strong> {last.movie.directors.join(", ")}
            </p>
            <p>
              <strong>Classificação:</strong> {last.movie.rated}
            </p>
            <p>
              <strong>Duração:</strong> {last.movie.runtime} min
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
