import { UseCaseError } from '@/core/errors/use-case-error'

export class StudantAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Studant "${identifier}" already exists.`)
  }
}
