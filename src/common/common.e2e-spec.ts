import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';

describe('Recipes Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/recipes/random (GET)', () => {
    return request(app.getHttpServer())
      .get('/recipes/random?tags=vegetarian&number=1')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('recipes');
        expect(res.body.recipes.length).toBeGreaterThan(0);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
