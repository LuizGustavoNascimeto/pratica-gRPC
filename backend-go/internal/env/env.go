// Descrição: Utilitário para leitura de variáveis de ambiente com validação.
//
//	Falha se a variável não estiver definida.
//
// Autor: Luiz
// Data de criação: 16/05/2024
// Datas de atualização: 16/05/2024
package env

import (
	"log"
	"os"
)

// GetEnv obtém o valor de uma variável de ambiente.
// Parâmetros:
//   - key (string): nome da variável de ambiente.
//
// Retorno:
//   - (string): valor da variável de ambiente.
//
// A função causa um log fatal se a variável de ambiente não estiver definida.
func GetEnv(key string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		log.Fatalf("Environment variable %s not set", key)
	}
	return value
}
