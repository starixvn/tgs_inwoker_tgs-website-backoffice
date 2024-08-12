import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"
import { gotoAgentListPage, searchAgent } from "./agent-list-page.js"

const test = base.extend(Fixture)

test("new agent with default product fee", async ({
  page,
  agentProductFeePlatform: platform,
  backofficeApi
}) => {
  const DefaultProductFee = platform.productFee
  let [agent] = await Promise.all([
    backofficeApi.agent.addAgent({ brandId: platform.id }),
    gotoAgentListPage(page, platform.code)
  ])

  await Promise.all([
    agentWithDefaultProductFee({ backofficeApi, agent, DefaultProductFee }),
    searchAgent(page, agent.username)
  ])

  let DialogSelector = `#agent-product-fee-dialog`
  await openDialog(page, DialogSelector)

  const fields = [
    "currentLiveDealerPercentage",
    "nextLiveDealerPercentage",
    "currentSportsPercentage",
    "nextSportsPercentage",
    "currentSlotPercentage",
    "nextSlotPercentage",
    "currentCardGamePercentage",
    "nextCardGamePercentage",
    "currentLotteryPercentage",
    "nextLotteryPercentage",
    "currentVirtualSportsPercentage",
    "nextVirtualSportsPercentage"
  ]

  const expected = await fields.reduce(async (promise, field) => {
    const result = await promise
    const value = faker.number.int({ min: 1, max: 20 })
    await page
      .locator(`${DialogSelector} input[name="${field}"]`)
      .fill(`${value}`)

    return { ...result, [field]: value }
  }, Promise.resolve({}))

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/AgentProductFee`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let agentProductFee = await backofficeApi.agent.productFee.get(agent.id)
  fields.forEach((field) => {
    expect(agentProductFee[field]).to.equal(expected[field])
  })
})

const agentWithDefaultProductFee = async ({
  backofficeApi,
  agent,
  DefaultProductFee
}) => {
  let agentProductFee = await backofficeApi.agent.productFee.get(agent.id)

  expect(agentProductFee.currentCardGamePercentage).equals(
    DefaultProductFee.cardGamePercentage
  )
  expect(agentProductFee.nextCardGamePercentage).equals(
    DefaultProductFee.cardGamePercentage
  )

  expect(agentProductFee.currentLiveDealerPercentage).equals(
    DefaultProductFee.liveDealerPercentage
  )
  expect(agentProductFee.nextLiveDealerPercentage).equals(
    DefaultProductFee.liveDealerPercentage
  )

  expect(agentProductFee.currentLotteryPercentage).equals(
    DefaultProductFee.lotteryPercentage
  )
  expect(agentProductFee.nextLotteryPercentage).equals(
    DefaultProductFee.lotteryPercentage
  )

  expect(agentProductFee.currentSlotPercentage).equals(
    DefaultProductFee.slotPercentage
  )
  expect(agentProductFee.nextSlotPercentage).equals(
    DefaultProductFee.slotPercentage
  )

  expect(agentProductFee.currentSportsPercentage).equals(
    DefaultProductFee.sportsPercentage
  )
  expect(agentProductFee.nextSportsPercentage).equals(
    DefaultProductFee.sportsPercentage
  )

  expect(agentProductFee.currentVirtualSportsPercentage).equals(
    DefaultProductFee.virtualSportsPercentage
  )
  expect(agentProductFee.nextVirtualSportsPercentage).equals(
    DefaultProductFee.virtualSportsPercentage
  )
}
