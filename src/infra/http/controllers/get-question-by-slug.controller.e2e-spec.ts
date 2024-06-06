import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { QuestionFactory } from 'test/factories/make-question'
import { StudantFactory } from 'test/factories/make-studant'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Get Question By Slug (E2E)', () => {
  let app: INestApplication
  let studantFactory: StudantFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudantFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studantFactory = moduleRef.get(StudantFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studantFactory.makePrismaStudant()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
      slug: Slug.create('question-01'),
    })

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 01' }),
    })
  })
})
