import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface StudantProps {
  name: string
  email: string
  password: string
}

export class Studant extends Entity<StudantProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: StudantProps, id?: UniqueEntityID) {
    const studant = new Studant(props, id)

    return studant
  }
}
