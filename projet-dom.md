# Projet — Site Inventaire Automobile Dom
**Client :** Dom (Joliette)
**Date :** 23 février 2026
**Référence :** KAI-2026-001
**Statut :** Soumission envoyée — en attente de confirmation

---

## Contexte

Dom est un vendeur de voitures usagées à Joliette. Il a environ 10-15 véhicules en inventaire, un garage pignon sur rue, et roule présentement sur Facebook Marketplace avec un petit site basique. Il veut un système complet qui automatise sa vente en ligne — de l'affichage de l'inventaire jusqu'à la réservation avec dépôt.

Dom est un ami personnel. Premier client KodAI. Bénéficie du Cercle Fondateur (30% de rabais).

---

## Stack technique

| Composant | Technologie |
|---|---|
| Frontend | Next.js (React) |
| Backend / DB | Supabase (PostgreSQL + Auth + API) |
| Images | Cloudinary (upload, compression, galerie) |
| Paiements | Stripe |
| Réservations | Calendly |
| Emails automatiques | Supabase + Resend ou Nodemailer |
| Hébergement | Vercel |

---

## Fonctionnalités détaillées

### Inventaire public
- Page liste de tous les véhicules disponibles
- Filtres : prix, année, marque, kilométrage
- Statut en temps réel : **Disponible / Réservé / Vendu**
- Galerie photos par véhicule (plusieurs photos)
- Description détaillée : année, marque, modèle, km, prix, options

### Fiche véhicule
- Galerie photos full-screen
- Bouton "Je suis intéressé" → formulaire (nom, email, téléphone)
- Bouton "Réserver ce véhicule" → dépôt Stripe + booking essai routier Calendly
- Reçu PDF automatique au client après dépôt (montant, véhicule, dates de validité)
- Statut mis à jour automatiquement à "Réservé" après dépôt

### Formulaire d'échange
- Le client soumet son véhicule actuel (année, marque, modèle, km, état, photos)
- Dom reçoit une notification avec tous les détails

### Relances automatiques
- Email automatique au client quand il soumet un formulaire d'intérêt
- Relance automatique si pas de réponse après X jours
- Notification à Dom à chaque nouvelle soumission ou réservation

### Panel admin (accès Dom uniquement)
- Login sécurisé
- Ajouter un véhicule : titre, prix, km, année, marque, modèle, description, photos (upload direct), statut
- Modifier / supprimer un véhicule
- **Génération automatique de description par IA** (option) — Dom entre les infos de base, l'IA génère le texte de vente
- Voir les demandes d'intérêt et réservations reçues

### Agent IA sur le site (option)
- Chatbot qui connaît l'inventaire en temps réel (connecté à Supabase)
- Répond aux questions des clients 24/7 : "Avez-vous des pickup sous 15 000$?", "C'est quoi le kilométrage du Civic?"
- Redirige vers le formulaire ou la réservation

### SEO
- Pages optimisées pour Google à Joliette et région
- Balises meta, titres, descriptions générés automatiquement par véhicule
- Schema.org pour les véhicules (Product schema)

---

## Tarifs

### Base — Système de vente automatisé complet

| | Prix régulier | Cercle Fondateur (−30%) |
|---|---|---|
| Base | 5 500$ | **3 850$** |

**Inclus :**
- Inventaire complet avec galerie photos
- Statut temps réel Disponible/Réservé/Vendu
- Formulaire d'intérêt par véhicule
- Formulaire d'échange de véhicule
- Réservation + dépôt Stripe
- Reçu PDF automatique
- Booking essai routier Calendly
- Relances automatiques par email
- Notifications à Dom
- Panel admin complet
- SEO local Joliette
- Hébergement inclus — aucun frais mensuel
- Optimisé mobile
- Corrections illimitées jusqu'à satisfaction
- **Livraison : 2 semaines**

### Options

| Option | Prix régulier | Cercle Fondateur (−30%) |
|---|---|---|
| Descriptions IA automatiques | 500$ | **350$** |
| Agent IA sur le site (inventaire 24/7) | 800$ | **560$** |

### Totaux avec taxes

| | Sans options | Avec options IA |
|---|---|---|
| Sous-total | 3 850$ | 5 460$ |
| TPS (5%) | 192,50$ | 273,00$ |
| TVQ (9,975%) | 384,04$ | 544,64$ |
| **Total** | **4 426,54$** | **6 277,64$** |

### Option paiement comptant (aucune taxe)

| | Sans options | Avec options IA |
|---|---|---|
| **Total comptant** | **3 850$** | **5 460$** |
| Économie | 576,54$ | 817,64$ |

### Paiement en 4 versements

| Versement | Sans options | Avec options IA |
|---|---|---|
| Au démarrage | 1 106,64$ | 1 569,41$ |
| Semaine 1 | 1 106,64$ | 1 569,41$ |
| Semaine 2 | 1 106,64$ | 1 569,41$ |
| À la livraison | 1 106,62$ | 1 569,41$ |
| **Total** | **4 426,54$** | **6 277,64$** |

---

## Lien soumission

**kodai.ca/q-KAI001.html**

---

## Notes importantes

- Dom gère son inventaire lui-même via le panel admin — photos, prix, statuts. Aucune intervention de KodAI après livraison.
- Cloudinary gère le stockage et la compression des images (plan gratuit suffisant pour démarrer).
- Le 30% de rabais Cercle Fondateur est conditionnel à un témoignage et une référence dans son réseau.
- Valeur marché de ce projet : 15 000$ – 25 000$ en agence traditionnelle.

---

## Prochaines étapes

- [ ] Confirmation de Dom (mercredi)
- [ ] Choix des options IA (oui/non)
- [ ] Mode de paiement (versements ou comptant)
- [ ] Collecte des assets : logo, photos, couleurs souhaitées
- [ ] Démarrage du projet + premier versement
