import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { firstBankManualWithdrawPayment } from "../platform/withdrawPayment.js"

const API = "api/withdraw"

const Type = {
  Approve: "Approve",
  Reject: "Reject"
}

export const review = async (
  formId,
  { brandId, brandPaymentId, ...data } = {}
) => {
  if (!brandId) {
    console.error("brandId is required")
    return null
  }
  if (!brandPaymentId) {
    let platformPayment = await firstBankManualWithdrawPayment(brandId)
    brandPaymentId = platformPayment?.id
  }

  let formData = {
    brandId,
    brandPaymentId,
    ...data
  }
  let response = await fetcher.post(`${host}/${API}/${formId}`, {
    data: formData,
    failOnStatusCode: true
  })
  return await response.json()
}

export const approve = async (formId, formData) => {
  return review(formId, { ...formData, reviewResponse: Type.Approve })
}

export const reject = async (formId, formData) => {
  return review(formId, { ...formData, reviewResponse: Type.Reject })
}

export const form = async (platformId, formId) => {
  let url = `${host}/${API}/${platformId}/${formId}`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result?.data
}
