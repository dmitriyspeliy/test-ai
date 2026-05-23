# Task Manager

Minimal full-stack task manager for local development.

## Stack

- Backend: Java 21, Spring Boot, Maven, PostgreSQL, Flyway
- Frontend: Next.js, TypeScript
- Infrastructure: Docker Compose with PostgreSQL

## Prerequisites

- Java 21
- Maven
- Node.js and npm
- Docker with Docker Compose

## Start PostgreSQL

```powershell
docker compose up -d
```

PostgreSQL runs on `localhost:5432` with:

- Database: `task_manager`
- User: `task_manager`
- Password: `task_manager`

## Start Backend

```powershell
cd backend
mvn spring-boot:run
```

The backend runs at `http://localhost:8080`.

## Start Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

## API

```http
GET /api/tasks
POST /api/tasks
PATCH /api/tasks/{id}/status
DELETE /api/tasks/{id}
```

Create task request:

```json
{
  "title": "Buy milk",
  "description": "Optional notes"
}
```

Update status request:

```json
{
  "status": "DONE"
}
```

Supported statuses are `TODO` and `DONE`.
