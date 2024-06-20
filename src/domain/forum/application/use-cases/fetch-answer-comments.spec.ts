import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComments } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudantsRepository } from 'test/repositories/in-memory-studants-repository'
import { makeStudant } from 'test/factories/make-studant'

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryAnswerCommentsRepository =
      new InMemoryAnswerCommentsCommentsRepository(inMemoryStudantsRepository)
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const studant = makeStudant({
      name: 'John Doe',
    })

    inMemoryStudantsRepository.items.push(studant)

    const comment1 = makeAnswerComments({
      answerId: new UniqueEntityID('answer-01'),
      authorId: studant.id,
    })

    const comment2 = makeAnswerComments({
      answerId: new UniqueEntityID('answer-01'),
      authorId: studant.id,
    })

    const comment3 = makeAnswerComments({
      answerId: new UniqueEntityID('answer-01'),
      authorId: studant.id,
    })

    inMemoryAnswerCommentsRepository.items.push(comment1)
    inMemoryAnswerCommentsRepository.items.push(comment2)
    inMemoryAnswerCommentsRepository.items.push(comment3)

    const result = await sut.execute({
      answerId: 'answer-01',
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

  it('should be able to fetch paginated answer comments', async () => {
    const studant = makeStudant({
      name: 'John Doe',
    })

    inMemoryStudantsRepository.items.push(studant)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComments({
          answerId: new UniqueEntityID('answer-01'),
          authorId: studant.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-01',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
