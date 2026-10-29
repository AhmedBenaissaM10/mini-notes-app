# Mini Notes App

A full-stack notes application built to practice backend architecture, REST API development, and AWS deployment. The backend uses NestJS, Prisma ORM, and PostgreSQL, with plans to connect a React frontend and deploy the application using Amazon EC2 and Amazon RDS.

## Features

- Create a note
- Retrieve all notes
- Retrieve a single note by ID
- Update an existing note
- Delete a note
- Validate incoming request data
- Generate OpenAPI documentation
- Provide health-check endpoints

## Tech Stack

**Backend**
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Swagger / OpenAPI](https://swagger.io/)
- `class-validator` for request validation

**Frontend (planned/in progress)**
- React
- Vite
- TypeScript

**Cloud and Deployment (learning objectives)**
- Amazon EC2 — application hosting
- Amazon RDS — managed PostgreSQL database
- Nginx — frontend hosting and potentially reverse proxying

## Project Structure

```text
mini-notes-app/
├── src/
│   ├── notes/
│   │   ├── dto/
│   │   ├── notes.controller.ts
│   │   ├── notes.service.ts
│   │   └── notes.module.ts
│   ├── prisma/
│   ├── common/
│   ├── config/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── prisma/
│   └── schema.prisma
├── openapi.yml
├── .env.example
├── package.json
└── README.md
```

*The structure may vary depending on your implementation.*

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME?schema=public"
```

Replace the database connection values with your local PostgreSQL credentials or your Amazon RDS connection details.

**Security:** Never commit your `.env` file or database credentials to Git.

### 4. Configure Prisma

Ensure your Prisma datasource and configuration use the correct database connection URL for your installed Prisma version.

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply your migrations to the development database:

```bash
npx prisma migrate dev
```

### 5. Start the Backend

Run the development server:

```bash
npm run start:dev
```

The API should be available at:

```text
http://localhost:3000
```

If your application uses the global `/api` prefix, the notes endpoints will be under `/api/notes`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api` | Root endpoint |
| GET | `/health/live` | Check whether the application is running |
| GET | `/health/ready` | Check application readiness |
| POST | `/api/notes` | Create a note |
| GET | `/api/notes` | Retrieve all notes |
| GET | `/api/notes/:id` | Retrieve a note by ID |
| PATCH | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

Note IDs are UUID strings.

### Create a Note

**Request**

```http
POST /api/notes
Content-Type: application/json
```

```json
{
  "title": "Learn AWS Deployment",
  "content": "Deploy my NestJS API to EC2 and connect it to PostgreSQL on Amazon RDS."
}
```

The API validates the request before creating the note.

## API Documentation

In development mode, open Swagger UI at:

```text
http://localhost:3000/docs
```

The generated OpenAPI specification is available in `openapi.yml` when you run your specification-generation script.

Use the specification to inspect endpoints, request schemas, response schemas, and error responses.

## Testing

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Run test coverage:

```bash
npm run test:cov
```

Use a dedicated test database for automated tests. Avoid running destructive tests against production data.

## AWS Deployment Learning Objectives

The project is intended to practice connecting application infrastructure on AWS.

- **EC2:** Host the NestJS backend.
- **RDS:** Store notes in a managed PostgreSQL database.
- **Security Groups:** Allow only the required network traffic between resources.
- **IAM:** Learn how applications and EC2 instances obtain AWS permissions when AWS services are used.
- **Nginx:** Serve the React frontend and optionally proxy API requests.
- **Environment Configuration:** Keep production configuration and secrets outside the source code.

For production, restrict the RDS security group to the backend's security group rather than exposing the database publicly. Use HTTPS and appropriate secret-management practices before making the application publicly accessible.

## Current Scope

This project focuses on learning and practicing:

- NestJS modules, controllers, and services
- DTOs and request validation
- Prisma CRUD operations
- PostgreSQL connectivity
- REST API design
- OpenAPI documentation
- Automated testing
- AWS deployment and networking

Authentication, authorization, and additional features can be introduced in later milestones.

## License

Choose a license for this project before distributing or reusing its code.
