import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentCommentsCommentsRepository } from 'test/repositories/in-memory-question-comments'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComments } from 'test/factories/make-question-comment'
import { InMemoryStudantsRepository } from 'test/repositories/in-memory-studants-repository'
import { makeStudant } from 'test/factories/make-studant'

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentCommentsCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentCommentsCommentsRepository(
        inMemoryStudantsRepository,
      )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const studant = makeStudant({
      name: 'John Doe',
    })

    inMemoryStudantsRepository.items.push(studant)

    const comment1 = makeQuestionComments({
      questionId: new UniqueEntityID('question-01'),
      authorId: studant.id,
    })

    const comment2 = makeQuestionComments({
      questionId: new UniqueEntityID('question-01'),
      authorId: studant.id,
    })

    const comment3 = makeQuestionComments({
      questionId: new UniqueEntityID('question-01'),
      authorId: studant.id,
    })

    inMemoryQuestionCommentsRepository.items.push(comment1)
    inMemoryQuestionCommentsRepository.items.push(comment2)
    inMemoryQuestionCommentsRepository.items.push(comment3)

    const result = await sut.execute({
      questionId: 'question-01',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should be able to fetch paginated question comments', async () => {
    const studant = makeStudant({
      name: 'John Doe',
    })

    inMemoryStudantsRepository.items.push(studant)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComments({
          questionId: new UniqueEntityID('question-01'),
          authorId: studant.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-01',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
