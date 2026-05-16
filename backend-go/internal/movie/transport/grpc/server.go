package handler

import (
	"context"
	"fmt"
	"rpc/internal/movie/service"

	moviepb "rpc/internal/movie/proto/moviepb"

	"connectrpc.com/connect"
)

type Server struct {
	service *service.Service
	moviepb.UnimplementedMovieServiceServer
}

func NewServer(service *service.Service) *Server {
	return &Server{
		service: service,
	}
}

func (s *Server) CreateMovie(
	ctx context.Context,
	req *connect.Request[moviepb.CreateMovieRequest],
) (*connect.Response[moviepb.CreateMovieResponse], error) {

	movie, err := s.service.CreateMovie(
		ctx,
		ToModel(req.Msg.Movie),
	)

	if err != nil {
		return nil, err
	}

	res := connect.NewResponse(
		&moviepb.CreateMovieResponse{
			Movie: ToProto(movie),
		},
	)

	fmt.Printf("Created movie id: %v\n", res.Msg.Movie.Id)

	return res, nil
}

func (s *Server) GetMovie(
	ctx context.Context,
	req *connect.Request[moviepb.GetMovieRequest],
) (*connect.Response[moviepb.GetMovieResponse], error) {
	movie, err := s.service.GetMovie(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}
	res := connect.NewResponse(&moviepb.GetMovieResponse{
		Movie: ToProto(movie),
	})
	return res, nil
}

func (s *Server) UpdateMovie(
	ctx context.Context,
	req *connect.Request[moviepb.UpdateMovieRequest],
) (*connect.Response[moviepb.UpdateMovieResponse], error) {
	movie, err := s.service.UpdateMovie(ctx, req.Msg.Id, ToModel(req.Msg.Movie))
	if err != nil {
		return nil, err
	}
	res := connect.NewResponse(&moviepb.UpdateMovieResponse{
		Movie: ToProto(movie),
	})
	return res, nil
}

func (s *Server) DeleteMovie(
	ctx context.Context,
	req *connect.Request[moviepb.DeleteMovieRequest],
) (*connect.Response[moviepb.DeleteMovieResponse], error) {
	success, err := s.service.DeleteMovie(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}
	res := connect.NewResponse(&moviepb.DeleteMovieResponse{
		Success: success,
	})
	return res, nil
}

func (s *Server) ListByActor(
	ctx context.Context,
	req *connect.Request[moviepb.ListByActorRequest],
) (*connect.Response[moviepb.ListByActorResponse], error) {
	movies, err := s.service.ListMoviesByActor(ctx, req.Msg.Actor)
	if err != nil {
		return nil, err
	}
	var movieResponses []*moviepb.MovieRes
	for _, movie := range movies {
		movieResponses = append(movieResponses, ToProto(movie))
	}
	res := connect.NewResponse(&moviepb.ListByActorResponse{
		Movies: movieResponses,
	})
	return res, nil
}

func (s *Server) ListByGenre(
	ctx context.Context,
	req *connect.Request[moviepb.ListByGenreRequest],
) (*connect.Response[moviepb.ListByGenreResponse], error) {
	movies, err := s.service.ListMoviesByGenre(ctx, req.Msg.Genre)
	if err != nil {
		return nil, err
	}
	var movieResponses []*moviepb.MovieRes
	for _, movie := range movies {
		movieResponses = append(movieResponses, ToProto(movie))
	}
	res := connect.NewResponse(&moviepb.ListByGenreResponse{
		Movies: movieResponses,
	})
	return res, nil
}
