# Système de Gestion de Projets

Une application "Full-Stack" complète pour la gestion et le suivi des projets. Cette application offre une interface moderne et dynamique pour gérer les projets, les ressources (employés), les phases d'un projet, et les livrables, tout en intégrant un système de rôles et une isolation stricte des données pour la sécurité.

## 🚀 Fonctionnalités Principales

- **Gestion des Projets** : Créer, visualiser, modifier et supprimer des projets.
- **Gestion des Ressources** : Assigner des employés avec différents rôles aux projets (ex. Chefs de Projet, Employés).
- **Phases et Livrables** : Suivi rigoureux de la progression des projets via des phases et des livrables associés.
- **Tableaux de bord et Statistiques** : Visualisation claire et rapide de l'état d'avancement des projets et des livrables.
- **Sécurité et Contrôle d'Accès (RBAC)** : Authentification via JWT. Séparation des droits entre administrateurs/managers et utilisateurs standards (employés).
- **Interface Utilisateur Moderne** : Design réactif et animé offrant une excellente expérience utilisateur.

## 🛠️ Technologies Utilisées

### Back-End (API Rest)
- **Java 17**
- **Spring Boot 3.5**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Spring Boot Validation
- **Bases de Données** : MySQL
- **Sécurité** : JSON Web Token (JWT) pour l'authentification
- **Documentation** : Swagger OpenAPI & SpringDoc
- **Outils** : Maven, Lombok

### Front-End (Client)
- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS 3** pour le design
- **Framer Motion** pour les animations et transitions
- **Axios** pour les requêtes HTTP
- **React Router DOM 7** pour la navigation
- **React Hook Form** pour la gestion efficace des formulaires
- **Recharts** pour la visualisation des données et tableaux de bord
- **Lucide React** pour des icônes élégantes

## ⚙️ Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :
- [Java Development Kit (JDK) 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Node.js](https://nodejs.org/en/) (version 18 ou supérieure)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Maven](https://maven.apache.org/) (optionnel, l'application utilise `mvnw` (Maven Wrapper))

## 📦 Installation et Lancement

### 1. Configuration de la Base de Données

Créez une base de données MySQL pour l'application :

```sql
CREATE DATABASE gestion_projets;
```
*(Assurez-vous que les identifiants configurés dans le fichier `src/main/resources/application.properties` correspondent à votre installation MySQL locale)*

### 2. Démarrage du Back-End

Ouvrez un terminal à la racine du projet (`gestion-projets`) :

#### Avec le wrapper Maven (recommandé) :
- Sur **Windows** :
  ```bash
  .\mvnw spring-boot:run
  ```

Le serveur backend devrait démarrer sur `http://localhost:8080`.

### 3. Démarrage du Front-End

Ouvrez un autre terminal et naviguez dans le répertoire frontend :

```bash
cd gestion-projets-frontend
```

Installez les dépendances :

```bash
npm install
```

Lancez l'environnement de développement Vite :

```bash
npm run dev
```

L'interface web sera disponible à l'adresse indiquée (généralement `http://localhost:5173`).

## 📽️ Démonstration video 




https://github.com/user-attachments/assets/ad786160-d63a-4e75-b14a-756dd271176b




## 📚 Documentation de l'API

L'application expose une interface Swagger pour tester et comprendre les endpoints REST.
Une fois le backend lancé, accédez à la documentation via :
**[http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)**

## 🛡️ Sécurité

L'application utilise une authentification basée sur les tokens JWT.
Pendant le processus d'authentification (`/authentication/login`), un token est délivré et doit être transmis dans l'en-tête `Authorization` (`Bearer <token>`) des requêtes suivantes sécurisées.
L'accès aux ressources est contraint par les rôles gérés via Spring Security et appliqués dynamiquement tant du côté serveur que de l'interface client.


