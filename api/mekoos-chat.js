const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Knowledge base chargée une fois au cold start
let KB_TEXT = '';
try {
  KB_TEXT = fs.readFileSync(path.join(__dirname, '../mekoos-kb.md'), 'utf8');
} catch (e) {
  KB_TEXT = '(knowledge base non disponible)';
}

const SYSTEM_PROMPT = `Tu es l'assistant IA de la Pourvoirie Mekoos, une pourvoirie de luxe dans les Hautes-Laurentides, Québec, Canada.
Propriétaire: Sébastien Dumoulin — 819-623-2336 | info@mekoos.com

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
${KB_TEXT}`;

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { history } = req.body || {};
  if (!history || !Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: 'history requis' });
  }

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
        system: SYSTEM_PROMPT,
        messages: history.slice(-20),
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return res.status(200).json({ reply: data.content[0].text });
    } else {
      return res.status(500).json({ error: 'Réponse invalide' });
    }
  } catch (error) {
    console.error('Mekoos chat error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
