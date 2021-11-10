import got from "got"

export const fetcher = async (...args) => {
  try {
    let response = await got(...args).catch(({ response, ...error }) => {
      return response
    })
    let result = JSON.parse(response.body)
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
