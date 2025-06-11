# Sistema de Leilão

API para gerenciamento de leilões com suporte a websockets para acompanhamento em tempo real.

## Funcionalidades

- Cadastro de leilões com horário de início e fim
- Sistema de lances com valor mínimo
- Validações de lances:
  - Valor deve ser maior que o lance anterior
  - Mesmo usuário não pode dar lances consecutivos
  - Leilão só encerra no horário programado
- API REST para cadastro e lances
- Websocket para acompanhamento em tempo real

## Setup

1. Instale as dependências:

```bash
pnpm install
```

2. Inicie o banco de dados:

```bash
pnpm docker:start
```

3. Execute o projeto:

```bash
pnpm dev
```

## Comandos

- `pnpm dev`: Inicia o servidor em modo desenvolvimento
- `pnpm docker:start`: Inicia o container do banco de dados
- `pnpm docker:stop`: Para o container do banco de dados
- `pnpm docker:clean`: Remove os containers e volumes

## Testes

```bash
# Executa todos os testes
pnpm test

# Executa testes em modo watch
pnpm test:watch

# Executa testes com coverage
pnpm test:coverage
```
