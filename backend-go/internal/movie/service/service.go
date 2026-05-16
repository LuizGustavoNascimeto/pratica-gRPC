// ============================================================================
// FILE: service.go
// DESCRIPTION: Camada de lógica de negócio - orquestra operações de filme
//
//	entre os clientes e o repositório de dados
//
// AUTHOR: Equipe
// CREATED: 2024-01-01
// UPDATED: 2026-05-08
// ============================================================================
package service

import (
	"context"
	"rpc/internal/movie/domain"
	"rpc/internal/movie/repository"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Service struct {
	repo *repository.Repository
}

func NewService(repo *repository.Repository) *Service {
	// NewService: Inicializa serviço com referência ao repositório
	// Parâmetros: repo (*repository.Repository) - repositório de dados
	// Retorno: (*Service) - serviço inicializado
	return &Service{
		repo: repo,
	}
}

func (s *Service) CreateMovie(ctx context.Context, movie *domain.MovieModel) (*domain.MovieModel, error) {
	// CreateMovie: Cria novo filme no banco de dados
	// Parâmetros: ctx (context.Context) - contexto, movie (*domain.MovieModel) - dados do filme
	// Retorno: (*domain.MovieModel, error) - filme criado ou erro
	inserted, err := s.repo.Create(ctx, movie)
	if err != nil {
		return nil, err
	}
	movie.ID = inserted.InsertedID.(bson.ObjectID)
	return movie, nil
}

func (s *Service) GetMovie(ctx context.Context, id string) (*domain.MovieModel, error) {
	// GetMovie: Recupera filme por ID
	// Parâmetros: ctx (context.Context) - contexto, id (string) - ObjectID
	// Retorno: (*domain.MovieModel, error) - filme encontrado ou erro
	movie, err := s.repo.Read(ctx, id)
	if err != nil {
		return nil, err
	}
	return movie, nil
}

func (s *Service) UpdateMovie(ctx context.Context, id string, movie *domain.MovieModel) (*domain.MovieModel, error) {
	// UpdateMovie: Atualiza dados de filme existente
	// Parâmetros: ctx (context.Context) - contexto, id (string) - ObjectID, update (*domain.MovieModel) - campos atualizados
	// Retorno: (*domain.MovieModel, error) - filme atualizado ou erro
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	movie.ID = objectID
	_, err = s.repo.Update(ctx, id, movie)
	if err != nil {
		return nil, err
	}
	// objectID, err := bson.ObjectIDFromHex(id)
	// if err != nil {
	// 	return nil, err
	// }
	// movie.ID = objectID
	return movie, nil
}

func (s *Service) DeleteMovie(ctx context.Context, id string) (bool, error) {
	// DeleteMovie: Remove filme do banco de dados
	// Parâmetros: ctx (context.Context) - contexto, id (string) - ObjectID
	// Retorno: (bool, error) - sucesso ou erro
	result, err := s.repo.Delete(ctx, id)
	if err != nil {
		// if err == mongo.ErrNoDocuments {
		// 	return false, nil // Filme não encontrado, mas operação é considerada bem-sucedida
		// }
		return false, err
	}
	return result.DeletedCount > 0, nil
}

func (s *Service) ListMovies(ctx context.Context) ([]*domain.MovieModel, error) {
	// ListMovies: Retorna todos os filmes cadastrados
	// Parâmetros: ctx (context.Context) - contexto
	// Retorno: ([]*domain.MovieModel, error) - lista de filmes ou erro
	return s.repo.List(ctx)
}
func (s *Service) ListMoviesByActor(ctx context.Context, actor string) ([]*domain.MovieModel, error) {
	// ListMoviesByActor: Retorna filmes de um ator específico
	// Parâmetros: ctx (context.Context) - contexto, actor (string) - nome do ator
	// Retorno: ([]*domain.MovieModel, error) - filmes do ator ou erro
	return s.repo.ListByActor(ctx, actor)
}

func (s *Service) ListMoviesByGenre(ctx context.Context, genre string) ([]*domain.MovieModel, error) {
	// ListMoviesByGenre: Retorna filmes de um género específico
	// Parâmetros: ctx (context.Context) - contexto, genre (string) - género
	// Retorno: ([]*domain.MovieModel, error) - filmes do género ou erro
	return s.repo.ListByGenre(ctx, genre)
}
