import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { StudantFactory } from 'test/factories/make-studant'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { AnswerFactory } from 'test/factories/make-answer'

describe('Delete Answer Comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studantFactory: StudantFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudantFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studantFactory = moduleRef.get(StudantFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studantFactory.makePrismaStudant()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const answerComment = await answerCommentFactory.makePrismaAnswerComment({
      authorId: user.id,
      answerId: answer.id,
    })

    const answerCommentId = answerComment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    })

    expect(commentOnDatabase).toBeNull()
  })
})
