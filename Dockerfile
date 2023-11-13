# Utilisez l'image officielle de Node.js comme image de base
FROM node:20

# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copiez le fichier package.json et package-lock.json (si disponible) dans le conteneur
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install

# Copiez les fichiers et dossiers du projet dans le conteneur
COPY . .

# Exposez le port sur lequel le microservice s'exécute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "app.js"]
