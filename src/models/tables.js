const db = require("../config/database");

class Tables {
  init() {
    console.log("Criando tabelas no banco MySQL...");

    const createCurrencyTable = `
            CREATE TABLE IF NOT EXISTS Currency (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                type ENUM('BRL', 'USD', 'EUR') NOT NULL
            )`;
    db.query(createCurrencyTable, this.handleError);

    const createExchangeRateTable = `
            CREATE TABLE IF NOT EXISTS ExchangeRate (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATE NOT NULL,
                daily_variation FLOAT NOT NULL,
                daily_rate FLOAT NOT NULL,
                currency_id INT NOT NULL,
                FOREIGN KEY (currency_id) REFERENCES Currency(id)
            )`;
    db.query(createExchangeRateTable, this.handleError);

    const createInvestorTable = `
            CREATE TABLE IF NOT EXISTS Investor (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            )`;
    db.query(createInvestorTable, this.handleError);

    const createInvestmentHistoryTable = `
            CREATE TABLE IF NOT EXISTS InvestmentHistory (
                id INT AUTO_INCREMENT PRIMARY KEY,
                initial_amount FLOAT NOT NULL,
                months INT NOT NULL,
                interest_rate FLOAT NOT NULL,
                final_amount FLOAT NOT NULL,
                currency_id INT NOT NULL,
                investor_id INT NOT NULL,
                FOREIGN KEY (currency_id) REFERENCES Currency(id),
                FOREIGN KEY (investor_id) REFERENCES Investor(id)
            )`;
    db.query(createInvestmentHistoryTable, this.handleError);

    console.log("Tabelas criadas com sucesso.");
  }

  handleError(err) {
    if (err) {
      console.error("Erro ao criar tabela:", err.message);
    }
  }

  seed() {
    console.log("Populando o banco de dados com dados iniciais...");

    const insertCurrencies = `
      INSERT INTO Currency (name, type) VALUES 
      ('Real Brasileiro', 'BRL'),
      ('Dólar Americano', 'USD'),
      ('Euro', 'EUR')
      ON DUPLICATE KEY UPDATE name = VALUES(name), type = VALUES(type)`;

    db.query(insertCurrencies, (err) => {
      if (err) {
        console.error("Erro ao inserir moedas:", err.message);
      } else {
        console.log("Moedas inseridas com sucesso.");
      }
    });

    const insertExchangeRates = `
      INSERT INTO ExchangeRate (date, daily_variation, daily_rate, currency_id) VALUES 
      ('2025-02-01', 0.5, 5.25, 2),
      ('2025-02-02', -0.3, 5.22, 3)
      ON DUPLICATE KEY UPDATE daily_variation = VALUES(daily_variation), daily_rate = VALUES(daily_rate)`;

    db.query(insertExchangeRates, (err) => {
      if (err) {
        console.error("Erro ao inserir taxas de câmbio:", err.message);
      } else {
        console.log("Taxas de câmbio inseridas com sucesso.");
      }
    });

    const insertInvestors = `
      INSERT INTO Investor (name, email) VALUES 
      ('Bruno Alves', 'bruno.alves@email.com'),
      ('Eduardo Araujo', 'eduardo.araujo@email.com')
      ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email)`;

    db.query(insertInvestors, (err) => {
      if (err) {
        console.error("Erro ao inserir investidores:", err.message);
      } else {
        console.log("Investidores inseridos com sucesso.");
      }
    });

    const insertInvestments = `
      INSERT INTO InvestmentHistory (initial_amount, months, interest_rate, final_amount, currency_id, investor_id) VALUES 
      (10000, 12, 5.5, 10550, 2, 1),
      (5000, 24, 4.2, 5200, 3, 2)
      ON DUPLICATE KEY UPDATE 
          initial_amount = VALUES(initial_amount), 
          months = VALUES(months), 
          interest_rate = VALUES(interest_rate), 
          final_amount = VALUES(final_amount)`;

    db.query(insertInvestments, (err) => {
      if (err) {
        console.error("Erro ao inserir investimentos:", err.message);
      } else {
        console.log("Histórico de investimentos inserido com sucesso.");
      }
    });
  }
}
module.exports = new Tables();
