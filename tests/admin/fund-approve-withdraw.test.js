import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import numeral from "numeral"
import faker from "@faker-js/faker"
import { selectPlatformByCode } from "../page/content.js"
import { selectByLabel } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import {
  gotoFundWithdraw,
  approveWithdraw,
  reviewPaid
} from "./fund-withdraw-page.js"
import {
  gotoPlatformListPage,
  searchPlatform,
  updatePlatform
} from "./platform-list-page.js"

const test = base.extend(Fixture)
const { finance } = faker

test("approve player fund withdraw and paid", async ({
  page,
  platformCode,
  platformToken,
  player,
  backofficeApi,
  operatorApi
}) => {
  let depositAmount = 100
  let [platform] = await Promise.all([
    backofficeApi.platform.getPlatform(platformCode),
    operatorApi.player.addManualBankCard(platformToken, player.token)
  ])

  if (platform.enablePlayerIdentity) {
    await gotoPlatformListPage(page)
    await searchPlatform(page, platformCode)
    await updatePlatform(page, { enablePlayerIdentity: false })
  }

  let [brandId] = await Promise.all([
    gotoFundWithdraw(page, platformCode),
    backofficeApi.player.addBalance(player.code, {
      amount: depositAmount
    })
  ])

  let withdrawAmount = depositAmount
  let formId = await approveWithdraw(
    page,
    operatorApi,
    brandId,
    platformToken,
    player,
    withdrawAmount
  )

  let Approve = "Approve"
  await reviewPaid(page, platformCode, formId, Approve)
})
