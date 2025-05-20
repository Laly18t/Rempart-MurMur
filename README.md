# Rempart MurMur

Une application 3D interactive construite avec **React**, **Three.js**, et **@react-three/fiber**, propulsée par **Vite** pour un développement rapide.


## Start
- npm i 
- npm run dev


## Stack technique

- **React 19** – Interface utilisateur
- **Three.js** – Moteur 3D WebGL
- **@react-three/fiber** – Intégration React pour Three.js
- **@react-three/drei** – Utilitaires pour R3F
- **postprocessing** – Effets visuels avancés
- **zustand** – Store/state global pour React
- **r3f-perf** – Outils de debug pour la performance
- **Vite** – Serveur de développement et bundler ultra-rapide


## Arborescence

Rempart-MurMur/
├── public/
│   └── audio                      # fichier mp3 de la voix-off
│   └── models                     # assets 3D 
├── src/
│   ├── App.jsx                    # Composant principal : crée la scène 3D
│   ├── Scene.jsx                  # Contenu de la scène (objets, interactions)
│   ├── constants.js               # Fichier de configuration (ex: SETTINGS.DEBUG)
│   └── Composants/                # Dossier des composants
│   └── hooks/                     # Dossier des hooks
│   └── Models/                    # Dossier des models 3D transformé en composants
│
├── package.json                   # Dépendances et scripts npm
├── vite.config.js                 # Configuration du bundler Vite
└── README.md                      # Documentation du projet