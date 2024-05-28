import { RegisterStudantUseCase } from './register-studant'
import { InMemoryStudantsRepository } from 'test/repositories/in-memory-studants-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudantsRepository: InMemoryStudantsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudantUseCase

describe('Register Studant Use Case', () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudantUseCase(inMemoryStudantsRepository, fakeHasher)
  })

  it('should be able to register a new studant', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      studant: inMemoryStudantsRepository.items[0],
    })
  })

  it('should hash password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(hashedPassword).toEqual(inMemoryStudantsRepository.items[0].password)
  })
})
