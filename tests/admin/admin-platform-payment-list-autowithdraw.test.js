import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("platform autowithdraw", async ({
  page,
  licensee,
  backofficeApi,
  customBankManualPaymentMethodChannel,
  globalApi,
  operatorApi
}) => {
  let AutoWithdrawAmount = 10
  let platform = await backofficeApi.platform.addPlatform({
    licenseeId: licensee.id
  })

  let platformToken = await globalApi.platformToken(platform.code)
  let player = await operatorApi.player.createAndLogin(platformToken)

  let primePay = await backofficeApi.payment.provider.findByCode("PrimePay")
  let bankTransfer = await backofficeApi.payment.method.find("BankTransfer")
  let customBank = await backofficeApi.payment.channel.customBank()

  let primePayCustomBankPaymentMethodChannel =
    await backofficeApi.payment.paymentMethodChannel.findOrCreate(
      primePay.id,
      bankTransfer.id,
      customBank.id
    )

  let withdrawPayment = await backofficeApi.platform.payment.findOrCreate({
    brandId: platform.id,
    transferType: backofficeApi.platform.payment.TransferType.Withdrawal,
    paymentMethodChannelId: primePayCustomBankPaymentMethodChannel.id
  })

  await Promise.all([
    operatorApi.player.addBankCard(platformToken, player.token, {
      paymentchannelid: customBank.id
    }),
    gotoBrandPayments(page, platform.code),
    backofficeApi.player.addBalance(player.code, {
      amount: AutoWithdrawAmount
    })
  ])

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`transferType=Withdrawal`) &&
        response.status() === 200
      )
    }),
    page.click("#Withdrawal")
  ])

  let AutoWithdrawDialogSelector = `#auto-withdraw-dialog`
  await openDialog(page, AutoWithdrawDialogSelector)

  await page.click(
    `${AutoWithdrawDialogSelector} input[name="enableAutoWithdraw"][type="checkbox"] + .bb-CheckboxIcon`
  )

  await page
    .locator(`${AutoWithdrawDialogSelector} input[name="amountUpperLimit"]`)
    .fill(`${AutoWithdrawAmount}`)

  await page
    .locator(
      `${AutoWithdrawDialogSelector} table thead input[type="checkbox"] + .bb-CheckboxIcon`
    )
    .click()

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response
          .url()
          .includes(`/api/brandpayment/autowithdraw/${platform.id}`) &&
        response.status() === 200
      )
    }),
    page.locator(`${AutoWithdrawDialogSelector} button[type="submit"]`).click()
  ])

  //TODO: withdraw form -> auto withdraw on local env?
  /*
  let formId = await operatorApi.withdraw.applyWithdraw(
    platformToken,
    player.token,
    {
      amount: AutoWithdrawAmount
    }
  )
  */
})

export const gotoBrandPayments = async (page, platformCode) => {
  await page.goto("/system/brandpayments", { waitUntil: "networkidle" })
  let brandId = await selectPlatformByCode(page, platformCode)
  return brandId
}
