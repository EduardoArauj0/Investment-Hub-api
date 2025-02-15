const request = require("supertest");
const express = require("express");
const currencyRoutes = require("../currencyRoutes");

const app = express();
app.use(express.json());
app.use("/currency", currencyRoutes);

jest.mock("../../config/database", () => ({
  query: jest.fn(),
}));

const db = require("../../config/database");

describe("Currency Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /currency - Criar nova moeda", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post("/currency")
      .send({ name: "Bitcoin", type: "Crypto" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Moeda inserida com sucesso",
      id: 1,
    });
  });

  test("GET /currency - Buscar todas as moedas", async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ id: 1, name: "Bitcoin", type: "Crypto" }]);
    });

    const response = await request(app).get("/currency");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "Bitcoin", type: "Crypto" }]);
  });

  test("GET /currency/:id - Buscar moeda específica", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, [{ id: 1, name: "Bitcoin", type: "Crypto" }]);
    });

    const response = await request(app).get("/currency/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: "Bitcoin", type: "Crypto" });
  });

  test("PUT /currency/:id - Atualizar moeda", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app)
      .put("/currency/1")
      .send({ name: "Ethereum", type: "Crypto" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Moeda atualizada com sucesso" });
  });

  test("DELETE /currency/:id - Remover moeda", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete("/currency/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Moeda deletada com sucesso" });
  });
});
