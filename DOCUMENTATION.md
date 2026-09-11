# 🏥 Santé Prep INFAS - Documentation Complète

Application hybride (Online/Offline) de préparation aux concours INFAS 2026

## ✨ Fonctionnalités

### 👥 Espace Utilisateur
- Création de profil avec gestion d'appareil unique
- 60 questions par évaluation
- Système de codes d'accès premium (12 mois)
- Mode hors-ligne complet
- Résultats détaillés et explications

### 🤖 Génération de Questions
- **Online**: IA Gemini 1.5 pour QCM inédits
- **Offline**: Base locale de secours
- **2 niveaux**: BAC & BEPC
- **9 filières**: Infirmiers, Sage-femme, TBM, TIM, TMK, THA, PGP, TBIO, ORTHO

### 💎 Système Premium
- Codes d'accès générés par admin
- Activation automatique 12 mois
- ID appareil conserve l'accès
- Pas de revalidation après première activation
- Tarif: 5000 FCFA/an

### 🔐 Panneau Admin
- Authentification admin/admin2026
- Génération illimitée de codes
- Gestion complète des codes
- Suivi des utilisateurs

## 📦 Installation

```bash
# Prérequis: Node.js 16+

# 1. Cloner
git clone https://github.com/jonaskouadio8-prog/sante-prep-infas.git
cd sante-prep-infas

# 2. Installer
npm install

# 3. Développement
npm run dev

# 4. Production
npm run build

# 5. Android
npx cap add android
npx cap open android
```

## 🔧 Configuration

### Gemini API
Éditer `src/services/ai_generator.ts`:
```typescript
private static readonly GEMINI_API_KEY = 'YOUR_API_KEY';
```

### Admin Credentials
Par défaut: `admin / admin2026`
Éditer dans `src/services/admin.ts`

## 📁 Structure

```
src/
├── main.ts              # Application principale
├── style.css            # Styles
├── types/
│   └── index.ts        # Interfaces TypeScript
├── services/
│   ├── storage.ts      # Gestion localStorage
│   ├── admin.ts        # Auth admin
│   ├── ai_generator.ts # Génération IA
│   └── payment.ts      # Config paiement
└── data/
    ├── owner.ts        # Infos développeur
    └── questions.json  # Base locale
```

## 💻 API Gemini

**Modèle**: gemini-1.5-flash
**Endpoint**: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

Génère 60 QCM inédits adaptés au niveau et filière.

## 🔐 Sécurité

- ID d'appareil unique (localStorage)
- Sessions admin avec expiration 2h
- Codes d'accès avec limite d'usage
- Validation côté client
- Pas de données serveur

## 📱 Modes Opérationnels

### Mode Online
- Connexion Internet requise
- Génération IA en temps réel
- Expérience optimale

### Mode Offline
- Fonctionne sans Internet
- Utilise base locale
- Synchronisation après reconnexion

## 🎯 Cas d'Usage

**Étudiant**:
1. Créer profil
2. Sélectionner BAC/BEPC + filière
3. Passer 60 QCM
4. Voir résultats avec explications

**Admin**:
1. Connexion (admin/admin2026)
2. Générer code premium
3. Partager code utilisateur
4. Gérer/Désactiver codes

**Utilisateur Premium**:
1. Recevoir code
2. Entrer code
3. Accès débloqué 12 mois
4. Aucune limite

## 📊 Stack Technologique

- **Frontend**: TypeScript, HTML5, CSS3
- **Framework**: Vite 4.3.9
- **UI**: Tailwind CSS 3.3.2
- **Mobile**: Capacitor 5.0
- **API**: Google Gemini 1.5
- **Storage**: LocalStorage, JSON

## 🔑 Identifiants Test

```
Admin:
- Username: admin
- Password: admin2026

Durée session: 2 heures
```

## 📞 Support

**Koffi Kouadio Jonas**
- 📞 Orange: 0715431667
- 📞 MTN/Wave: 0595158016
- 📞 Moov: 0170214554
- 📧 Email: Koffikouadiojonas553@gmail.com

## 🐛 Troubleshooting

### App ne démarre pas?
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Pas de questions offline?
Vérifier `src/data/questions.json` n'est pas vide

### Gemini API erreur?
- Vérifier clé API
- Vérifier connexion Internet
- Vérifier quota API

### Code premium invalide?
Contacter le développeur pour un nouveau code

## 📄 Licence

Propriétaire © 2026 Koffi Kouadio Jonas

## 🎓 Version

Santé Prep INFAS v1.0.0
Concours 2026 - Côte d'Ivoire 🇨🇮

---

**Propulsé par Prof. Jojo - Expert INFAS**
