// Descrição: Mapeamento de dados para filmes, fazendo a conversão entre
//
//	as estruturas do Protobuf e as estruturas do domínio Go.
//
// Autor: Luiz
// Data de criação: 16/05/2024
// Datas de atualização: 16/05/2024
package handler

import (
	"rpc/internal/movie/domain"
	moviepb "rpc/internal/movie/proto/moviepb"
)

// ToProto converte um modelo de domínio de filme para o formato Protobuf.
// Parâmetros:
//   - m (*domain.MovieModel): o modelo Go do filme.
//
// Retorno:
//   - (*moviepb.MovieRes): a estrutura Protobuf para transmissão.
func ToProto(m *domain.MovieModel) *moviepb.MovieRes {
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

// ToModel converte uma estrutura Protobuf para o modelo de domínio.
// Parâmetros:
//   - m (*moviepb.MovieReq): a estrutura Protobuf recebida.
//
// Retorno:
//   - (*domain.MovieModel): o modelo Go para armazenamento.
func ToModel(m *moviepb.MovieReq) *domain.MovieModel {
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
