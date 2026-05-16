// Descrição: Camada de acesso a dados (Repository) que implementa as operações
//
//	CRUD para filmes na coleção MongoDB.
//
// Autor: Luiz
// Data de criação: 16/05/2024
// Datas de atualização: 16/05/2024
package repository

import (
	"context"
	"rpc/internal/movie/domain"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Repository define a estrutura para o repositório de filmes.
type Repository struct {
	collection *mongo.Collection
}

// NewRepository cria uma nova instância do repositório para a coleção "movies".
// Parâmetros:
//   - db (*mongo.Database): o banco de dados MongoDB.
//
// Retorno:
//   - (*Repository): o repositório inicializado.
func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		collection: db.Collection("movies"),
	}
}

// Create insere um novo filme no banco de dados.
// Parâmetros:
//   - ctx (context.Context): o contexto da requisição.
//   - movie (*domain.MovieModel): o filme a ser inserido.
//
// Retorno:
//   - (*mongo.InsertOneResult): o resultado da inserção.
//   - (error): um erro, se ocorrer.
func (r *Repository) Create(ctx context.Context, movie *domain.MovieModel) (*mongo.InsertOneResult, error) {
	return r.collection.InsertOne(ctx, movie)
}

// Read recupera um filme pelo seu ID hexadecimal.
// Parâmetros:
//   - ctx (context.Context): o contexto da requisição.
//   - id (string): o ObjectID do filme em formato hexadecimal.
//
// Retorno:
//   - (*domain.MovieModel): o filme encontrado.
//   - (error): um erro, se ocorrer.
func (r *Repository) Read(ctx context.Context, id string) (*domain.MovieModel, error) {
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

// Update atualiza os campos de um filme existente.
// Parâmetros:
//   - ctx (context.Context): o contexto da requisição.
//   - id (string): o ObjectID do filme em formato hexadecimal.
//   - movie (*domain.MovieModel): os novos valores para o filme.
//
// Retorno:
//   - (*mongo.UpdateResult): o resultado da atualização.
//   - (error): um erro, se ocorrer.
func (r *Repository) Update(ctx context.Context, id string, movie *domain.MovieModel) (*mongo.UpdateResult, error) {
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

// Delete remove um filme do banco de dados pelo seu ID.
// Parâmetros:
//   - ctx (context.Context): o contexto da requisição.
//   - id (string): o ObjectID do filme em formato hexadecimal.
//
// Retorno:
//   - (*mongo.DeleteResult): o resultado da exclusão.
//   - (error): um erro, se ocorrer.
func (r *Repository) Delete(ctx context.Context, id string) (*mongo.DeleteResult, error) {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	return r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
}

// List retorna todos os filmes do banco de dados.
// Parâmetros:
//   - ctx (context.Context): o contexto da requisição.
//
// Retorno:
//   - ([]*domain.MovieModel): uma lista de filmes.
//   - (error): um erro, se ocorrer.
func (r *Repository) List(ctx context.Context) ([]*domain.MovieModel, error) {
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
