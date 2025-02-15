const request = require("supertest");
const express = require("express");
const investorRoutes = require("../investorRoutes");

const app = express();
app.use(express.json());
app.use("/investors", investorRoutes);

jest.mock("../../config/database", () => ({
  query: jest.fn(),
}));

const db = require("../../config/database");

describe("Investor Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /investors - Criar novo investidor", async () => {
    db.query.mockImplementation((query, values, callback) => {
      if (query.includes("SELECT")) {
        callback(null, []);
      } else if (query.includes("INSERT")) {
        callback(null, { insertId: 1 });
      }
    });

    const response = await request(app)
      .post("/investors")
      .send({ name: "Test Investor", email: "test@example.com" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Investidor inserido com sucesso",
      id: 1,
    });
  });

  test("POST /investors - E-mail já cadastrado", async () => {
    db.query.mockImplementation((query, values, callback) => {
      if (query.includes("SELECT")) {
        callback(null, [{ id: 1 }]);
      }
    });

    const response = await request(app)
      .post("/investors")
      .send({ name: "Test Investor", email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "E-mail já cadastrado" });
  });

  test("GET /investors - Buscar todos os investidores", async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [
        { id: 1, name: "Test Investor", email: "test@example.com" },
      ]);
    });

    const response = await request(app).get("/investors");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Test Investor", email: "test@example.com" },
    ]);
  });

  test("GET /investors/:id - Buscar investidor específico", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, [
        { id: 1, name: "Test Investor", email: "test@example.com" },
      ]);
    });

    const response = await request(app).get("/investors/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "Test Investor",
      email: "test@example.com",
    });
  });

  test("PUT /investors/:id - Atualizar investidor", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app)
      .put("/investors/1")
      .send({ name: "Updated Investor", email: "updated@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Investidor atualizado com sucesso",
    });
  });

  test("DELETE /investors/:id - Remover investidor", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete("/investors/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Investidor deletado com sucesso",
    });
  });
});
