const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.post("/", (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: "Nome e tipo são obrigatórios" });
  }

  const query = "INSERT INTO Currency (name, type) VALUES (?, ?)";
  db.query(query, [name, type], (err, result) => {
    if (err) {
      console.error("Erro ao inserir moeda:", err);
      return res.status(500).json({ message: "Erro ao inserir moeda" });
    }
    res
      .status(201)
      .json({ message: "Moeda inserida com sucesso", id: result.insertId });
  });
});

router.get("/", (req, res) => {
  const query = "SELECT * FROM Currency";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar moedas:", err);
      return res.status(500).json({ message: "Erro ao buscar moedas" });
    }
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Currency WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar moeda:", err);
      return res.status(500).json({ message: "Erro ao buscar moeda" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Moeda não encontrada" });
    }
    res.json(results[0]);
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Nome e tipo são obrigatórios" });
  }

  const query = "UPDATE Currency SET name = ?, type = ? WHERE id = ?";
  db.query(query, [name, type, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar moeda:", err);
      return res.status(500).json({ message: "Erro ao atualizar moeda" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Moeda não encontrada" });
    }
    res.json({ message: "Moeda atualizada com sucesso" });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Currency WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar moeda:", err);
      return res.status(500).json({ message: "Erro ao deletar moeda" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Moeda não encontrada" });
    }
    res.json({ message: "Moeda deletada com sucesso" });
  });
});

module.exports = router;
