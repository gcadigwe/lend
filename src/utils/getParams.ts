export function getParams(url: string) {
  const params = url.split('&')
  if (params.length < 2) {
    return {}
  }
  const outputParam = params[1].split('=')[1]
  const inputParam = params[0].split('=')[1]

  return {
    outputParam,
    inputParam
  }
}
