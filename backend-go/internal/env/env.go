// ============================================================================
// FILE: env.go
// DESCRIPTION: Utilitário para leitura de variáveis de ambiente com validação
//
//	Falha se variável não estiver definida
//
// AUTHOR: Equipe
// CREATED: 2024-01-01
// UPDATED: 2026-05-08
// ============================================================================
package env

import (
	"log"
	"os"
)

func GetEnv(key string) string {
	// GetEnv: Obt\u00e9m valor de vari\u00e1vel de ambiente\n\t
	// Par\u00e2metros: key (string) - nome da vari\u00e1vel de ambiente\n\t
	// Retorno: (string) - valor da vari\u00e1vel ou log fatal se n\u00e3o existir\n\t,
	value, exists := os.LookupEnv(key)
	if !exists {
		log.Fatalf("Environment variable %s not set", key)
	}
	return value
}
