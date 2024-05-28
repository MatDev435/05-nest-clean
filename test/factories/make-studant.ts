import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Studant,
  StudantProps,
} from '@/domain/forum/enterprise/entities/studant'
import { faker } from '@faker-js/faker'

export function makeStudant(
  override: Partial<StudantProps> = {},
  id?: UniqueEntityID,
) {
  const studant = Studant.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return studant
}
