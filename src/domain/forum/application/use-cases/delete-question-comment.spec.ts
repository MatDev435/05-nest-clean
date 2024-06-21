import { InMemoryQuestionCommentCommentsCommentsRepository } from 'test/repositories/in-memory-question-comments'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComments } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudantsRepository } from 'test/repositories/in-memory-studants-repository'

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryQuestionComments: InMemoryQuestionCommentCommentsCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryQuestionComments =
      new InMemoryQuestionCommentCommentsCommentsRepository(
        inMemoryStudantsRepository,
      )
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionComments)
  })

  it('should be able to delete question comment', async () => {
    const questionComment = makeQuestionComments()

    await inMemoryQuestionComments.create(questionComment)

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })

    expect(inMemoryQuestionComments.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComments({
      authorId: new UniqueEntityID('author-01'),
    })

    await inMemoryQuestionComments.create(questionComment)

    const result = await sut.execute({
      authorId: 'author-02',
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
