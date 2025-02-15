const request = require("supertest");
const express = require("express");
const exchangeRateRoutes = require("../exchangeRateRoutes");

const app = express();
app.use(express.json());
app.use("/exchange-rate", exchangeRateRoutes);

jest.mock("../../config/database", () => ({
  query: jest.fn(),
}));

const db = require("../../config/database");

describe("Exchange Rate Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST /exchange-rate - Deve inserir uma taxa de câmbio", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const res = await request(app).post("/exchange-rate").send({
      date: "2025-02-14",
      daily_variation: 1.5,
      daily_rate: 5.3,
      currency_id: 1,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "Taxa de câmbio inserida com sucesso"
    );
    expect(res.body).toHaveProperty("id", 1);
  });

  test("GET /exchange-rate - Deve retornar todas as taxas de câmbio", async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ id: 1, date: "2025-02-14", daily_rate: 5.3 }]);
    });

    const res = await request(app).get("/exchange-rate");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, date: "2025-02-14", daily_rate: 5.3 }]);
  });

  test("GET /exchange-rate/:id - Deve retornar uma taxa de câmbio específica", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, [{ id: 1, date: "2025-02-14", daily_rate: 5.3 }]);
    });

    const res = await request(app).get("/exchange-rate/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, date: "2025-02-14", daily_rate: 5.3 });
  });

  test("PUT /exchange-rate/:id - Deve atualizar uma taxa de câmbio", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).put("/exchange-rate/1").send({
      date: "2025-02-14",
      daily_variation: 2.0,
      daily_rate: 5.5,
      currency_id: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Taxa de câmbio atualizada com sucesso"
    );
  });

  test("DELETE /exchange-rate/:id - Deve deletar uma taxa de câmbio", async () => {
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).delete("/exchange-rate/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Taxa de câmbio deletada com sucesso"
    );
  });
});
