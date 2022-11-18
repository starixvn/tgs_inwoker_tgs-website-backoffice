import { fetcher } from "../fetcher.js"
import { host } from "../host.js"

const API = "api/agent"

export const addBalance = async (
  agentId,
  { transactionType = "Other", ...restFormData } = {}
) => {
  let formData = {
    transactionType,
    ...restFormData
  }

  let response = await fetcher.post(
    `${host}/${API}/${agentId}/adjust/increase`,
    {
      data: formData
    }
  )

  let result = await response.json()
  if (!result.valid) {
    console.error("agent addBalance faile", result)
  }
  return result
}
