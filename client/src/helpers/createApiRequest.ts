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

export const createAuthApiRequest = async <T>({
  body,
  endpoint,
  method
}: Args): Promise<T> => {
  const token = localStorage.getItem('token')

  const rawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API}/${endpoint}`,
    {
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method
    }
  )

  const response = await rawResponse.json()

  if (!rawResponse.ok || response.message === 'Token expired') {
    throw new Error(response.message)
  }

  return response
}
