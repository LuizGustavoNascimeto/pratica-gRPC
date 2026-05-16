package domain

import "go.mongodb.org/mongo-driver/v2/bson"

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
