const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const KV_KEY = 'mekoos:kb';
const PASSWORD = process.env.MEKOOS_ADMIN_PASSWORD || 'mekoos2026';

// Extrait les credentials REST depuis REDIS_URL
// Format Upstash: rediss://default:TOKEN@HOSTNAME.upstash.io:PORT
function getUpstash() {
  const url = process.env.REDIS_URL || '';
  const m = url.match(/rediss?:\/\/[^:]+:([^@]+)@([^:/]+)/);
  if (!m) return null;
  return { restUrl: `https://${m[2]}`, token: m[1] };
}

async function kvGet(key) {
  const u = getUpstash();
  if (!u) return null;
  const r = await fetch(`${u.restUrl}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${u.token}` },
  });
  const data = await r.json();
  return data.result || null;
}

async function kvSet(key, value) {
  const u = getUpstash();
  if (!u) throw new Error('REDIS_URL non configuré');
  const r = await fetch(`${u.restUrl}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${u.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  return r.json();
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
    try { content = await kvGet(KV_KEY); } catch (e) { console.error(e.message); }
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
    try {
      await kvSet(KV_KEY, content);
      return res.status(200).json({ ok: true, chars: content.length });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
