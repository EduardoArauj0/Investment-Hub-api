const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.post("/", (req, res) => {
  const { date, daily_variation, daily_rate, currency_id } = req.body;

  if (
    !date ||
    daily_variation === undefined ||
    daily_rate === undefined ||
    !currency_id
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  const query =
    "INSERT INTO ExchangeRate (date, daily_variation, daily_rate, currency_id) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [date, daily_variation, daily_rate, currency_id],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir taxa de câmbio:", err);
        return res
          .status(500)
          .json({ message: "Erro ao inserir taxa de câmbio" });
      }
      res.status(201).json({
        message: "Taxa de câmbio inserida com sucesso",
        id: result.insertId,
      });
    }
  );
});

router.get("/", (req, res) => {
  const query = "SELECT * FROM ExchangeRate";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar taxas de câmbio:", err);
      return res
        .status(500)
        .json({ message: "Erro ao buscar taxas de câmbio" });
    }
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM ExchangeRate WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar taxa de câmbio:", err);
      return res.status(500).json({ message: "Erro ao buscar taxa de câmbio" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Taxa de câmbio não encontrada" });
    }
    res.json(results[0]);
  });
});

router.get("/recent", (req, res) => {
  const query = `
        SELECT ER.*, C.name AS currency_name, C.type AS currency_type
        FROM ExchangeRate ER
        JOIN Currency C ON ER.currency_id = C.id
        WHERE ER.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar taxas de câmbio recentes:", err);
      return res
        .status(500)
        .json({ message: "Erro ao buscar taxas de câmbio recentes" });
    }
    res.json(results);
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { date, daily_variation, daily_rate, currency_id } = req.body;

  if (
    !date ||
    daily_variation === undefined ||
    daily_rate === undefined ||
    !currency_id
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  const query =
    "UPDATE ExchangeRate SET date = ?, daily_variation = ?, daily_rate = ?, currency_id = ? WHERE id = ?";
  db.query(
    query,
    [date, daily_variation, daily_rate, currency_id, id],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar taxa de câmbio:", err);
        return res
          .status(500)
          .json({ message: "Erro ao atualizar taxa de câmbio" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Taxa de câmbio não encontrada" });
      }
      res.json({ message: "Taxa de câmbio atualizada com sucesso" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM ExchangeRate WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar taxa de câmbio:", err);
      return res
        .status(500)
        .json({ message: "Erro ao deletar taxa de câmbio" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Taxa de câmbio não encontrada" });
    }
    res.json({ message: "Taxa de câmbio deletada com sucesso" });
  });
});

router.delete("/old", (req, res) => {
  const query =
    "DELETE FROM ExchangeRate WHERE date < DATE_SUB(CURDATE(), INTERVAL 30 DAY)";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Erro ao deletar taxas de câmbio antigas:", err);
      return res
        .status(500)
        .json({ message: "Erro ao deletar taxas de câmbio antigas" });
    }
    res.json({
      message: `${result.affectedRows} registros de taxas de câmbio foram removidos`,
    });
  });
});

module.exports = router;
