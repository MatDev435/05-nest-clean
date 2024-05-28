import { Studant } from '../../enterprise/entities/studant'

export abstract class StudantsRepository {
  abstract findByEmail(email: string): Promise<Studant | null>
  abstract create(studant: Studant): Promise<void>
}
