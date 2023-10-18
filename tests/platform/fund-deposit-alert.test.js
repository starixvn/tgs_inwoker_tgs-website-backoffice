import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"

const test = base.extend(Fixture)

const SecondInMilliseconds = 1000
test.use({ timeout: 40 * SecondInMilliseconds })

test("deposit and withdraw alarm on header", async ({
  page,
  platform,
  player,
  host,
  backofficeApi
}) => {
  await page.goto(host, { waitUntil: "networkidle" })
  let depositAmount = 10
  let balance = await depositAlarm(
    page,
    backofficeApi,
    platform,
    player,
    depositAmount
  )
})

const depositAlarm = async (page, backofficeApi, platform, player, amount) => {
  const ExpectedDepositAmount = amount

  let formId = await backofficeApi.player.applyBankManualDepositForm({
    brandId: platform.id,
    playerCode: player.code,
    amount: ExpectedDepositAmount
  })

  let AlarmSelector = `#fund-deposit-notify`
  await page.waitForSelector(AlarmSelector, {
    timeout: 30 * SecondInMilliseconds
  })
  let unprocessedString = await page.$eval(
    AlarmSelector,
    ({ dataset }) => dataset.unprocessed
  )
  let unprocessed = numeral(unprocessedString).value()
  expect(unprocessed).to.be.above(0)
}
