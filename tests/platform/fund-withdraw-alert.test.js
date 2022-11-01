import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)
const { finance } = faker

const SecondInMilliseconds = 1000
test.use({ timeout: 40 * SecondInMilliseconds })

test("deposit and withdraw alarm on header", async ({
  page,
  platformToken,
  player,
  operatorApi,
  backofficeApi,
  host
}) => {
  let depositAmount = 10
  await Promise.all([
    page.goto(host, { waitUntil: "networkidle" }),
    operatorApi.player.addManualBankCard(platformToken, player.token),
    backofficeApi.player.addBalance(player.code, {
      amount: depositAmount
    })
  ])

  let withdrawAmount = depositAmount
  await withdrawAlarm(page, operatorApi, platformToken, player, withdrawAmount)
})

const withdrawAlarm = async (
  page,
  operatorApi,
  platformToken,
  player,
  withdrawAmount
) => {
  let formId = await operatorApi.withdraw.applyManualWithdraw(
    platformToken,
    player.token,
    {
      amount: withdrawAmount
    }
  )

  let AlarmSelector = `#fund-withdraw-notify`
  await page.waitForSelector(AlarmSelector, {
    timeout: 16 * SecondInMilliseconds
  })
  let unprocessedString = await page.$eval(
    AlarmSelector,
    ({ dataset }) => dataset.unprocessed
  )
  let unprocessed = numeral(unprocessedString).value()
  expect(unprocessed).to.be.above(0)
}
