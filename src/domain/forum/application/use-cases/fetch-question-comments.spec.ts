import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentCommentsCommentsRepository } from 'test/repositories/in-memory-question-comments'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComments } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentCommentsCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentCommentsCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComments({ questionId: new UniqueEntityID('question-01') }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComments({ questionId: new UniqueEntityID('question-01') }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComments({ questionId: new UniqueEntityID('question-01') }),
    )

    const result = await sut.execute({
      questionId: 'question-01',
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComments({ questionId: new UniqueEntityID('question-01') }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-01',
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
