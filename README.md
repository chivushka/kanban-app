# Kanban App - Fullstack

## Live URL

[https://chivushka-kanban-app.onrender.com](https://chivushka-kanban-app.onrender.com/)

*P.S. First request may be really slow*

## Running with Docker
Make sure Docker is installed and running on your machine.

1. Open a terminal and go into the `frontend` directory:

```bash
cd frontend
docker-compose up --build
```

2. Open another terminal and go into the backend directory:

```bash
cd backend
docker-compose up --build
```

## Frontend local setup
1. Create a .env file in frontend directory and add variable.

```bash
VITE_BACKEND_URL = http://localhost:8080
```
2. Then, install dependencies and start the frontend app.
```bash
cd frontend
npm install
npm run dev
```

## Backend local setup

1. Create a PostgreSQL database.

2. Create a .env file in backend directory and add variables.

```bash
PORT=8080
DATABASE_URL="postgresql://user:password@localhost:5432/db-name?schema=public"
```

3. Install dependencies.
```bash
cd backend
npm install
```
4. Generate Prisma client.
```bash
npx prisma generate
```
5. Run database migrations.
```bash
npx prisma migrate dev --name init
```
6. Start the backend server.
```bash
npm run start:dev
```
