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

export const createAuthApiRequest = ({ body, endpoint, method }: Args) => {
  const token = localStorage.getItem('token')
  return fetch(`${process.env.NEXT_PUBLIC_API}/${endpoint}`, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json'
    },
    method
  })
}
