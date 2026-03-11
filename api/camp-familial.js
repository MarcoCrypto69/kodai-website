const fetch = require('node-fetch');

const SYSTEM_PROMPT = `Tu es l'assistant virtuel du Camp Familial Saint-Urbain, un organisme à but non lucratif fondé en 1927, situé au 1651 chemin Chertsey, Chertsey, QC J0K 3K0. Bientôt 100 ans!

MISSION: Rendre les vacances et loisirs en nature accessibles aux familles défavorisées, groupes ethnoculturels, personnes à besoins spéciaux et aînés. Réductions de 25% à 93% selon le revenu.

CONTACT:
- Téléphone: (438) 788-3493 (appuyer 1 pour réception)
- Sans frais: 1 (888) 882-4719
- Heures: 7 jours/semaine, 9h à 16h30
- Facebook: @CFSUrbain

CAMPING 2026:
- Sites de luxe: eau potable + électricité 20A, foyer privé, table pique-nique, éclairage nocturne
- Vue sur le lac, à 1 minute de la cafétéria
- 6 terrains: A, B, C, D, F (tentes jusqu'à 12 personnes) + E (site groupe étoile, 3 zones séparées)
- DISPONIBILITÉ: avant le 19 juin ET après le 16 août 2026 (excluant fête du Travail)
- VR moins de 19 pieds / 30A: bientôt disponible — pas de vidange eaux usées sur place

PROGRAMMES:
- Camps d'été 2026
- Programmes congés scolaires
- Journées Plein Air (réservation via formulaire sur campfamilial.org)
- Hébergement événements et mariages

SUPERFICIE: 1,7 km² de nature exclusive, lac sur place, défibrillateur (DEA) disponible

RÈGLES: Réponds toujours en français, de façon chaleureuse et concise (3-4 phrases max). Si tu ne connais pas la réponse exacte, dirige vers le (438) 788-3493. Mentionne toujours les réductions disponibles selon le revenu quand c'est pertinent. Ne jamais inventer des prix ou disponibilités non confirmés.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
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
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return res.status(200).json({ message: data.content[0].text });
    } else {
      return res.status(500).json({ error: 'Réponse invalide', detail: data });
    }
  } catch (error) {
    console.error('Camp Familial chat error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
