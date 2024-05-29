import { StudantsRepository } from '@/domain/forum/application/repositories/studants-repository'
import { Studant } from '@/domain/forum/enterprise/entities/studant'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudantMapper } from '../mappers/prisma-studant-mapper'

@Injectable()
export class PrismaStudantsRepository implements StudantsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Studant | null> {
    const studant = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!studant) {
      return null
    }

    return PrismaStudantMapper.toDomain(studant)
  }

  async create(studant: Studant): Promise<void> {
    const data = PrismaStudantMapper.toPrisma(studant)

    await this.prisma.user.create({
      data,
    })
  }
}
