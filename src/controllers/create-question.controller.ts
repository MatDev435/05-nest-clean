import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionSchema = z.infer<typeof createQuestionSchema>

const zodValidationPipe = new ZodValidationPipe(createQuestionSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(zodValidationPipe) body: CreateQuestionSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const userId = user.sub

    const slug = this.createSlug(title)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
  }

  private createSlug(title: string): string {
    const normalizedTitle = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

    const slug = normalizedTitle.replace(/\s+/g, '-')

    return slug
  }
}
