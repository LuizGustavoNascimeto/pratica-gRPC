# backend-go

Backend em Go para o projeto de prática de gRPC.

## Como compilar

Para compilar o projeto, você precisa ter o Go e o `protoc` instalados.
Execute os seguintes comandos para gerar os arquivos a partir dos protos:

```bash
protoc \
  --proto_path=internal/movie/proto \
  --go_out=./internal/movie/proto/moviepb \
  --go_opt=paths=source_relative \
  --go-grpc_out=./internal/movie/proto/moviepb \
  --go-grpc_opt=paths=source_relative \
  --connect-go_out=./internal/movie/proto/moviepbconnect \
  --connect-go_opt=paths=source_relative \
  internal/movie/proto/movie.proto


protoc \
  --proto_path=internal/ping/proto \
  --go_out=./internal/ping/pingpb \
  --go_opt=paths=source_relative \
  --go-grpc_out=./internal/ping/pingpb \
  --go-grpc_opt=paths=source_relative \
  --connect-go_out=./internal/ping/pingconnect \
  --connect-go_opt=paths=source_relative \
  internal/ping/proto/ping.proto
```

Depois, para compilar o projeto principal:

```bash
go build -o app cmd/main.go
```

## Como executar

Após a compilação, você pode executar o servidor com:

```bash
./app
```

O servidor estará rodando na porta `:8080`.

## Bibliotecas usadas

As bibliotecas não padrão utilizadas neste projeto são:

- `go.mongodb.org/mongo-driver`: Driver oficial do MongoDB para Go.
- `google.golang.org/grpc`: Framework para RPC do Google.
- `google.golang.org/protobuf`: Biblioteca para trabalhar com Protocol Buffers em Go.
- `github.com/bufbuild/connect-go`: Biblioteca para criar serviços gRPC, gRPC-Web e Connect.

Todas as dependências são gerenciadas pelo `go.mod`.

## Exemplo de uso

Você pode usar um cliente gRPC como o `grpcurl` para interagir com o serviço.

Exemplo para o serviço de Ping:
```bash
grpcurl -plaintext -d '{}' localhost:8080 ping.v1.PingService/Ping
```

Exemplo para criar um filme:
```bash
grpcurl -plaintext -d '{"title": "Inception", "year": 2010, "director": "Christopher Nolan"}' localhost:8080 movie.v1.MovieService/CreateMovie
```
