export type Args = {
  body: Record<string, unknown>
  endpoint: string
  method: 'DELETE' | 'GET' | 'POST' | 'PUT'
}
export const createApiRequest = ({ body, endpoint, method }: Args) => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/${endpoint}`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method
  })
}
