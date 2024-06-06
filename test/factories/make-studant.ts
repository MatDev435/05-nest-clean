import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Studant,
  StudantProps,
} from '@/domain/forum/enterprise/entities/studant'
import { PrismaStudantMapper } from '@/infra/database/prisma/mappers/prisma-studant-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class StudantFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudant(data: Partial<StudantProps> = {}): Promise<Studant> {
    const studant = makeStudant(data)

    await this.prisma.user.create({
      data: PrismaStudantMapper.toPrisma(studant),
    })

    return studant
  }
}
