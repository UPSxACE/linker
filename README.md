# Linker

![version](https://img.shields.io/badge/version-v1.0.0--alpha-blue)

Linker is a simple single page application that I use to publish my apps, and allow users to check in real time if they are Online, Offline or currently in Maintenance. It's powered by NextJS and Strapi, and I deploy it using Docker. The docker compose container also bundles the app with <u>**Traefik**</u> to create a reverse proxy (so you can run both NextJS and Strapi in the same domain/machine) and <u>**Postgres**</u> to serve as database for Strapi.

## Table of Contents

- [Concept](#concept)
- [Features](#features)
- [Development Prerequisites](#development-prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Deploy with Docker](#deploy-with-docker)

## Concept

![Concept Flow Chart](./CONCEPT.PNG?raw=true "Concept Flow Chart")

## Features

- **Easy to Update:** Strapi's dashboard makes it incredibly easy to add and remove applications, and everything else is automatized!
- **Easy to Deploy:** Setup the environment variables, spin up the docker compose in production mode, and we're ready to go!

## Development Prerequisites

Ensure you have the following tools and dependencies installed on your system before diving into Linker development:

- Node & NPM
- Postgres

## Installation and Setup

Make sure you run a Postgres instance by yourself, and create an empty database, and an user with all permissions before you start.

### Clone repository

```bash
git clone https://github.com/UPSxACE/linker.git && cd linker
```

### Install dependencies

```bash
cd ./strapi && yarn install && cd ../ && cd ./web && yarn install && cd ../
```

### Create .env file in /strapi

```env
npm_config_user_agent=yarn
HOST=0.0.0.0
PORT=1337
# Example:
# abcdefghij,jjjjjjjjjjj,iiiiiiiii,llllllll
APP_KEYS=<4 STRINGS SEPPARATED BY COMMAS>
API_TOKEN_SALT=<STRING>
ADMIN_JWT_SECRET=<STRING>
TRANSFER_TOKEN_SALT=<STRING>
# Database (POSTGRES)
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=<DATABASE NAME>
DATABASE_USERNAME=<POSTGRES USERNAME>
DATABASE_PASSWORD=<POSTGRES PASSWORD>
DATABASE_SSL=false
# JWT
JWT_SECRET_EXPIRES=30d # 30 days
PANELJWT_SECRET=<STRING>
JWT_SECRET=<STRING>
# CUSTOM JWT
AUTH_COOKIE_NAME=linkerToken
AUTH_COOKIE_EXPIRES=2592000000 #30 days
COOKIE_DOMAIN=
# REFRESH TOKEN
REFRESH_SECRET=<STRING>
REFRESH_TOKEN_EXPIRES=40d # 40 days
NODE_ENV=development
REFRESH_TOKEN_NAME=linkerRefreshToken
REFRESH_COOKIE_EXPIRES=3456000000 #40 days
```

### Create .env.local file in /web

```env
NEXT_PUBLIC_STRAPI_BASEURL=http://localhost:1337
```

### Run strapi and nextjs in development mode

```bash
# Cli Nº1
cd ./strapi && yarn develop
```

```bash
# Cli Nº2
cd ./web && yarn dev
```

## Deploy with Docker

### Clone repository

```bash
git clone https://github.com/UPSxACE/my-diary.git && cd my-diary
```

### Create .env file in the root of project

```env
# POSTGRES
POSTGRES_USER=<POSTGRES USERNAME>
POSTGRES_PASSWORD=<POSTGRES PASSWORD>
POSTGRES_DB=<DATABASE NAME>
POSTGRES_HOST=postgres_db
# TRAEFIK
WEB_HOSTNAME=<DOMAIN USED FOR THE WEB APP>
STRAPI_HOSTNAME=<DOMAIN USED FOR THE STRAPI APP>
CERTRESOLVER=<"staging" OR "production">
ACME_EMAIL=<EMAIL THAT WILL BE USED IN SSL CERTIFICATES>
# NEXTJS
NEXT_PUBLIC_STRAPI_BASEURL=<URL USED FOR THE STRAPI APP>
NEXT_BUILD_STANDALONE=true
```

### Create .env.strapi file in the root of project

```env
npm_config_user_agent=yarn
HOST=0.0.0.0
PORT=1337
# Example:
# abcdefghij,jjjjjjjjjjj,iiiiiiiii,llllllll
APP_KEYS=<4 STRINGS SEPPARATED BY COMMAS>
API_TOKEN_SALT=<STRING>
ADMIN_JWT_SECRET=<STRING>
TRANSFER_TOKEN_SALT=<STRING>
# Database (POSTGRES)
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres_db
DATABASE_PORT=5432
DATABASE_NAME=<DATABASE NAME>
DATABASE_USERNAME=<POSTGRES USERNAME>
DATABASE_PASSWORD=<POSTGRES PASSWORD>
DATABASE_SSL=false
# JWT
JWT_SECRET_EXPIRES=30d # 30 days
PANELJWT_SECRET=<STRING>
JWT_SECRET=<STRING>
# CUSTOM JWT
AUTH_COOKIE_NAME=linkerToken
AUTH_COOKIE_EXPIRES=2592000000 #30 days
# example:
# .mydomain.com
COOKIE_DOMAIN=<DOMAIN VALUE TO BE USED IN THE COOKIES>
# REFRESH TOKEN
REFRESH_SECRET=<STRING>
REFRESH_TOKEN_EXPIRES=40d # 40 days
NODE_ENV=production
REFRESH_TOKEN_NAME=linkerRefreshToken
REFRESH_COOKIE_EXPIRES=3456000000 #40 days
```

### Create traefik network

```bash
docker network create traefik_network
```

### Build production compose container

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
```

### Run container

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```
