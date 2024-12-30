export type ErrorMessage<T extends string> = Partial<{ [key in T]: string }>

export type ErrorResponse<T extends string> = {
  message: string
  errors: Partial<{ [key in T]: string }>
}
