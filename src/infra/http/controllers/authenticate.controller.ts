import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateStudantUseCase } from '@/domain/forum/application/use-cases/authenticate-studant'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudant: AuthenticateStudantUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudant.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const { accessToken } = result.value

    return { accessToken }
  }
}
