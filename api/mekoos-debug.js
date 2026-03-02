module.exports = function handler(req, res) {
  // Afficher seulement les noms (pas les valeurs) pour trouver la bonne variable
  const keys = Object.keys(process.env).sort();
  res.json({ keys });
};
