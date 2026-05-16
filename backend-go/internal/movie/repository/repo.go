// ============================================================================
// FILE: repo.go
// DESCRIPTION: Camada de acesso a dados (Repository) - implementa operações
//
//	CRUD para filmes na coleção MongoDB
//
// AUTHOR: Equipe
// CREATED: 2024-01-01
// UPDATED: 2026-05-08
// ============================================================================
package repository

import (
	"context"
	"rpc/internal/movie/domain"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Repository struct {
	collection *mongo.Collection
}

func NewRepository(db *mongo.Database) *Repository {
	// NewRepository: Cria instância de repositório para coleção "movies"
	// Parâmetros: db (*mongo.Database) - banco de dados MongoDB
	// Retorno: (*Repository) - repositório inicializado
	return &Repository{
		collection: db.Collection("movies"),
	}
}

func (r *Repository) Create(ctx context.Context, movie *domain.MovieModel) (*mongo.InsertOneResult, error) {
	// Create: Insere novo filme no banco de dados
	// Parâmetros: ctx (context.Context) - contexto, movie (*domain.MovieModel) - filme a inserir
	// Retorno: (*mongo.InsertOneResult, error) - resultado ou erro
	return r.collection.InsertOne(ctx, movie)
}

func (r *Repository) Read(ctx context.Context, id string) (*domain.MovieModel, error) {
	// Read: Recupera filme por ID hexadecimal
	// Parâmetros: ctx (context.Context) - contexto, id (string) - ObjectID em hex
	// Retorno: (*domain.MovieModel, error) - filme encontrado ou erro
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var movie domain.MovieModel
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&movie)
	if err != nil {
		return nil, err
	}
	return &movie, nil
}

func (r *Repository) Update(ctx context.Context, id string, movie *domain.MovieModel) (*mongo.UpdateResult, error) {
	// Update: Atualiza campos de um filme existente
	// Parâmetros: ctx (context.Context) - contexto, id (string) - ObjectID em hex, update (*domain.MovieModel) - novos valores
	// Retorno: (*mongo.UpdateResult, error) - resultado ou erro
	return r.collection.UpdateOne(ctx, bson.M{"_id": movie.ID}, bson.M{"$set": bson.M{
		"title":     movie.Title,
		"year":      movie.Year,
		"plot":      movie.Plot,
		"genres":    movie.Genres,
		"cast":      movie.Cast,
		"directors": movie.Directors,
		"rated":     movie.Rated,
		"runtime":   movie.Runtime,
	}})
}

func (r *Repository) Delete(ctx context.Context, id string) (*mongo.DeleteResult, error) {
	// Delete: Remove filme do banco de dados pelo ID
	// Parâmetros: ctx (context.Context) - contexto, id (string) - ObjectID em hex
	// Retorno: (*mongo.DeleteResult, error) - resultado ou erro
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	return r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
}

func (r *Repository) List(ctx context.Context) ([]*domain.MovieModel, error) {
	// List: Retorna todos os filmes do banco de dados
	// Parâmetros: ctx (context.Context) - contexto
	// Retorno: ([]*domain.MovieModel, error) - lista de filmes ou erro
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	var movies []*domain.MovieModel
	for cursor.Next(ctx) {
		var m domain.MovieModel

		if err := cursor.Decode(&m); err != nil {
			return nil, err
		}
		movies = append(movies, &m)
	}
	return movies, nil
}

func (r *Repository) ListByActor(ctx context.Context, actor string) ([]*domain.MovieModel, error) {
	// ListByActor: Retorna filmes que contém ator no elenco
	// Parâmetros: ctx (context.Context) - contexto, actor (string) - nome do ator
	// Retorno: ([]*domain.MovieModel, error) - lista de filmes ou erro
	cursor, err := r.collection.Find(ctx, bson.M{"cast": actor})
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	var movies []*domain.MovieModel
	for cursor.Next(ctx) {
		var m domain.MovieModel
		if err := cursor.Decode(&m); err != nil {
			return nil, err
		}
		movies = append(movies, &m)
	}
	return movies, nil
}

func (r *Repository) ListByGenre(ctx context.Context, genre string) ([]*domain.MovieModel, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"genres": genre})
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	var movies []*domain.MovieModel
	for cursor.Next(ctx) {
		var m domain.MovieModel
		if err := cursor.Decode(&m); err != nil {
			return nil, err
		}
		movies = append(movies, &m)
	}
	return movies, nil
}
