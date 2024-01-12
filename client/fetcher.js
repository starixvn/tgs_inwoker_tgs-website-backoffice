import got from "got"

const DefaultTimeout = 10000
const client = got.extend({
  timeout: DefaultTimeout
})

export const fetcher = async (...args) => {
  try {
    let response = await client(...args).catch(({ response, ...error }) => {
      if (error?.name) {
        return Promise.reject(`${args[0]} ${error?.name}`)
      }
      console.log("error?", error)
      return response
    })
    let result
    try {
      //TODO: check header -> content-type: application/json; charset=utf-8 before parse?
      result = response.body && JSON.parse(response.body)
    } catch (error) {
      //TODO what cuase response = nil?
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
