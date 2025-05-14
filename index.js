const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

/**
 * Route racine pour vérifier que le serveur est en ligne
 */
app.get("/", (req, res) => {
  res.send("✅ API Conforama proxy est en ligne");
});

/**
 * Route de recherche de produits par mot-clé
 * Exemple : /search?text=canape&page=1
 */
app.get("/search", async (req, res) => {
  const { text, page = 1 } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Le paramètre 'text' est requis." });
  }

  try {
    const response = await axios.get("https://www.conforama.fr/geo/search", {
      params: { text, page }
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erreur recherche :", err.message);
    res.status(500).json({ error: "Erreur lors de la recherche Conforama." });
  }
});

/**
 * Route pour obtenir les détails d’un produit par son ID
 * Exemple : /product/623075
 */
app.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const response = await axios.get(`https://www.conforama.fr/geo/product/${productId}`);

    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(404).json({ error: "Produit introuvable." });
    }

    res.json(response.data);
  } catch (err) {
    console.error("Erreur produit :", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération du produit." });
  }
});

// Lancement du serveur avec le port donné par Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur proxy Conforama actif sur le port ${PORT}`);
});
