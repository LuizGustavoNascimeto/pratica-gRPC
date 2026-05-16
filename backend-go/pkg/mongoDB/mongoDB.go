// ============================================================================
// FILE: mongoDB.go
// DESCRIPTION: Cliente MongoDB singleton - gerencia conexão com banco
//
//	e provê acesso seguro a bancos e coleções
//
// AUTHOR: Equipe
// CREATED: 2024-01-01
// UPDATED: 2026-05-08
// ============================================================================
package mongodb

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

type Client struct {
	client *mongo.Client
}

var (
	instance *Client
	once     sync.Once
	initErr  error
)

// Connect: Inicializa singleton do MongoDB
// DEVE ser chamada UMA VEZ na main. Chamadas subsequentes são ignoradas (sync.Once)
// Parâmetros: uri (string) - string de conexão MongoDB
// Retorno: (*Client, error) - cliente inicializado ou erro
func Connect(uri string) (*Client, error) {
	once.Do(func() {
		serverAPI := options.ServerAPI(options.ServerAPIVersion1)
		opts := options.Client().
			ApplyURI(uri).
			SetServerAPIOptions(serverAPI).
			SetConnectTimeout(10 * time.Second).
			SetServerSelectionTimeout(10 * time.Second)

		client, err := mongo.Connect(opts)
		if err != nil {
			initErr = fmt.Errorf("falha ao conectar no MongoDB: %w", err)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := client.Ping(ctx, readpref.Primary()); err != nil {
			initErr = fmt.Errorf("falha ao pingar o MongoDB: %w", err)
			return
		}

		fmt.Println("Conectado ao MongoDB com sucesso!")
		instance = &Client{client: client}
	})

	if initErr != nil {
		return nil, initErr
	}
	return instance, nil
}

// GetInstance: Retorna instância singleton já inicializada
// Parâmetros: nenhum
// Retorno: (*Client, error) - cliente inicializado ou erro se Connect não foi chamado
func GetInstance() (*Client, error) {
	if instance == nil {
		return nil, errors.New("mongodb não inicializado: chame mongodb.Connect(uri) primeiro")
	}
	return instance, nil
}

// GetClient: Retorna cliente mongo subjacente
// Parâmetros: nenhum
// Retorno: (*mongo.Client) - cliente MongoDB
func (c *Client) GetClient() *mongo.Client {
	return c.client
}

// GetDatabase: Retorna referência a um banco de dados
// Parâmetros: name (string) - nome do banco de dados
// Retorno: (*mongo.Database) - referência do banco
func (c *Client) GetDatabase(name string) *mongo.Database {
	return c.client.Database(name)
}

// GetCollection: Retorna coleção de um banco específico
// Parâmetros: database (string) - nome do banco, collection (string) - nome coleção
// Retorno: (*mongo.Collection) - referência da coleção
func (c *Client) GetCollection(database, collection string) *mongo.Collection {
	return c.client.Database(database).Collection(collection)
}

// Disconnect: Encerra conexão com MongoDB
// DEVE ser chamado ao finalizar aplicação (via defer em main)
// Parâmetros: nenhum
// Retorno: (error) - erro se houve
func (c *Client) Disconnect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := c.client.Disconnect(ctx); err != nil {
		return fmt.Errorf("falha ao desconectar do MongoDB: %w", err)
	}

	instance = nil
	once = sync.Once{}
	fmt.Println("Desconectado do MongoDB.")
	return nil
}
