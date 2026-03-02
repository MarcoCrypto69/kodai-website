const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

const KV_KEY = 'mekoos:kb';
const PASSWORD = process.env.MEKOOS_ADMIN_PASSWORD || 'mekoos2026';

const REDIS_OPTS = {
  maxRetriesPerRequest: 0,
  connectTimeout: 3000,
  lazyConnect: true,
};

async function getRedis() {
  if (!process.env.REDIS_URL) return null;
  try {
    const redis = new Redis(process.env.REDIS_URL, REDIS_OPTS);
    await redis.connect();
    return redis;
  } catch (e) {
    console.error('Redis connect:', e.message);
    return null;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { password } = req.query;
    if (password !== PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    let content;
    const redis = await getRedis();
    if (redis) {
      try {
        content = await redis.get(KV_KEY);
      } catch (e) { console.error('Redis GET:', e.message); }
      finally { redis.disconnect(); }
    }
    if (!content) {
      content = fs.readFileSync(path.join(__dirname, '../mekoos-kb.md'), 'utf8');
    }
    return res.status(200).json({ content });
  }

  if (req.method === 'POST') {
    const { password, content } = req.body || {};
    if (password !== PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    if (!content || content.trim().length < 50) {
      return res.status(400).json({ error: 'Contenu trop court' });
    }
    const redis = await getRedis();
    if (!redis) {
      return res.status(500).json({ error: 'Redis non disponible — vérifie la variable REDIS_URL dans Vercel' });
    }
    try {
      await redis.set(KV_KEY, content);
      return res.status(200).json({ ok: true, chars: content.length });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    } finally {
      redis.disconnect();
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
