package main

import (
	"log"
	"net/http"
	"rpc/internal/env"
	"rpc/internal/movie/proto/moviepbconnect"
	"rpc/internal/movie/repository"
	"rpc/internal/movie/service"
	ms "rpc/internal/movie/transport/grpc"
	"rpc/internal/ping/pingconnect"
	ps "rpc/internal/ping/transport"
	mongodb "rpc/pkg/mongoDB"

	"connectrpc.com/connect"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	//env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// DB
	dbURI := env.GetEnv("MONGODB_URL")

	db, err := mongodb.Connect(dbURI)
	if err != nil {
		log.Fatalf("failed to connect MongoDB: %v", err)
	}

	// Ping
	pingServer := ps.NewServer()
	pingPath, pingHandler := pingconnect.NewPingServiceHandler(
		pingServer,
		connect.WithInterceptors(),
	)

	mux := http.NewServeMux()
	mux.Handle(pingPath, pingHandler)

	// Movie

	repo := repository.NewRepository(
		db.GetDatabase("sample_mflix"),
	)
	svc := service.NewService(repo)
	movieServer := ms.NewServer(svc)

	moviePath, movieHandler := moviepbconnect.NewMovieServiceHandler(
		movieServer,
		connect.WithInterceptors(),
	)

	mux.Handle(moviePath, movieHandler)

	log.Println("HTTP Connect server on :8080")

	handler := cors.AllowAll().Handler(mux)

	http.ListenAndServe(":8080", handler)
}
