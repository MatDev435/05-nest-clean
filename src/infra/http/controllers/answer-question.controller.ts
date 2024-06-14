import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionSchema = z.object({
  content: z.string(),
})

type AnswerQuestionSchema = z.infer<typeof answerQuestionSchema>

const zodValidationPipe = new ZodValidationPipe(answerQuestionSchema)

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(zodValidationPipe) body: AnswerQuestionSchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.answerQuestion.execute({
      content,
      authorId: userId,
      questionId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
