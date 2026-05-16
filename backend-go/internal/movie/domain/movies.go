// Descrição: Define a estrutura de dados para um filme.
// Autor: Luiz
// Data de criação: 16/05/2024
// Datas de atualização: 16/05/2024
package domain

import "go.mongodb.org/mongo-driver/v2/bson"

// MovieModel representa a estrutura de um filme no banco de dados.
type MovieModel struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	Title     string        `bson:"title"`
	Year      int32         `bson:"year"`
	Plot      string        `bson:"plot"`
	Genres    []string      `bson:"genres"`
	Cast      []string      `bson:"cast"`
	Directors []string      `bson:"directors"`
	Rated     string        `bson:"rated"`
	Runtime   int32         `bson:"runtime"`
}
