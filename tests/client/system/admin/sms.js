import { fetcher } from "../../fetcher.js"
import { host } from "../../host.js"
import { faker } from "@faker-js/faker"

const API = "api/sms"

export const add = async ({
  name = faker.lorem.word(),
  code,
  setting = JSON.stringify({
    a: faker.number.int(100)
  })
}) => {
  code = code ?? name
  let formData = {
    name,
    code,
    setting
  }

  let url = `${host}/${API}`
  let response = await fetcher.post(url, {
    data: formData
  })
  return response.ok()
}

export const list = async () => {
  let response = await fetcher.get(`${host}/${API}`)
  let result = await response.json()
  return result
}
