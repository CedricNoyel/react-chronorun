# Comment lancer l'application
## Pour les utilisateurs
- Télécharger l'archive github

- Se rendre dans le dossier télécharger pour aller dans le dossier `ChroRun` puis `ChronoRun-win32-ia32`

- Lancer le .exe

## Pour les développeurs
### Visualiser l'application
 - Installer [npm](https://www.npmjs.com/get-npm)

- Utiliser la commande `npm install` dans le dossier github pour obtenir les différents package nécessaires

- Utiliser la commande `electron .` pour visualiser l'application

### Build l'applcation
- Pour rebuild l'application suite à des changements dans le code utiliser la commande `npm run build` 
puis pour visualiser l'application `electron .`

- Pour recréer le .exe utiliser la commande `npm run build` puis `npm run package-win`