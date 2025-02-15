const request = require("supertest");
const express = require("express");
const investmentHistoryRoutes = require("../investmentHistoryRoutes");

const app = express();
app.use(express.json());
app.use("/investment-history", investmentHistoryRoutes);

jest.mock("../../config/database", () => ({
  query: jest.fn(),
}));

const db = require("../../config/database");

describe("InvestmentHistory Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /investment-history - Deveria retornar 400 se algum campo obrigatório estiver faltando", async () => {
    const response = await request(app).post("/investment-history").send({
      initial_amount: 1000,
      months: 12,
      interest_rate: 0.05,
      final_amount: 1200,
      currency_id: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Todos os campos são obrigatórios");
  });

  test("POST /investment-history - Deveria inserir um novo histórico de investimento e retornar 201", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app).post("/investment-history").send({
      initial_amount: 1000,
      months: 12,
      interest_rate: 0.05,
      final_amount: 1200,
      currency_id: 1,
      investor_id: 1,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Histórico de investimento inserido com sucesso"
    );
    expect(response.body.id).toBe(1);
  });

  test("POST /investment-history - Deveria retornar 500 se a consulta ao banco de dados falhar", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error("Database error"), null);
    });

    const response = await request(app).post("/investment-history").send({
      initial_amount: 1000,
      months: 12,
      interest_rate: 0.05,
      final_amount: 1200,
      currency_id: 1,
      investor_id: 1,
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Erro ao inserir histórico de investimento"
    );
  });

  test("GET /investment-history - Deveria retornar todos os históricos de investimento", async () => {
    db.query.mockImplementationOnce((query, callback) => {
      callback(null, [{ id: 1, initial_amount: 1000 }]);
    });

    const response = await request(app).get("/investment-history");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].initial_amount).toBe(1000);
  });

  test("GET /investment-history - Deveria retornar 500 se a consulta ao banco de dados falhar", async () => {
    db.query.mockImplementationOnce((query, callback) => {
      callback(new Error("Database error"), null);
    });

    const response = await request(app).get("/investment-history");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Erro ao buscar históricos de investimento"
    );
  });

  test("GET /investment-history/:id - Deveria retornar um histórico de investimento específico", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ id: 1, initial_amount: 1000 }]);
    });

    const response = await request(app).get("/investment-history/1");

    expect(response.status).toBe(200);
    expect(response.body.initial_amount).toBe(1000);
  });

  test("GET /investment-history/:id - Deveria retornar 404 se o histórico não for encontrado", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, []);
    });

    const response = await request(app).get("/investment-history/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "Histórico de investimento não encontrado"
    );
  });

  test("GET /investment-history/:id - Deveria retornar 500 se a consulta ao banco de dados falhar", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error("Database error"), null);
    });

    const response = await request(app).get("/investment-history/1");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Erro ao buscar histórico de investimento"
    );
  });

  test("PUT /investment-history/:id - Deveria retornar 400 se algum campo obrigatório estiver faltando", async () => {
    const response = await request(app).put("/investment-history/1").send({
      initial_amount: 1000,
      months: 12,
      interest_rate: 0.05,
      final_amount: 1200,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Todos os campos são obrigatórios");
  });

  test("PUT /investment-history/:id - Deveria atualizar um histórico de investimento e retornar 200", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put("/investment-history/1").send({
      initial_amount: 1000,
      months: 12,
      interest_rate: 0.05,
      final_amount: 1200,
      currency_id: 1,
      investor_id: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Histórico de investimento atualizado com sucesso"
    );
  });

  test("PUT /investment-history/:id - Deveria retornar 500 se a consulta ao banco de dados falhar", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error("Database error"), null);
    });

    const response = await request(app).put("/investment-history/1").send({
      initial_amount: 1000,
      months: 12,
      interest_rate: 0.05,
      final_amount: 1200,
      currency_id: 1,
      investor_id: 1,
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Erro ao atualizar histórico de investimento"
    );
  });

  test("DELETE /investment-history/:id - Deveria excluir um histórico de investimento e retornar 200", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete("/investment-history/1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Histórico de investimento deletado com sucesso"
    );
  });

  test("DELETE /investment-history/:id - Deveria retornar 404 se o histórico não for encontrado", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { affectedRows: 0 });
    });

    const response = await request(app).delete("/investment-history/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "Histórico de investimento não encontrado"
    );
  });

  test("DELETE /investment-history/:id - Deveria retornar 500 se a consulta ao banco de dados falhar", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error("Database error"), null);
    });

    const response = await request(app).delete("/investment-history/1");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Erro ao deletar histórico de investimento"
    );
  });
});
