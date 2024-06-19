import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async createMany(attachments: AnswerAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = questionAttachments
  }

  async findManyByAnswerId(id: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === id,
    )

    return answerAttachments
  }

  async deleteManyByAnswerId(id: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== id,
    )

    this.items = answerAttachments
  }
}
