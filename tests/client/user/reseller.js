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

//http://localhost:3000/api/department?name=Turnkey%20Game%20System-%E5%B8%82%E5%A0%B4&page=1&rows=20
const DepartmentApi = "api/department"

const DefaultResellerId = "b5a2c708-ab70-4316-9f4d-5d2ad0e77460"
const findResellerDepartmentIdBy = async (id = DefaultResellerId) => {
  let url = `${host}/${DepartmentApi}?showAll=true`
  let response = await fetcher.get(url, {
    failOnStatusCode: true
  })

  let result = await response.json()
  let department = result?.items?.find((department) => {
    return (
      department.resellerId === id &&
      !department?.licenseeId &&
      !department?.brandId
    )
  })

  return department?.id ?? ""
}

export const create = async (payload) => {
  let username = payload?.username ?? ResellerUsername
  let name = payload?.name ?? ResellerUsername

  let password = payload?.password ?? ResellerPassword

  let departmentId = payload?.departmentId
  if (!departmentId) {
    departmentId = await findResellerDepartmentIdBy(DefaultResellerId)
    if (!departmentId) {
      throw Error("not able to find reseller department")
    }
    console.log("departmentId", departmentId)
  }

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
