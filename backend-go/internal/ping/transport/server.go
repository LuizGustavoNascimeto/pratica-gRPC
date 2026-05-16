// Descrição: Implementação do servidor gRPC para o serviço de Ping.
//
//	Este arquivo contém o handler para a chamada RPC de Ping.
//
// Autor: Luiz
// Data de criação: 16/05/2024
// Datas de atualização: 16/05/2024
package server

import (
	"context"
	"rpc/internal/ping/pingpb"

	"connectrpc.com/connect"
)

// Server define a estrutura para o servidor de Ping.
type Server struct {
	pingpb.UnimplementedPingServiceServer
}

// NewServer cria uma nova instância do servidor de Ping.
// Retorno:
//   - (*Server): o servidor gRPC inicializado.
func NewServer() *Server {
	return &Server{}
}

// Ping é o handler para a chamada RPC de Ping.
// Ele simplesmente retorna uma mensagem "pong".
// Parâmetros:
//   - ctx (context.Context): o contexto da requisição.
//   - req (*connect.Request[pingpb.PingReq]): a requisição gRPC.
//
// Retorno:
//   - (*connect.Response[pingpb.PingRes]): a resposta gRPC.
//   - (error): um erro, se ocorrer.
func (s *Server) Ping(
	ctx context.Context,
	req *connect.Request[pingpb.PingReq],
) (*connect.Response[pingpb.PingRes], error) {

	res := connect.NewResponse(&pingpb.PingRes{
		Message: "pong",
	})
	return res, nil
}
