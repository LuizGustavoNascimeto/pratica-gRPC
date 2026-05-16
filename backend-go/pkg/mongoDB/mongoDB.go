// Descrição: Cliente MongoDB singleton que gerencia a conexão com o banco de dados
//
//	e provê acesso seguro a bancos e coleções.
//
// Autor: Luiz
// Data de criação: 16/05/2024
// Datas de atualização: 16/05/2024
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

// Client define a estrutura para o cliente MongoDB.
type Client struct {
	client *mongo.Client
}

var (
	instance *Client
	once     sync.Once
	initErr  error
)

// Connect inicializa o singleton do MongoDB.
// DEVE ser chamada UMA VEZ na main. Chamadas subsequentes são ignoradas (sync.Once).
// Parâmetros:
//   - uri (string): a string de conexão do MongoDB.
//
// Retorno:
//   - (*Client): o cliente inicializado.
//   - (error): um erro, se ocorrer.
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

// GetInstance retorna a instância singleton já inicializada.
// Retorno:
//   - (*Client): o cliente inicializado.
//   - (error): um erro se Connect não foi chamado.
func GetInstance() (*Client, error) {
	if instance == nil {
		return nil, errors.New("mongodb não inicializado: chame mongodb.Connect(uri) primeiro")
	}
	return instance, nil
}

// GetClient retorna o cliente mongo subjacente.
// Retorno:
//   - (*mongo.Client): o cliente MongoDB.
func (c *Client) GetClient() *mongo.Client {
	return c.client
}

// GetDatabase retorna uma referência a um banco de dados.
// Parâmetros:
//   - name (string): o nome do banco de dados.
//
// Retorno:
//   - (*mongo.Database): a referência do banco de dados.
func (c *Client) GetDatabase(name string) *mongo.Database {
	return c.client.Database(name)
}

// GetCollection retorna uma coleção de um banco de dados específico.
// Parâmetros:
//   - database (string): o nome do banco de dados.
//   - collection (string): o nome da coleção.
//
// Retorno:
//   - (*mongo.Collection): a referência da coleção.
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
