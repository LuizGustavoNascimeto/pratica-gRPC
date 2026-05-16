// ============================================================================
// FILE: model.go
// DESCRIPTION: Modelos de dados para filmes - mapeamento entre protobuf e
//
//	estruturas Go com conversão bidirecional
//
// AUTHOR: Equipe
// CREATED: 2024-01-01
// UPDATED: 2026-05-08
// ============================================================================
package handler

import (
	"rpc/internal/movie/domain"
	moviepb "rpc/internal/movie/proto/moviepb"
)

func ToProto(m *domain.MovieModel) *moviepb.MovieRes {
	// ToProto: Converte modelo interno para formato protobuf
	// Parâmetros: m (*domain.MovieModel) - modelo Go do filme
	// Retorno: (*moviepb.MovieRes) - estrutura protobuf para transmissão
	return &moviepb.MovieRes{
		Id:        m.ID.Hex(),
		Title:     m.Title,
		Year:      m.Year,
		Plot:      m.Plot,
		Genres:    m.Genres,
		Cast:      m.Cast,
		Directors: m.Directors,
		Rated:     m.Rated,
		Runtime:   m.Runtime,
	}
}

func ToModel(m *moviepb.MovieReq) *domain.MovieModel {
	// ToModel: Converte formato protobuf para modelo interno
	// Parâmetros: m (*moviepb.MovieReq) - estrutura protobuf recebida
	// Retorno: (*domain.MovieModel) - modelo Go para armazenamento
	return &domain.MovieModel{
		Title:     m.Title,
		Year:      m.Year,
		Plot:      m.Plot,
		Genres:    m.Genres,
		Cast:      m.Cast,
		Directors: m.Directors,
		Rated:     m.Rated,
		Runtime:   m.Runtime,
	}
}
