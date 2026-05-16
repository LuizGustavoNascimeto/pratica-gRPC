Projeto: frontend-ts

Como compilar:
- Instale dependências:
  npm install
- Build para produção:
  npm run build

Como executar:
- Ambiente de desenvolvimento (hot-reload):
  npm run dev
- Executar versão em produção (após `npm run build`):
  npm start

Bibliotecas não-padrão utilizadas (resumo):
- @bufbuild/connect, @bufbuild/connect-web, @bufbuild/protobuf: cliente gRPC/Connect
- react-hook-form: gerenciamento de formulários
- zod: validação de esquemas
- shadcn / radix-ui / tailwindcss: componentes UI e estilos
- lucide-react: ícones

Exemplo de uso:
- Abra o navegador em `http://localhost:3000` após `npm run dev`.
- Navegue até a página de filmes e use o formulário "Buscar Filmes por Ator".

Observações:
- Autor do código nos cabeçalhos dos arquivos está como "Nome do Aluno" — substitua conforme necessário.
- Este projeto usa Next.js 16 e React 19; verifique versões em `package.json`.
