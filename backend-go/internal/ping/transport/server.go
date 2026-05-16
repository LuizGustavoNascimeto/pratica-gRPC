package server

import (
	"context"
	"rpc/internal/ping/pingpb"

	"connectrpc.com/connect"
)

type Server struct {
	pingpb.UnimplementedPingServiceServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Ping(
	ctx context.Context,
	req *connect.Request[pingpb.PingReq],
) (*connect.Response[pingpb.PingRes], error) {

	res := connect.NewResponse(&pingpb.PingRes{
		Message: "pong",
	})
	return res, nil
}
