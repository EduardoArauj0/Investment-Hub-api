const express = require("express");
const bodyParser = require("body-parser");
const tables = require("./src/models/tables");
const currencyRoutes = require("./src/routes/currencyRoutes");
const exchangeRateRoutes = require("./src/routes/exchangeRateRoutes");
const investorRoutes = require("./src/routes/investorRoutes");
const investmentHistoryRoutes = require("./src/routes/investmentHistoryRoutes");

const app = express();

if (process.env.RUN_SEED === "true") {
  tables.init();
  //tables.seed();
}

app.use(bodyParser.json());
app.use("/currency", currencyRoutes);
app.use("/exchange-rate", exchangeRateRoutes);
app.use("/investor", investorRoutes);
app.use("/investment-history", investmentHistoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
