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
      let payload = args[1]?.body
      console.error(
        `${args[0]} ${response.statusCode}: `,
        result,
        "payload",
        payload
      )
      return Promise.reject(result)
    }
    return result
  } catch (error) {
    return Promise.reject(error)
  }
}

export default fetcher
