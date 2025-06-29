export interface UserInterface {
  public_id: string,
  name: string,
  email: string,
  roles: [
    role: {
      id: number,
      name: string,
    }
  ]
}
