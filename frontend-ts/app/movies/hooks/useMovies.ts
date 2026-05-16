/**
 * Descrição: Hook que encapsula chamadas gRPC relacionadas a filmes.
 * Autor: Nome do Aluno
 * Data de criação: 2026-05-16
 * Última atualização: 2026-05-16
 */

"use client";

import type {
  CreateMovieRequest,
  CreateMovieResponse,
  DeleteMovieRequest,
  DeleteMovieResponse,
  ListByActorRequest,
  ListByActorResponse,
  ListByGenreRequest,
  ListByGenreResponse,
  MovieRes,
  UpdateMovieRequest,
  UpdateMovieResponse,
  GetMovieRequest,
  GetMovieResponse,
} from "@/grpc/gen/movie_pb";
import { movieClient } from "@/lib/network/client";
import { useState } from "react";

export function useMovie() {
  const [movies, setMovies] = useState<MovieRes[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Busca um filme por ID.
   * @param req - `GetMovieRequest` com o campo `id`
   * @returns `GetMovieResponse` do servidor
   */
  const getMovie = async (req: GetMovieRequest): Promise<GetMovieResponse> => {
    setLoading(true);
    try {
      const response = await movieClient.getMovie({ id: req.id });
      return response;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lista filmes por ator e atualiza o estado local `movies`.
   * @param req - `ListByActorRequest` com `actor`
   */
  const listByActor = async (
    req: ListByActorRequest,
  ): Promise<ListByActorResponse> => {
    setLoading(true);
    try {
      const response = await movieClient.listByActor({
        actor: req.actor ?? "",
      });

      setMovies(response.movies);
      return response;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lista filmes por gênero e atualiza `movies`.
   */
  const listByGenre = async (
    req: ListByGenreRequest,
  ): Promise<ListByGenreResponse> => {
    setLoading(true);
    try {
      const response = await movieClient.listByGenre({
        genre: req.genre ?? "",
      });

      setMovies(response.movies);
      return response;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cria um novo filme no servidor.
   */
  const createMovie = async (
    req: CreateMovieRequest,
  ): Promise<CreateMovieResponse> => {
    const response = await movieClient.createMovie({ movie: req.movie });
    return response;
  };

  /**
   * Atualiza um filme existente.
   */
  const updateMovie = async (
    req: UpdateMovieRequest,
  ): Promise<UpdateMovieResponse> => {
    const response = await movieClient.updateMovie({ id: req.id, movie: req.movie });
    return response;
  };

  /**
   * Exclui um filme por ID.
   */
  const deleteMovie = async (
    req: DeleteMovieRequest,
  ): Promise<DeleteMovieResponse> => {
    const response = await movieClient.deleteMovie({ id: req.id });
    return response;
  };

  return {
    movies,
    loading,
    getMovie,
    listByActor,
    listByGenre,
    createMovie,
    updateMovie,
    deleteMovie,
  };
}
