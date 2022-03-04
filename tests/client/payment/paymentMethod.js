import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/PaymentMethod"
export const getPaymentMethods = async () => {
  let url = `${host}/${API}`

  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })

  let result = await response.json()
  return result.data
}

export const findPaymentMethod = async (code) => {
  let list = await getPaymentMethods()
  return list?.find((paymentMethod) => paymentMethod.code === code)
}
