<h1 align="center" style="font-weight: bold;">Desafio Técnico Backend GiroTech 💻</h1>

<p align="center">
 <a href="#technologies">Tecnologias</a> • 
 <a href="#started">Começando</a> • 
  <a href="#routes">Endpoints da API</a> •
 <a href="#test">Teste da API</a> •
 <a href="#colab">Colaborador</a> •
</p>

<p align="center">
    <b>API foi desenvolvida para gerenciar investimentos e taxas de câmbio, permitindo o cadastro, consulta, atualização e remoção de dados relacionados a investidores, moedas, taxas de câmbio e históricos de investimento em Node.js.</b>
</p>

<h2 id="technologies">💻 Tecnologias</h2>

- Node.js
- Express.js
- MySQL
- Docker
- Jest

<h2 id="started">🚀 Começando</h2>

<h3>Pré-requisitos</h3>

Aqui estão os pré-requisitos necessários para rodar o projeto:

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

<h3>Clonando o repositório</h3>

Para clonar o projeto, execute:

```bash
git clone https://github.com/EduardoArauj0/Desafio-Tecnico-Backend_Giro.Tech
```

<h3>Configurando as variáveis .env</h3>

Crie seu arquivo .env com as configurações necessárias, como informações de conexão com o banco de dados, seguindo o modelo do arquivo .env:

```yaml
APP_DEBUG=true

NODE_LOCAL_PORT=3000

MYSQL_ROOT_PASSWORD="sua_senha"
MYSQL_HOST=mysql
MYSQL_LOCAL_PORT=3307
MYSQL_DOCKER_PORT=3306
MYSQL_DATABASE="nome_db"
MYSQL_PASSWORD="sua_senha"

RUN_SEED=true
```

<h3>Iniciando o projeto</h3>
Para rodar o projeto, siga as instruções:

```bash
cd Desafio-Tecnico-Backend_Giro.Tech
npm install
npm install express mysql2 dotenv
npm install --save-dev jest supertest
docker-compose up --build

```

<h2 id="routes">📍 Endpoints da API</h2>

| Rota                                     | Descrição                                          |
| ---------------------------------------- | -------------------------------------------------- |
| <kbd>GET /Currency</kbd>                 | Lista todas as moedas cadastradas.                 |
| <kbd>POST /Currency</kbd>                | Cadastra uma nova moeda.                           |
| <kbd>PUT /Currency/:id</kbd>             | Atualiza uma moeda pelo ID.                        |
| <kbd>DELETE /Currency/:id</kbd>          | Remove uma moeda pelo ID.                          |
| <kbd>GET /ExchangeRate</kbd>             | Lista todas as taxas de câmbio registradas.        |
| <kbd>POST /ExchangeRate</kbd>            | Cadastra uma nova taxa de câmbio.                  |
| <kbd>PUT /ExchangeRate/:id</kbd>         | Atualiza uma taxa de câmbio pelo ID.               |
| <kbd>DELETE /ExchangeRate/:id</kbd>      | Remove uma taxa de câmbio pelo ID.                 |
| <kbd>DELETE /ExchangeRate/old</kbd>      | Remove taxas de câmbio com mais de 30 dias.        |
| <kbd>GET /Investor</kbd>                 | Lista todos os investidores cadastrados.           |
| <kbd>POST /Investor</kbd>                | Cadastra um novo investidor.                       |
| <kbd>PUT /Investor/:id</kbd>             | Atualiza os dados de um investidor pelo ID.        |
| <kbd>DELETE /Investor/:id</kbd>          | Remove um investidor e seus investimentos pelo ID. |
| <kbd>GET /InvestmentHistory</kbd>        | Lista todos os investimentos registrados.          |
| <kbd>POST /InvestmentHistory</kbd>       | Cadastra um novo investimento.                     |
| <kbd>PUT /InvestmentHistory/:id</kbd>    | Atualiza um investimento pelo ID.                  |
| <kbd>DELETE /InvestmentHistory/:id</kbd> | Remove um investimento pelo ID.                    |

<h3 id="get-investors">GET /Investor</h3>

**RESPOSTA**

```json
[
  {
    "id": 1,
    "name": "Bruno Alves",
    "email": "bruno.alves@email.com"
  },
  {
    "id": 2,
    "name": "Eduardo Araujo",
    "email": "eduardo.araujo@email.com"
  }
]
```

<h3 id="post-investor">POST /Investor</h3>

**REQUISIÇÃO**

```json
{
  "name": "Carlos Oliveira",
  "email": "carlos.oliveira@email.com"
}
```

**RESPOSTA**

```json
{
  "id": 3,
  "name": "Carlos Oliveira",
  "email": "carlos.oliveira@email.com"
}
```

<h3 id="post-investment">POST /InvestmentHistory</h3>

**REQUISIÇÃO**

```json
{
  "initial_amount": 10000,
  "months": 12,
  "interest_rate": 5.5,
  "final_amount": 10550,
  "currency_id": 2,
  "investor_id": 1
}
```

**RESPOSTA**

```json
{
  "id": 1,
  "initial_amount": 10000,
  "months": 12,
  "interest_rate": 5.5,
  "final_amount": 10550,
  "currency_id": 2,
  "investor_id": 1
}
```

<h2 id="test">📍 Testes da API</h2>

Para rodar os testes, siga as instruções:

```bash
npx jest --clearCache
npx jest src/routes/test/currencyRoutes.spec.js
npx jest src/routes/test/exchangeRateRoutes.spec.js
npx jest src/routes/test/investmentHistoryRoutes.spec.js
npx jest src/routes/test/investorRoutes.spec.js
```

<h2 id="colab">👥 Colaborador</h2>
Eduardo Araujo - Desenvolvimento da API
