import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudantsRepository } from 'test/repositories/in-memory-studants-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryAnswerComments: InMemoryAnswerCommentsCommentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryAnswerComments = new InMemoryAnswerCommentsCommentsRepository(
      inMemoryStudantsRepository,
    )
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerComments,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      authorId: 'author-01',
      answerId: answer.id.toString(),
      content: 'Test Comment',
    })

    expect(inMemoryAnswerComments.items[0]).toMatchObject({
      content: 'Test Comment',
    })
  })
})
