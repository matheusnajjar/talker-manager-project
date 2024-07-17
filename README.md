# Talker Manager Project

## Description
Talker Manager is a project designed to manage a list of talkers (speakers) with basic CRUD (Create, Read, Update, Delete) operations. It provides an API that allows users to interact with the talkers' data stored in JSON format.

## Features
- Create a new talker
- Retrieve a list of all talkers
- Retrieve details of a single talker by ID
- Update an existing talker's information
- Delete a talker by ID

## Prerequisites
- Node.js (v16)
- npm
- Docker and Docker Compose

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/matheusnajjar/talker-manager-project.git
    cd talker-manager-project
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Start the project with Docker Compose**:
    ```sh
    docker-compose up
    ```

## Endpoints

- **GET /talkers**: Retrieve a list of all talkers.
- **GET /talkers/:id**: Retrieve details of a single talker by ID.
- **POST /talkers**: Create a new talker.
- **PUT /talkers/:id**: Update an existing talker's information.
- **DELETE /talkers/:id**: Delete a talker by ID.

## Project Structure
```plaintext
.
├── middlewares
│   ├── errorMiddleware.js
│   └── validateMiddleware.js
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── README.md
├── docker-compose.yml
├── index.js
├── jest.config.js
├── package-lock.json
├── package.json
└── talker.json
