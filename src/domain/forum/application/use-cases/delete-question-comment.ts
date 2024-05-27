import { Either, left, right } from '@/core/either.js'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository.ts'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error.js'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error.js'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionCommentId) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== questionComment?.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right({})
  }
}
