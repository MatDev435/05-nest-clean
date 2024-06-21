import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComments } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudantsRepository } from 'test/repositories/in-memory-studants-repository'

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryAnswerComments: InMemoryAnswerCommentsCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryAnswerComments = new InMemoryAnswerCommentsCommentsRepository(
      inMemoryStudantsRepository,
    )
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerComments)
  })

  it('should be able to delete answer comment', async () => {
    const answerComment = makeAnswerComments()

    await inMemoryAnswerComments.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerComments.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComments({
      authorId: new UniqueEntityID('author-01'),
    })

    await inMemoryAnswerComments.create(answerComment)

    const result = await sut.execute({
      authorId: 'author-02',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
