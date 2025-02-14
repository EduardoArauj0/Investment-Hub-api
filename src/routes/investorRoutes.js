const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.post("/", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Nome e email são obrigatórios" });
  }

  const checkEmailQuery = "SELECT * FROM Investor WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Erro ao verificar e-mail:", err);
      return res.status(500).json({ message: "Erro ao verificar e-mail" });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const insertQuery = "INSERT INTO Investor (name, email) VALUES (?, ?)";
    db.query(insertQuery, [name, email], (err, result) => {
      if (err) {
        console.error("Erro ao inserir investidor:", err);
        return res.status(500).json({ message: "Erro ao inserir investidor" });
      }
      res
        .status(201)
        .json({
          message: "Investidor inserido com sucesso",
          id: result.insertId,
        });
    });
  });
});

router.get("/", (req, res) => {
  const query = "SELECT * FROM Investor";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar investidores:", err);
      return res.status(500).json({ message: "Erro ao buscar investidores" });
    }
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Investor WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar investidor:", err);
      return res.status(500).json({ message: "Erro ao buscar investidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Investidor não encontrado" });
    }
    res.json(results[0]);
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Nome e email são obrigatórios" });
  }

  const query = "UPDATE Investor SET name = ?, email = ? WHERE id = ?";
  db.query(query, [name, email, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar investidor:", err);
      return res.status(500).json({ message: "Erro ao atualizar investidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Investidor não encontrado" });
    }
    res.json({ message: "Investidor atualizado com sucesso" });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const deleteInvestmentsQuery =
    "DELETE FROM InvestmentHistory WHERE investor_id = ?";
  db.query(deleteInvestmentsQuery, [id], (err) => {
    if (err) {
      console.error("Erro ao deletar investimentos do investidor:", err);
      return res
        .status(500)
        .json({ message: "Erro ao deletar investimentos do investidor" });
    }

    const deleteInvestorQuery = "DELETE FROM Investor WHERE id = ?";
    db.query(deleteInvestorQuery, [id], (err, result) => {
      if (err) {
        console.error("Erro ao deletar investidor:", err);
        return res.status(500).json({ message: "Erro ao deletar investidor" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Investidor não encontrado" });
      }
      res.json({ message: "Investidor deletado com sucesso" });
    });
  });
});

module.exports = router;
