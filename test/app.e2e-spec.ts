import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum';
import { CreateActivityDto, EditActivityDto } from '../src/activity/dto';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {

    const auth: AuthDto = {
      email: 'michal@gmail.com',
      password: '123'
    }

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            password: auth.password
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            email: auth.email
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({

          })
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody(auth)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            password: auth.password
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: auth.email
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });

      it('should signin', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody(auth)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });


  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum.spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200);
      })
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Michał',
          email: 'michal5@gmail.com'
        }
        return pactum.spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
          .inspect();
      })
    });
  });


  describe('Activities', () => {
    describe('Get empty activities', () => {
      it('should get activities', () => {
        return pactum.spec()
          .get('/activities')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([])
          .inspect();
      });
    });

    describe('Create activity', () => {
      const activity: CreateActivityDto = {
        name: "First acitivity",
        startTime: new Date(),
        endTime: new Date('2022-05-05'),
        description: "Siema"
      }

      it('should create activity', () => {
        return pactum.spec()
          .post('/activities')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(activity)
          .expectStatus(201)
          .stores('activityId','id');
      })
    });

    describe('Get activities', () => {
      it('should get activities', () => {
        return pactum.spec()
          .get('/activities')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get activity by id', () => {
      it('should get activity by id', () => {
        return pactum.spec()
          .get('/activities/{id}')
          .withPathParams('id','$S{activityId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{activityId}');
      });
    });

    describe('Edit activity by id', () => {
      const activity: EditActivityDto = {
        description:'new description'
      }
      it('should edit activity', () => {
        return pactum.spec()
          .patch('/activities/{id}')
          .withPathParams('id','$S{activityId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(activity)
          .expectStatus(200)
          .expectBodyContains(activity.description)
          .inspect();
      });
    });

    describe('Delete activity by id', () => {
      it('should delete activity', () => {
        return pactum.spec()
          .delete('/activities/{id}')
          .withPathParams('id','$S{activityId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(204);
      });

      it('should get empty activity',()=>{
        return pactum.spec()
        .get('/activities')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .expectBody([]);
      });
    });
  });
})