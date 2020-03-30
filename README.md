# PicSlalomFront

Partie front-end du projet de création d'un logiciel de GMAO dans le cadre du PIC Brasserie Du Slalom 2020.

## Pré-requis pour travailler sur le projet

### Installations préalables

Pour pouvoir commencer à travailler sur le projet, vous devez éxécuter les comandes suivantes :

* Installer NodeJS : `sudo apt install nodejs`

* Installer NPM : `sudo apt install npm`

* Avoir la version de npm la plus récente : `sudo npm install -g npm@latest`

* Installer le CLI Angular en global : `sudo npm install -g @angular/cli`

### Commandes utiles

Puis durant le dév, ces commandes vous seront utiles :

* `ng serve` : lance le serveur en local pour visualiser ses changements à la volée.

* `ng test` : lance l'utilitaire Karma utile à la visualisation des résultats de tests à la volée.

* `ng generate component <nom-du-composant>` / `ng g c <nom-du-composant>` : créer un nouveau composant Angular 9.

## Démarche à suivre pour le développement d'une feature

### Pré-requis : Cloner le projet en local

* `git clone <adresse-http | adresse-ssh>` : cloner le répertoire GIT en local.

__Vérification :__ Pour vérifier que vous avez bien toutes les branches, faites `git branch`. Pour avoir la branche `dev`, faites: `git checkout dev`.

### Créer une nouvelle feature

* Premièrement, allez sur la branche `dev` : `git checkout dev`.

* Créez votre nouvelle branche `feature/<id-tâche-clickup>` : `git checkout -b feature/<id-tâche-clickup> dev`.

* Mettez en ligne la création de votre branche : `git push --set-upstream origin feature/<id-tâche-clickup>`.

Votre branche est crée et votre environnement de développement est prêt.

### Commandes utiles

Voici les étapes à suivre à chaque développement :

* Faites vos modifications en local.

* Une fois vos modifications terminées, `git add .` à la racine du répertoire du projet.

* Faites votre commit : `git commit -m "Mon beau commit"`.

* Puis poussez vos modifications : `git push`.

### Fusion d'une feature sur la branche dev

Lors de la fin de votre feature, voici la procédure à suivre avant d'effectuer la pull request: 

* Mettre à jour les branches `feature/<id-tâche-clickup>` et `dev` avec un `git pull`.

* Revenir sur la branche `feature/<id-tâche-clickup>` et faire `git merge dev`.

* Résolvez les conflits de la fusion puis faire `git merge --continue`. 