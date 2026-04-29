const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.post("/webhook/mercadopago", (req, res) => {
  console.log("Webhook recebido:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});
