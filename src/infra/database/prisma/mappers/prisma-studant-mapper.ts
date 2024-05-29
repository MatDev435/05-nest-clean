import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Studant } from '@/domain/forum/enterprise/entities/studant'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaStudantMapper {
  static toDomain(raw: PrismaUser): Studant {
    return Studant.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(studant: Studant): Prisma.UserUncheckedCreateInput {
    return {
      id: studant.id.toString(),
      name: studant.name,
      email: studant.email,
      password: studant.password,
    }
  }
}
