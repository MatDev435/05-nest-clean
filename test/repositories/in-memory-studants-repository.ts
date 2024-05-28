import { DomainEvents } from '@/core/events/domain-events'
import { StudantsRepository } from '@/domain/forum/application/repositories/studants-repository'
import { Studant } from '@/domain/forum/enterprise/entities/studant'

export class InMemoryStudantsRepository implements StudantsRepository {
  public items: Studant[] = []

  async findByEmail(email: string) {
    const studant = this.items.find((item) => item.email === email)

    if (!studant) {
      return null
    }

    return studant
  }

  async create(studant: Studant) {
    this.items.push(studant)

    DomainEvents.dispatchEventsForAggregate(studant.id)
  }
}
