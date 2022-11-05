import axios from 'axios'
// do this because env variables doen't work for some reason I will handle this later.
const API_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJzcGhyaS1mcm9udGVuZCIsIm9rIjp0cnVlLCJpYXQiOjE2NDQ5MjM3NzR9.aWsS3qwM2324szhEbOesc7EhStqp0jX22nBkQizPg-g'
export const fetchSinglePair = async (
  chainId: number,
  input: any,
  output: any,
  SINGLE_PAIR_URL: string,
  setLoading: any,
  setError: any,
  setCurrentPair: any
) => {
  const request = {
    CHAIN_ID: chainId,
    TOKEN_A_ADDRESS: input,
    TOKEN_B_ADDRESS: output
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_ACCESS_TOKEN}`
    }
  }
  try {
    const { data } = await axios.post(SINGLE_PAIR_URL, request, config)
    setLoading(false)
    if (data && data.error) {
      setError(true)
      return
    }
    setError(false)
    setCurrentPair(data)
  } catch (err) {
    setLoading(false)
    setError(true)
  }
}
