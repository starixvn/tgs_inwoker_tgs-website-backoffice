import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { selectRandomPlatform } from "../page/content.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("edit vip level", async ({ page }) => {
  let brandId = await gotoVipLevelPage(page)
  let [id, vipLevel] = await editVipLevel(page)

  let EditVipDialogSelector = `#edit-vip-level-dialog`
  await openDialog(page, EditVipDialogSelector)

  let liveDealerRebate = await page.$eval(
    `${EditVipDialogSelector} input[name="liveDealerRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(liveDealerRebate).to.equal(vipLevel.liveDealerRebate)

  let slotRebate = await page.$eval(
    `${EditVipDialogSelector} input[name="slotRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(slotRebate).to.equal(vipLevel.slotRebate)

  let cardGameRebate = await page.$eval(
    `${EditVipDialogSelector} input[name="cardGameRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(cardGameRebate).to.equal(vipLevel.cardGameRebate)

  let sportsRebate = await page.$eval(
    `${EditVipDialogSelector} input[name="sportsRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(sportsRebate).to.equal(vipLevel.sportsRebate)

  let virtualSportsRebate = await page.$eval(
    `${EditVipDialogSelector} input[name="virtualSportsRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(virtualSportsRebate).to.equal(vipLevel.virtualSportsRebate)

  let lotteryRebate = await page.$eval(
    `${EditVipDialogSelector} input[name="lotteryRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(lotteryRebate).to.equal(vipLevel.lotteryRebate)

  let withdrawTransactionsPerDay = await page.$eval(
    `${EditVipDialogSelector} input[name="withdrawTransactionsPerDay"]`,
    ({ value }) => parseInt(value)
  )
  expect(withdrawTransactionsPerDay).to.equal(
    vipLevel.withdrawTransactionsPerDay
  )

  let withdrawTotalAmountPerDay = await page.$eval(
    `${EditVipDialogSelector} input[name="withdrawTotalAmountPerDay"]`,
    ({ value }) => parseInt(value)
  )
  expect(withdrawTotalAmountPerDay).to.equal(vipLevel.withdrawTotalAmountPerDay)
})

const editVipLevel = async (page) => {
  let EditVipDialogSelector = `#edit-vip-level-dialog`
  await openDialog(page, EditVipDialogSelector)

  let id = await page.$eval(
    `${EditVipDialogSelector} input[name="id"]`,
    ({ value }) => value
  )
  expect(id).to.not.be.empty

  let vipLevel = {
    liveDealerRebate: random(0, 100),
    slotRebate: random(0, 100),
    cardGameRebate: random(0, 100),
    sportsRebate: random(0, 100),
    virtualSportsRebate: random(0, 100),
    lotteryRebate: random(0, 100),
    withdrawTransactionsPerDay: random(10000, 100000),
    withdrawTotalAmountPerDay: random(10000, 100000)
  }

  await page.fill(
    `${EditVipDialogSelector} input[name="liveDealerRebate"]`,
    `${vipLevel.liveDealerRebate}`
  )
  await page.fill(
    `${EditVipDialogSelector} input[name="slotRebate"]`,
    `${vipLevel.slotRebate}`
  )
  await page.fill(
    `${EditVipDialogSelector} input[name="cardGameRebate"]`,
    `${vipLevel.cardGameRebate}`
  )
  await page.fill(
    `${EditVipDialogSelector} input[name="sportsRebate"]`,
    `${vipLevel.sportsRebate}`
  )
  await page.fill(
    `${EditVipDialogSelector} input[name="virtualSportsRebate"]`,
    `${vipLevel.virtualSportsRebate}`
  )
  await page.fill(
    `${EditVipDialogSelector} input[name="lotteryRebate"]`,
    `${vipLevel.lotteryRebate}`
  )

  //TODO: check if enabled?
  let enableWithdrawTransactionsPerDayLocator = page.locator(
    `${EditVipDialogSelector} input[type="checkbox"][name="enable-withdrawTransactionsPerDay"]`
  )
  let isEnableWithdrawTransactionsPerDay =
    await enableWithdrawTransactionsPerDayLocator.isChecked()
  if (!isEnableWithdrawTransactionsPerDay) {
    await enableWithdrawTransactionsPerDayLocator.check({ force: true })
  }
  await page.fill(
    `${EditVipDialogSelector} input[name="withdrawTransactionsPerDay"]`,
    `${vipLevel.withdrawTransactionsPerDay}`
  )

  let enableWithdrawTotalAmountPerDayLocator = page.locator(
    `${EditVipDialogSelector} input[type="checkbox"][name="enable-withdrawTotalAmountPerDay"]`
  )
  let isEnableWithdrawTotalAmountPerDay =
    await enableWithdrawTotalAmountPerDayLocator.isChecked()
  if (!isEnableWithdrawTotalAmountPerDay) {
    await enableWithdrawTotalAmountPerDayLocator.check({ force: true })
  }
  await page.fill(
    `${EditVipDialogSelector} input[name="withdrawTotalAmountPerDay"]`,
    `${vipLevel.withdrawTotalAmountPerDay}`
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/vipLevel/${id}`) &&
        response.status() === 200
      )
    }),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/vipLevel?`) && response.status() === 200
      )
    }),
    page.click(`#edit-vip-level-dialog button[type="submit"]`)
  ])

  return [id, vipLevel]
}

const gotoVipLevelPage = async (page) => {
  await page.goto("/platform/viplevel", { waitUntil: "networkidle" })
  return await selectRandomPlatform(page)
}
