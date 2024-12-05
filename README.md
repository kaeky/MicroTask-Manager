# NestJS Microservices Starter Project

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

This repository contains a starter setup for two microservices built using the [NestJS](https://github.com/nestjs/nest)
framework:

- **Users Microservice**
- **Tasks Microservice**

Each microservice is independent, scalable, and designed for server-side applications.

## Authentication
This project uses Auth0 for authentication. Auth0 simplifies and centralizes authentication management with features such as:

- **Pre-built User Interfaces**: Quick setup for login, registration, and password reset screens.
- **Scalability**: Handles high traffic with ease.
- **Security**: Implements industry-standard security protocols such as OAuth2 and OpenID Connect.
- **Customizable Rules**: Allows customization of user authentication flows.

## Opportunities for Improvement

- ### Redis for Microservices Communication
  - **Low Latency**: Redis operates in-memory, ensuring quick message processing.
  - **Pub/Sub Mechanism**: Allows for decoupled communication between microservices.
- ### Microservice Gateway
  -  **Unified Entry Point**: Simplifies client communication by routing all requests through the gateway.
  -  **Load Balancing**: Improves distribution of requests across microservices.
  -  **Security**: Centralized authentication and authorization.

## Database Setup

### Step 1: Create a PostgreSQL Database with Docker

Run the following command to set up a PostgreSQL database instance using Docker:

```bash
docker run -d --restart always \
  --name <CustomNameContainer> \
  -e POSTGRES_PASSWORD=<CustomPsword> \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v /c/Postgresql/volumes/inlaze/data:/var/lib/postgresql/data/ \
  -p 5433:5432 postgres
```
### Step 2: Connect to the PostgreSQL Database
Once the Docker container is running, connect to the PostgreSQL instance using a client such as psql or a database management tool. Create a database named inlaze or any other preferred name:
```bash
CREATE DATABASE inlaze;
```

### Step 3: Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/kaeky/MicroTask-Manager.git
```
#### The repository contains two microservices:
- **Users Microservice**
  - This microservice is responsible for managing user accounts and auth.
- **Tasks Microservice**
  - This microservice is responsible for managing tasks.

Navigate to each microservice directory to configure and run it.

### Step 4: Environment Variables
Each microservice requires its own .env file. In the root directory of each microservice, create a .env file and add the following environment variables like the .env.example file.
### Step 5: Running the Microservices
Navigate to the respective microservice folder and use the following commands:
```bash
# Install dependencies
npm install

# Run migrations
npm run migration:run

# Run in development mode
npm run start:dev

# Run in production mode
npm run start:prod
```