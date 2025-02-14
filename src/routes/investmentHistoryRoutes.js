const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.post("/", (req, res) => {
  const {
    initial_amount,
    months,
    interest_rate,
    final_amount,
    currency_id,
    investor_id,
  } = req.body;

  if (
    !initial_amount ||
    !months ||
    !interest_rate ||
    !final_amount ||
    !currency_id ||
    !investor_id
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  const query = `
        INSERT INTO InvestmentHistory (initial_amount, months, interest_rate, final_amount, currency_id, investor_id)
        VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      initial_amount,
      months,
      interest_rate,
      final_amount,
      currency_id,
      investor_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir histórico de investimento:", err);
        return res
          .status(500)
          .json({ message: "Erro ao inserir histórico de investimento" });
      }
      res.status(201).json({
        message: "Histórico de investimento inserido com sucesso",
        id: result.insertId,
      });
    }
  );
});

router.get("/", (req, res) => {
  const query = `
        SELECT IH.*, C.name AS currency_name, I.name AS investor_name
        FROM InvestmentHistory IH
        JOIN Currency C ON IH.currency_id = C.id
        JOIN Investor I ON IH.investor_id = I.id
    `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar históricos de investimento:", err);
      return res
        .status(500)
        .json({ message: "Erro ao buscar históricos de investimento" });
    }
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM InvestmentHistory WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar histórico de investimento:", err);
      return res
        .status(500)
        .json({ message: "Erro ao buscar histórico de investimento" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Histórico de investimento não encontrado" });
    }
    res.json(results[0]);
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    initial_amount,
    months,
    interest_rate,
    final_amount,
    currency_id,
    investor_id,
  } = req.body;

  if (
    !initial_amount ||
    !months ||
    !interest_rate ||
    !final_amount ||
    !currency_id ||
    !investor_id
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  const query = `
        UPDATE InvestmentHistory
        SET initial_amount = ?, months = ?, interest_rate = ?, final_amount = ?, currency_id = ?, investor_id = ?
        WHERE id = ?`;

  db.query(
    query,
    [
      initial_amount,
      months,
      interest_rate,
      final_amount,
      currency_id,
      investor_id,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar histórico de investimento:", err);
        return res
          .status(500)
          .json({ message: "Erro ao atualizar histórico de investimento" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Histórico de investimento não encontrado" });
      }
      res.json({ message: "Histórico de investimento atualizado com sucesso" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM InvestmentHistory WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar histórico de investimento:", err);
      return res
        .status(500)
        .json({ message: "Erro ao deletar histórico de investimento" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Histórico de investimento não encontrado" });
    }
    res.json({ message: "Histórico de investimento deletado com sucesso" });
  });
});

module.exports = router;
