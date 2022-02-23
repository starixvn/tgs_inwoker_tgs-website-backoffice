import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import faker from "@faker-js/faker"
const { lorem } = faker

const API = "api/Round"
export const settleOpenRound = async (
  roundId,
  { remark = lorem.word(), ...data } = {}
) => {
  let url = `${host}/${API}/${roundId}/CloseGameRound`

  let response = await fetcher.put(url, {
    data: {
      remark,
      ...data
    },
    failOnStatusCode: true
  })

  return await response.json()
}
