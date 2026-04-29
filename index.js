const express = require("express");
const axios = require("axios");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
app.use(express.json());
app.use(cors());

const pagamentos = {};

app.post("/criar-pagamento", async (req, res) => {
  const { titulo, preco } = req.body;

  try {
    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      {
        items: [
          {
            title: titulo,
            quantity: 1,
            unit_price: Number(preco)
          }
        ],
        back_urls: {
          success: process.env.SITE_URL,
          failure: process.env.SITE_URL,
          pending: process.env.SITE_URL
        },
        auto_return: "approved"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    res.json({ link: response.data.init_point });

  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar pagamento" });
  }
});

app.post("/webhook", async (req, res) => {
  const payment = req.body.data;

  if (!payment) return res.sendStatus(200);

  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${payment.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    if (response.data.status === "approved") {
      pagamentos[payment.id] = "approved";
    }

  } catch (err) {}

  res.sendStatus(200);
});

app.get("/status/:id", (req, res) => {
  const status = pagamentos[req.params.id] || "pending";
  res.json({ status });
});

app.listen(3000, () => console.log("Servidor rodando"));
