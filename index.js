const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.get("/search", async (req, res) => {
  const { text, page = 1 } = req.query;
  try {
    const response = await axios.get("https://www.conforama.fr/geo/search", {
      params: { text, page }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche Conforama." });
  }
});

app.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const response = await axios.get(`https://www.conforama.fr/geo/product/${productId}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du produit." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur proxy Conforama actif sur le port ${PORT}`);
});
