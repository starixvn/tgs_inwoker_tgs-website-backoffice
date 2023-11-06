import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { faker } from "@faker-js/faker"
import { firstBankManualWithdrawPayment } from "../platform/withdrawPayment.js"

const API = "api/player"

export const add = async ({
  brandId,
  playerCode,
  bankType = "Bank",
  paymentChannelId,
  detail,
  ...data
} = {}) => {
  if (!brandId) {
    console.error("brandId is required")
    return null
  }
  if (!playerCode) {
    console.error("playerCode is required")
    return null
  }

  if (!paymentChannelId && !detail) {
    //TODO: find first by bank type?
    let platformPayment = await firstBankManualWithdrawPayment(brandId)
    paymentChannelId = platformPayment?.paymentChannelId

    detail = {
      bankAccount: faker.finance.accountNumber(),
      bankBranch: faker.lorem.word(),
      bankName: faker.company.name(),
      name: faker.person.firstName()
    }
  }

  let url = `${host}/${API}/${playerCode}/bank`
  let formData = {
    brandId,
    bankType,
    paymentChannelId,
    detail,
    ...data
  }

  let response = await fetcher.post(url, { data: formData })
  let result = await response.json()
  if (!result.valid) {
    console.error("add bank card failed", result)
    return null
  }

  return {
    ...formData
  }
}

export default {
  add
}
