import got from "got"

export const fetcher = async (...args) => {
  try {
    let response = await got(...args).catch(({ response, ...error }) => {
      return response
    })
    let result
    try {
      //TODO: check header -> content-type: application/json; charset=utf-8 before parse?
      result = JSON.parse(response.body)
    } catch {
      result = response.body
    }
    if (response.statusCode >= 400) {
      console.warn(`http ${response.statusCode}: `, result)
      return Promise.reject(result)
    }
    return result
  } catch (error) {
    return Promise.reject(error)
  }
}

export default fetcher
