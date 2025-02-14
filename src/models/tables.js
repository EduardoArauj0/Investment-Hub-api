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
}

module.exports = new Tables();
