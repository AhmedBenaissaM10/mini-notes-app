import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import  {describe, beforeAll, afterAll, expect, it, afterEach} from 'vitest'
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const createdIds: string[] = [];

  const createNoteDto = {
    title: 'Learn AWS Deployment',
    content: 'Deploy NestJS to EC2 and connect it to RDS.',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    // Remove only records created by this test suite.
    if (createdIds.length > 0) {
      await prisma.note.deleteMany({
        where: {
          id: { in: [...createdIds] },
        },
      });

      createdIds.length = 0;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  async function createTestNote() {
    const response = await request(app.getHttpServer())
      .post('/notes')
      .send(createNoteDto)
      .expect(201);

    createdIds.push(response.body.id);

    return response.body;
  }

  describe('POST /notes', () => {
    it('should create a note', async () => {
      const response = await request(app.getHttpServer())
        .post('/notes')
        .send(createNoteDto)
        .expect(201);

      createdIds.push(response.body.id);

      expect(response.body).toMatchObject({
        title: createNoteDto.title,
        content: createNoteDto.content,
      });

      expect(response.body.id).toEqual(expect.any(String));
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should reject an empty title', async () => {
      await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: '',
          content: 'Some content',
        })
        .expect(400);
    });

    it('should reject a title longer than 150 characters', async () => {
      await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'a'.repeat(151),
          content: 'Some content',
        })
        .expect(400);
    });

    it('should reject a missing title', async () => {
      await request(app.getHttpServer())
        .post('/notes')
        .send({
          content: 'Some content',
        })
        .expect(400);
    });
  });

  describe('GET /notes', () => {
    it('should return all notes', async () => {
      const note = await createTestNote();

      const response = await request(app.getHttpServer())
        .get('/notes')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: note.id,
            title: note.title,
            content: note.content,
          }),
        ]),
      );
    });
  });

  describe('GET /notes/:id', () => {
    it('should return a note by ID', async () => {
      const note = await createTestNote();

      const response = await request(app.getHttpServer())
        .get(`/notes/${note.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: note.id,
        title: note.title,
        content: note.content,
      });
    });

    it('should return 404 when the note does not exist', async () => {
      await request(app.getHttpServer())
        .get('/notes/00000000-0000-4000-8000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /notes/:id', () => {
    it('should update a note', async () => {
      const note = await createTestNote();

      const response = await request(app.getHttpServer())
        .patch(`/notes/${note.id}`)
        .send({
          title: 'Learn NestJS and Prisma',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        id: note.id,
        title: 'Learn NestJS and Prisma',
        content: note.content,
      });
    });

    it('should return 404 when updating a missing note', async () => {
      await request(app.getHttpServer())
        .patch('/notes/00000000-0000-4000-8000-000000000000')
        .send({
          title: 'Updated title',
        })
        .expect(404);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete a note', async () => {
      const note = await createTestNote();

      const response = await request(app.getHttpServer())
        .delete(`/notes/${note.id}`)
        .expect(200);

      expect(response.body.id).toBe(note.id);

      await request(app.getHttpServer()).get(`/notes/${note.id}`).expect(404);
    });

    it('should return 404 when deleting a missing note', async () => {
      await request(app.getHttpServer())
        .delete('/notes/00000000-0000-4000-8000-000000000000')
        .expect(404);
    });
  });
});
