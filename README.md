# Test de Sélection Chatter OnlyFans

Une application Next.js complète pour évaluer les compétences des candidats chatter OnlyFans. Cette application transforme l'interface HTML originale en une application React fonctionnelle avec TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- **Interface Multi-étapes** : Navigation fluide entre les différentes sections du test
- **Test de Vitesse d'Écriture** : Minuteur de 60 secondes avec suivi en temps réel de la précision
- **Mises en Situation** : 5 scénarios concrets pour évaluer la logique de réponse
- **Questions de Réflexion** : Évaluation de la compréhension stratégique
- **Résultats Complets** : Compilation automatique et envoi par email
- **Design Responsive** : Interface adaptée pour desktop et mobile
- **Thème Personnalisé** : Système de couleurs cohérent avec votre design

## 🛠️ Technologies Utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour plus de robustesse
- **Tailwind CSS** - Framework CSS utilitaire avec design system personnalisé
- **React Hooks** - Gestion d'état moderne avec useState et useEffect
- **Inter Font** - Police Google Fonts pour une typographie moderne

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Navigateur moderne (Chrome, Firefox, Safari, Edge)

## 🚀 Installation et Démarrage

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd onlyfans-chatter-test
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Accéder à l'application**
   Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📱 Structure du Test

### 1. **Introduction**
- Présentation du test et des objectifs
- Instructions détaillées pour les candidats
- Recommandations d'utilisation (ordinateur recommandé)

### 2. **Informations Personnelles**
- Nom et prénom
- Adresse email
- Numéro WhatsApp (optionnel)

### 3. **Test de Vitesse d'Écriture**
- Durée : 60 secondes
- Objectif : 30 mots par minute minimum
- Suivi en temps réel de la précision
- Calcul automatique des résultats (MPM et pourcentage de précision)

### 4. **Mises en Situation**
5 scénarios réalistes :
- Demande de contenu explicite inappropriée
- Doute sur l'authenticité de la modèle
- Négociation de prix
- Demande de contenu gratuit
- Tentative de changement de plateforme

### 5. **Réflexion & Stratégie**
3 questions ouvertes sur :
- L'équilibre relation/vente
- Gestion des gros dépensiers
- Importance de l'écoute client

### 6. **Résultats**
- Compilation complète de toutes les réponses
- Envoi automatique par email
- Fallback modal en cas de problème d'envoi

## 🎨 Design System

Le projet utilise un système de couleurs personnalisé :

- **Primaire** : Teintes d'émeraude pour les actions principales
- **Secondaire** : Tons neutres et stone pour les backgrounds
- **States** : Couleurs spécifiques pour les états actifs/complétés
- **Typography** : Inter font avec différentes graisses

## 📧 Fonctionnalité Email

- Génération automatique d'un email avec tous les résultats
- Destinataire fixe : `evan.gssln@gmail.com`
- Fallback avec modal de copie en cas d'échec du client mail
- Format structuré avec toutes les données du candidat

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start

# Linting
npm run lint
```

## 📂 Structure du Projet

```
src/
├── app/
│   ├── globals.css      # Styles globaux + design system
│   ├── layout.tsx       # Layout principal avec meta tags
│   └── page.tsx         # Composant principal du test
└── ...
```

## 🌐 Déploiement

L'application peut être facilement déployée sur :

- **Vercel** (recommandé pour Next.js)
- **Netlify**
- **Railway**
- **Heroku**

### Déploiement Vercel (1-click)

1. Push le code sur GitHub
2. Connecter le repository à Vercel
3. Le déploiement se fait automatiquement

## 🔍 Fonctionnalités Techniques

### Gestion d'État
- State management avec React hooks
- Persistence des données pendant la navigation
- Nettoyage automatique des timers

### Timer de Frappe
- Démarrage automatique à la première saisie
- Arrêt automatique à la fin du temps
- Calculs en temps réel de la précision

### Navigation
- Barre de progression visuelle
- Validation avant passage à l'étape suivante
- Boutons contextuels selon l'étape

### Responsive Design
- Interface adaptée mobile/desktop
- Touch-friendly pour les interactions
- Optimisé pour les tests de frappe sur ordinateur

## 🚧 Améliorations Possibles

- [ ] Sauvegarde automatique des réponses (localStorage)
- [ ] Backend API pour stocker les résultats
- [ ] Authentification administrateur
- [ ] Dashboard de gestion des candidats
- [ ] Export PDF des résultats
- [ ] Tests unitaires et d'intégration
- [ ] Analytics de performance
- [ ] Mode sombre/clair

## 📄 Licence

Ce projet est propriétaire et destiné à un usage interne spécifique.

## 🤝 Support

Pour toute question ou assistance technique, contactez l'équipe de développement.