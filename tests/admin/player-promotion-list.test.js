import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoPlayerListPage,
  searchPlayer,
  openViewPlayerDialog
} from "./player-list-page.js"
import { approveDeposit } from "./fund-deposit-page.js"

const test = base.extend(Fixture)

test("view player promotion list", async ({
  page,
  platformCode,
  platformToken,
  player,
  backofficeApi,
  operatorApi
}) => {
  //TODO: get brandId by api, not page
  let brandId = await gotoPlayerListPage(page, platformCode)
  let promotion = await backofficeApi.promotion.addFirstDeposit({
    brandId
  })

  const DepositAccount = "account"
  const DepositAmount = 100
  let formId = await operatorApi.deposit.applyManualDeposit(
    platformToken,
    player.token,
    {
      account: DepositAccount,
      amount: DepositAmount,
      promotionid: promotion.id
    }
  )
  await approveDeposit(page, platformCode, formId)

  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let dialogSelector = await openViewPlayerDialog(page)
  await page.click(`${dialogSelector} button#promotion`)

  let promotionNameLocator = page.locator(
    `${dialogSelector} [data-column-id="promotionName"]`
  )
  let promotionName = await promotionNameLocator.textContent()
  expect(promotionName).to.equals(promotion.name)
})
