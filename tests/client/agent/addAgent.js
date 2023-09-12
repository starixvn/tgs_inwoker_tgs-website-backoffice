import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"
import { add, random, last } from "lodash-es"

const API = "api/agent"
export const addAgent = async ({
  brandId,
  type = "Cash",
  username = `${faker.person.firstName()}-${Date.now()}`,
  password = `${faker.internet.password({ length: 8 })}a1`,
  levelType = "Chief",
  dividendPercentage = random(0, 100, true).toFixed(2),
  remarks = faker.lorem.sentence(),
  ...restFormData
} = {}) => {
  if (!brandId) {
    throw "brandId is required field"
  }

  let formData = {
    brandId,
    type,
    username,
    password,
    confirmPassword: password,
    levelType,
    dividendPercentage,
    remarks,
    ...restFormData
  }

  let response = await fetcher.post(`${host}/${API}`, {
    data: formData
    /*
    failOnStatusCode: true
    */
  })
  let result = await response.json()
  if (!result.valid || !response.ok()) {
    console.error("addAgent result", result)
    throw result
  }

  let agent = await findAgent(brandId, username)

  return {
    ...formData,
    ...agent
  }
}

const findAgent = async (brandId, username) => {
  let url = `${host}/${API}?username=${username}&brandId=${brandId}&showAll=true`

  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })
  let result = await response.json()

  return result.items[0]
}
