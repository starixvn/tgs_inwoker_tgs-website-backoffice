import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"
import { ResellerUsername, ResellerPassword } from "../../reseller/auth.js"

const API = "api/users"

export const find = async (username) => {
  let url = `${host}/${API}?username=${username}&showAll=true`

  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })

  let result = await response.json()
  return result?.items?.[0]
}

export const create = async (payload) => {
  let username = payload?.username ?? ResellerUsername
  let name = payload?.name ?? ResellerUsername

  let password = payload?.password ?? ResellerPassword

  //TODO: get first department id from fetch api
  let departmentId = "be58a408-9cab-ee11-8e97-70b5e82b6cbe"

  //TODO: get first role id from fetch api
  let roleId = "7aa2e39b-9da9-4e2e-9bde-b74fdc5de44a"

  let formData = {
    username,
    name,
    password,
    confirmPassword: password,
    departmentId,
    roleId
  }

  let url = `${host}/${API}`
  let response = await fetcher.post(url, {
    data: formData,
    failOnStatusCode: true
  })

  let result = await response.json()
  if (!response.ok() || !result.valid) {
    console.error(
      "not able to add reseller user result=",
      result,
      ", with payload=",
      JSON.stringify(formData)
    )
    throw Error(result)
  }

  return find(username)
}

export const findOrCreate = async (payload) => {
  let username = payload?.username ?? ResellerUsername
  let reseller = await find(username)
  if (!reseller) {
    return await create(payload)
  }
  return reseller
}
