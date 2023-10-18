import { fetcher } from "../fetcher.js"
import { faker } from "@faker-js/faker"
import { api } from "./api.js"
import FormData from "form-data"
import { fileURLToPath } from "url"
import fsExtra from "fs-extra"

const { createReadStream } = fsExtra

//TODO: cache
export const paymentOptions = async (platformToken, playerToken) => {
  let url = `${api()}/deposit`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: playerToken
  }

  let result = await fetcher(url, {
    headers
  })

  return result && result.data
}

const ManualPaymentCode = "Manual"
export const findManualPaymentId = async (platformToken, playerToken) => {
  let payments = await paymentOptions(platformToken, playerToken)
  let payment = payments.find(
    ({ paymentcode }) => paymentcode === ManualPaymentCode
  )
  return payment && payment.id
}

const dummyImagePath = fileURLToPath(new URL("./dummy.png", import.meta.url))
const appendManualDepositProof = async (platformToken, playerToken, formId) => {
  const form = new FormData()
  let dummyImageStream = await createReadStream(dummyImagePath)
  form.append("file", dummyImageStream, "dummy.png")

  let headers = {
    ...form.getHeaders(),
    "brand-token": platformToken,
    Token: playerToken
  }

  let url = `${api()}/deposit/manual/${formId}`
  return await fetcher(url, {
    method: "POST",
    body: form,
    headers
  })
}

export const applyManualDeposit = async (
  platformToken,
  playerToken,
  {
    paymentid,
    account = faker.finance.accountNumber(),
    amount,
    promotionid
  } = {}
) => {
  if (!paymentid) {
    paymentid = await findManualPaymentId(platformToken, playerToken)
  }

  let url = `${api()}/deposit/manual`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: playerToken
  }
  let payload = {
    paymentid,
    account,
    amount,
    promotionid
  }

  //{"data":"43e8e093-962d-48fc-9435-0c6a8fd37f39","err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers
  })

  let formId = result && result.data
  await appendManualDepositProof(platformToken, playerToken, formId)
  return formId
}

export default {
  applyManualDeposit
}
