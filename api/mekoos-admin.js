const { kv } = require('@vercel/kv');
const fs = require('fs');
const path = require('path');

const KV_KEY = 'mekoos:kb';
const PASSWORD = process.env.MEKOOS_ADMIN_PASSWORD || 'mekoos2026';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — charger la KB courante (protégé par mot de passe en query string)
  if (req.method === 'GET') {
    const { password } = req.query;
    if (password !== PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    try {
      let content = await kv.get(KV_KEY);
      if (!content) {
        // Fallback: lire le fichier statique
        content = fs.readFileSync(path.join(__dirname, '../mekoos-kb.md'), 'utf8');
      }
      return res.status(200).json({ content });
    } catch (e) {
      // Fallback si KV indisponible
      const content = fs.readFileSync(path.join(__dirname, '../mekoos-kb.md'), 'utf8');
      return res.status(200).json({ content });
    }
  }

  // POST — sauvegarder la nouvelle KB
  if (req.method === 'POST') {
    const { password, content } = req.body || {};

    if (password !== PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    if (!content || content.trim().length < 50) {
      return res.status(400).json({ error: 'Contenu trop court' });
    }

    await kv.set(KV_KEY, content);
    return res.status(200).json({ ok: true, chars: content.length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
