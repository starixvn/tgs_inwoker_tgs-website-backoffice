import fetcher from "./fetcher.js"
import { operatorApi } from "./env.js"
import FormData from "form-data"
import { fileURLToPath } from "url"
import fsExtra from "fs-extra"

const { createReadStream } = fsExtra

export const DefaultPassword = "TgsP@ssw0rd"

export const DefaultCurrencyCode = "CNY"

export const depositPaymentList = async (platformToken, token) => {
  let url = `${operatorApi()}/deposit`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  let result = await fetcher(url, {
    headers
  })

  return result && result.data
}

export const manualDeposit = async (
  platformToken,
  token,
  { paymentid, account, amount, promotionid }
) => {
  if (!paymentid) {
    let paymentList = await depositPaymentList(platformToken, token)

    let payment = paymentList.find(
      ({ paymentcode }) => paymentcode === "Manual"
    )

    paymentid = payment && payment.id
  }

  let payload = {
    paymentid,
    account,
    amount,
    promotionid
  }

  let url = `${operatorApi()}/deposit/manual`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  //{"data":"43e8e093-962d-48fc-9435-0c6a8fd37f39","err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers
  })

  return result.data
}

const dummyImagePath = fileURLToPath(new URL("./dummy.png", import.meta.url))
export const applyManualDepositForm = async (platformToken, token, formId) => {
  const form = new FormData()
  let dummyImageStream = await createReadStream(dummyImagePath)
  form.append("file", dummyImageStream, "dummy.png")

  let headers = {
    ...form.getHeaders(),
    "brand-token": platformToken,
    Token: token
  }

  let url = `${operatorApi()}/deposit/manual/${formId}`
  return await fetcher(url, {
    method: "POST",
    body: form,
    headers
  })
}

export const promotionList = async (platformToken, token, lang = "en-US") => {
  let url = `${operatorApi()}/playerpromotion/${lang}?all=true`

  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  let result = await fetcher(url, {
    method: "GET",
    headers
  })
  return result && result.data
}
