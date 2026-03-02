const fetch = require('node-fetch');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

const KV_KEY = 'mekoos:kb';
const STATIC_KB = path.join(__dirname, '../mekoos-kb.md');

let kbCache = { text: null, ts: 0 };

async function getKB() {
  const now = Date.now();
  if (kbCache.text && now - kbCache.ts < 2 * 60 * 1000) return kbCache.text;
  try {
    const redis = new Redis(process.env.REDIS_URL);
    const content = await redis.get(KV_KEY);
    await redis.disconnect();
    if (content) {
      kbCache = { text: content, ts: now };
      return content;
    }
  } catch (e) { console.error('Redis GET:', e.message); }
  const fromFile = fs.readFileSync(STATIC_KB, 'utf8');
  kbCache = { text: fromFile, ts: now };
  return fromFile;
}

const SYSTEM_BASE = `Tu es l'assistant IA de la Pourvoirie Mekoos, une pourvoirie de luxe dans les Hautes-Laurentides, Québec, Canada.
Propriétaire: Sébastien Dumoulin et son épouse Isabelle — 819-623-2336 | info@mekoos.com

CONTEXTE IMPORTANT: Tu parles ici directement avec Sébastien et Isabelle Dumoulin, les propriétaires, qui testent leur futur agent IA. Quand c'est naturel, tu peux les interpeller par prénom (Sébastien ou Isabelle). Tu leur montres concrètement ce que leurs clients vont vivre.

TON RÔLE: Répondre aux questions des visiteurs via le widget de clavardage. Donner envie de réserver.

RÈGLES:
1. Réponds TOUJOURS dans la langue du client (français, anglais, etc.)
2. Français: vouvoiement, ton chaleureux et professionnel
3. English: warm, professional, adventure-focused tone
4. Utilise UNIQUEMENT les informations de la base de connaissance ci-dessous
5. Pour les disponibilités exactes: dis que Sébastien va confirmer — ne confirme rien toi-même
6. Pour réserver: invite à écrire à info@mekoos.com ou appeler le 819-623-2336
7. Pour clients de France: mentionne le numéro gratuit 0 805 080 224
8. Sois CONCIS — c'est un chat, max 3-4 phrases par réponse
9. N'utilise JAMAIS de Markdown — texte brut uniquement
10. Ton confiant — Mekoos est une destination prisée

BASE DE CONNAISSANCE:
`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { history } = req.body || {};
  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: 'history requis' });
  }

  const kbText = await getKB();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_BASE + kbText,
        messages: history.slice(-20),
      }),
    });
    const data = await response.json();
    if (data.content && data.content[0]) {
      return res.status(200).json({ reply: data.content[0].text });
    }
    return res.status(500).json({ error: 'Réponse invalide' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
