import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { goto } from "../sidebar.js"
import { selectRandomPlatform } from "../page/content.js"

const test = base.extend(Fixture)

test("edit vip level", async ({ page }) => {
  let brandId = await gotoVipLevelPage(page)
  let [id, vipLevel] = await editVipLevel(page)

  await page.click("#edit-vip-level-dialog-disclosure")

  let liveDealerRebate = await page.$eval(
    `#edit-vip-level-dialog input[name="liveDealerRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(liveDealerRebate).to.equal(vipLevel.liveDealerRebate)

  let slotRebate = await page.$eval(
    `#edit-vip-level-dialog input[name="slotRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(slotRebate).to.equal(vipLevel.slotRebate)

  let cardGameRebate = await page.$eval(
    `#edit-vip-level-dialog input[name="cardGameRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(cardGameRebate).to.equal(vipLevel.cardGameRebate)

  let sportsRebate = await page.$eval(
    `#edit-vip-level-dialog input[name="sportsRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(sportsRebate).to.equal(vipLevel.sportsRebate)

  let virtualSportsRebate = await page.$eval(
    `#edit-vip-level-dialog input[name="virtualSportsRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(virtualSportsRebate).to.equal(vipLevel.virtualSportsRebate)

  let lotteryRebate = await page.$eval(
    `#edit-vip-level-dialog input[name="lotteryRebate"]`,
    ({ value }) => parseInt(value)
  )
  expect(lotteryRebate).to.equal(vipLevel.lotteryRebate)
})

const editVipLevel = async (page) => {
  await page.click("#edit-vip-level-dialog-disclosure")
  await page.waitForSelector("#edit-vip-level-dialog")

  let id = await page.$eval(
    `#edit-vip-level-dialog input[name="id"]`,
    ({ value }) => value
  )
  expect(id).to.not.be.empty

  let vipLevel = {
    liveDealerRebate: random(0, 100),
    slotRebate: random(0, 100),
    cardGameRebate: random(0, 100),
    sportsRebate: random(0, 100),
    virtualSportsRebate: random(0, 100),
    lotteryRebate: random(0, 100)
  }

  await page.fill(
    `#edit-vip-level-dialog input[name="liveDealerRebate"]`,
    `${vipLevel.liveDealerRebate}`
  )
  await page.fill(
    `#edit-vip-level-dialog input[name="slotRebate"]`,
    `${vipLevel.slotRebate}`
  )
  await page.fill(
    `#edit-vip-level-dialog input[name="cardGameRebate"]`,
    `${vipLevel.cardGameRebate}`
  )
  await page.fill(
    `#edit-vip-level-dialog input[name="sportsRebate"]`,
    `${vipLevel.sportsRebate}`
  )
  await page.fill(
    `#edit-vip-level-dialog input[name="virtualSportsRebate"]`,
    `${vipLevel.virtualSportsRebate}`
  )
  await page.fill(
    `#edit-vip-level-dialog input[name="lotteryRebate"]`,
    `${vipLevel.lotteryRebate}`
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/vipLevel/${id}`) &&
        response.status() === 200
      )
    }),
    page.click(`#edit-vip-level-dialog button[type="submit"]`),
    page.waitForLoadState("networkidle")
  ])

  await page.waitForLoadState("domcontentloaded")
  return [id, vipLevel]
}

const gotoVipLevelPage = async (page) => {
  await goto({ page, value: "/platform/viplevel" })
  return await selectRandomPlatform(page)
}
