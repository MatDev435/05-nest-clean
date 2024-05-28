import { InMemoryStudantsRepository } from 'test/repositories/in-memory-studants-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateStudantUseCase } from './authenticate-studant'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeStudant } from 'test/factories/make-studant'

let inMemoryStudantsRepository: InMemoryStudantsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudantUseCase

describe('Authenticate Studant Use Case', () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudantUseCase(
      inMemoryStudantsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a studant', async () => {
    const studant = makeStudant({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryStudantsRepository.create(studant)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
