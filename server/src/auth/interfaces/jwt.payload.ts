export enum Role {
  ADMIN,
  NONADMIN
}

export interface JwtPayload {
  readonly role: Role
}
