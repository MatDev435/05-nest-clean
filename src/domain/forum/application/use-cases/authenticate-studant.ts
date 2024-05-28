import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudantsRepository } from '../repositories/studants-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateStudantUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudantUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudantUseCase {
  constructor(
    private studantsRepository: StudantsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudantUseCaseRequest): Promise<AuthenticateStudantUseCaseResponse> {
    const studant = await this.studantsRepository.findByEmail(email)

    if (!studant) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      studant.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({ sub: studant.id })

    return right({ accessToken })
  }
}
