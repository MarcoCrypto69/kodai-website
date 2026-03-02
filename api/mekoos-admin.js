const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

const KV_KEY = 'mekoos:kb';
const PASSWORD = process.env.MEKOOS_ADMIN_PASSWORD || 'mekoos2026';

function getRedis() {
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    connectTimeout: 5000,
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — charger la KB
  if (req.method === 'GET') {
    const { password } = req.query;
    if (password !== PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    let content;
    try {
      const redis = getRedis();
      content = await redis.get(KV_KEY);
      redis.disconnect();
    } catch (e) {
      console.error('Redis GET error:', e.message);
    }
    if (!content) {
      content = fs.readFileSync(path.join(__dirname, '../mekoos-kb.md'), 'utf8');
    }
    return res.status(200).json({ content });
  }

  // POST — sauvegarder la KB
  if (req.method === 'POST') {
    const { password, content } = req.body || {};
    if (password !== PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    if (!content || content.trim().length < 50) {
      return res.status(400).json({ error: 'Contenu trop court' });
    }
    try {
      const redis = getRedis();
      await redis.set(KV_KEY, content);
      redis.disconnect();
      return res.status(200).json({ ok: true, chars: content.length });
    } catch (e) {
      console.error('Redis SET error:', e.message);
      return res.status(500).json({ error: 'Erreur Redis: ' + e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
