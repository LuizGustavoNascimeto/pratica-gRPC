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

  // GET MOVIE
  const getMovie = async (req: GetMovieRequest): Promise<GetMovieResponse> => {
    setLoading(true);
    try {
      const res = await movieClient.getMovie({ id: req.id });
      return res;
    } finally {
      setLoading(false);
    }
  };

  // LIST BY ACTOR
  const listByActor = async (
    req: ListByActorRequest,
  ): Promise<ListByActorResponse> => {
    setLoading(true);
    try {
      const res = await movieClient.listByActor({
        actor: req.actor ?? "",
      });

      setMovies(res.movies);
      return res;
    } finally {
      setLoading(false);
    }
  };

  //LIST BY GENRE
  const listByGenre = async (
    req: ListByGenreRequest,
  ): Promise<ListByGenreResponse> => {
    setLoading(true);
    try {
      const res = await movieClient.listByGenre({
        genre: req.genre ?? "",
      });

      setMovies(res.movies);
      return res;
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const createMovie = async (
    req: CreateMovieRequest,
  ): Promise<CreateMovieResponse> => {
    const res = await movieClient.createMovie({ movie: req.movie });
    return res;
  };

  // UPDATE
  const updateMovie = async (
    req: UpdateMovieRequest,
  ): Promise<UpdateMovieResponse> => {
    const res = await movieClient.updateMovie({ id: req.id, movie: req.movie });
    return res;
  };

  // DELETE
  const deleteMovie = async (
    req: DeleteMovieRequest,
  ): Promise<DeleteMovieResponse> => {
    const res = await movieClient.deleteMovie({ id: req.id });
    return res;
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
