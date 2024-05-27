import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(id: string) {
    const answerAttachments = this.items.filter(
      (item) => item.attachmentId.toString() === id,
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
