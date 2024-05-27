import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(id: string) {
    const questionAttachments = this.items.filter(
      (item) => item.attachmentId.toString() === id,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(id: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== id,
    )

    this.items = questionAttachments
  }
}
