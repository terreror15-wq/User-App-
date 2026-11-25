export interface UserInput {
  name: string
  lastName: string
  email: string
  address: string
  phoneNumber: string
  isActive: boolean
}

export interface User extends UserInput {
  id: number
}
