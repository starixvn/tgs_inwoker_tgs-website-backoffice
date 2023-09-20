import { fetcher } from "../../fetcher.js"
import { host } from "../../host.js"
import camelcaseKeys from "camelcase-keys"
import { faker } from "@faker-js/faker"

const API = "api/setting"

export const get = async (key = "") => {
  if (!key) {
    return null
  }

  let response = await fetcher.get(`${host}/${API}/${key}`)
  let result = await response.json()
  let settingString = result?.setting?.value
  if (!settingString) {
    return null
  }
  let setting = null
  try {
    setting = camelcaseKeys(JSON.parse(settingString), {
      deep: true
    })
  } catch (error) {
    console.warn(error)
  }
  return setting
}

export const add = async ({
  key,
  description = faker.lorem.word(),
  value = JSON.stringify({
    a: faker.number.int(100)
  }),
  ...data
} = {}) => {
  if (!key) {
    console.error("key is required")
    return null
  }

  let url = `${host}/${API}`
  let formData = {
    key,
    description,
    value,
    ...data
  }

  let response = await fetcher.post(url, {
    data: formData
  })

  let result = await response.json()
  return result
}

export default {
  get,
  add
}
