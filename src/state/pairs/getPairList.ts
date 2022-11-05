import { TopPair } from './reducer'
import axios from 'axios'

export default async function getPairList(
  url: string,
  pageSize: number,
  pageNumber: number,
  search: string,
  sort: string
): Promise<any> {
  type Body = {
    limit: number
    pageNumber: number
    search?: string
    sort: string
  }
  const body: Body = {
    limit: pageSize,
    pageNumber,
    sort
  }

  if (search) body.search = search
  const config = {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${process.env.REACT_APP_API_AUTH_TOKEN}`
    }
  }
  try {
    const { data } = await axios.post(url, body, config)
    console.log(data, 'data')
    return data
  } catch (error) {
    let err = error.message
    if (error.response && error.response.data.error) {
      err = error.response.data.error
    }
    throw new Error(`${err}`)
  }
}
