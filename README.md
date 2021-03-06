# toDAG

The todo ~~list~~ graph app.

## What is toDag

This is a tool that will allow you to organize your projects and todo items as a graph rather than a list.

A graph is a data structure that encodes relationships between items, and we believe that this is the best way to organize your projects.

Todo lists don't tell you which items need to be done before others, but a graph can make it clear what the dependencies are within your 

## Setup

### 1. Create A Neo4j Instance

You should be able to run the community edition of Neo4j in Docker (with APOC enabled) with the following:

```
cd neo4j
docker-compose up --build neo4j
```

Navigate to [http://localhost:7474/](http://localhost:7474/) and sign in with the username and password `neo4j` and `neo4j`. It will prompt you to set a new password. Enter that password in the api/.env file per the instructions below.

### 2. Install Dependencies

Node dependencies need to be installed at the root, in the api/ directory, and in the web-react-ts/ directory.

Run `npm run installAll` which will run `npm install` in each of those locations.

### 3. Start the application

Add the following information in a file called .env in the api/ directory. Change the values to match your Neo4j instance:

```
# Use this file to set environment variables with credentials and configuration options
# This file is provided as an example and should be replaced with your own values
# You probably don't want to check this into version control!

NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=letmein

# Uncomment this line to enable encrypted driver connection for Neo4j
#NEO4J_ENCRYPTED=true

# Uncomment this line to specify a specific Neo4j database (v4.x+ only)
#NEO4J_DATABASE=neo4j

GRAPHQL_SERVER_HOST=0.0.0.0
GRAPHQL_SERVER_PORT=4001
GRAPHQL_SERVER_PATH=/graphql

```

Once that information is entered, you can run the app. From the root of the project run:

```
SKIP_PREFLIGHT_CHECK=true npm run start
```

This will start both the api and web-react-ts apps concurrently.

### 4. Seed the database (optional)

Make sure your application is running locally with `npm run start`, open another terminal and run

```
npm run seedDb
```

### 5. Open In Browser

Navigate to http://localhost:3000 to open the web frontend or http://localhost:4001/graphql to open the graphql playground.
